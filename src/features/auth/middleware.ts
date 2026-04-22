import { deleteCookie, getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { validateSessionToken } from "./session";

type Variables = {
  user: { id: string } | null;
};

export const authMiddleware = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const token = getCookie(c, "auth_session");

    if (!token) {
      c.set("user", null);
      await next();
      return;
    }

    const result = await validateSessionToken(token);

    if (!result) {
      // Invalid or expired session
      deleteCookie(c, "auth_session", { path: "/" });
      c.set("user", null);
    } else {
      c.set("user", { id: result.userId });
    }

    await next();
  },
);

export const authRequiredMiddleware = createMiddleware<{
  Variables: Variables;
}>(async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.redirect("/login");
  }
  await next();
});

export const guestOnlyMiddleware = createMiddleware<{
  Variables: Variables;
}>(async (c, next) => {
  const user = c.get("user");
  if (user) {
    return c.redirect("/");
  }
  await next();
});
