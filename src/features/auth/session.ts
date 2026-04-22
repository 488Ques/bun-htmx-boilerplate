import crypto from "node:crypto";
import { kysely } from "../../db/client";

export const SESSION_EXPIRY_SECONDS = 60 * 60 * 24 * 30; // 30 days

// Generate a secure random string (for IDs and secrets)
function generateSecureRandomString(length: number = 40): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

// Hash the session secret with SHA-256 (fast, secure for high-entropy secrets)
async function hashSecret(secret: string): Promise<Buffer> {
  const encoder = new TextEncoder();
  const data = encoder.encode(secret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(hashBuffer);
}

// Constant-time comparison to prevent timing attacks
function constantTimeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = generateSecureRandomString(20); // ~80 bits of entropy
  const secret = generateSecureRandomString(40); // ~160 bits of entropy
  const secretHash = await hashSecret(secret);
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_SECONDS * 1000);

  await kysely
    .insertInto("session")
    .values({
      id: sessionId,
      userId: userId,
      secretHash: secretHash,
      expiresAt: expiresAt,
    })
    .execute();

  return `${sessionId}.${secret}`; // The full token
}

export async function validateSessionToken(
  token: string,
): Promise<{ userId: string } | null> {
  const [sessionId, secret] = token.split(".");
  if (!sessionId || !secret) return null;

  const session = await kysely
    .selectFrom("session")
    .selectAll()
    .where("id", "=", sessionId)
    .executeTakeFirst();

  if (!session) return null;

  // Check expiration
  if (new Date() > new Date(session.expiresAt)) {
    await kysely.deleteFrom("session").where("id", "=", sessionId).execute();
    return null;
  }

  // Verify secret hash
  const secretHash = await hashSecret(secret);
  if (!constantTimeEqual(secretHash, session.secretHash)) {
    return null;
  }

  // Optional: Renew session if it's nearing expiration (sliding window)
  const renewalThreshold = new Date(
    Date.now() + SESSION_EXPIRY_SECONDS * 1000 * 0.5,
  ); // Renew if >50% expired
  if (new Date() > renewalThreshold) {
    const newExpiresAt = new Date(Date.now() + SESSION_EXPIRY_SECONDS * 1000);
    await kysely
      .updateTable("session")
      .set({ expiresAt: newExpiresAt })
      .where("id", "=", sessionId)
      .execute();
  }

  return { userId: session.userId };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await kysely.deleteFrom("session").where("id", "=", sessionId).execute();
}
