import { Hono } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import * as v from "valibot";
import { NODE_ENV } from "../../config";
import { kysely } from "../../db/client";
import { hashPassword, verifyPassword } from "../../lib/password";
import {
  createSession,
  invalidateSession,
  SESSION_EXPIRY_SECONDS,
} from "./session";
import AuthError from "./views/AuthError";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";

const auth = new Hono();

const RegisterSchema = v.object({
  email: v.pipe(v.string(), v.minLength(1), v.email()),
  password: v.pipe(v.string(), v.minLength(8)),
});

const LoginSchema = v.object({
  email: v.pipe(v.string(), v.minLength(1), v.email()),
  password: v.pipe(v.string(), v.minLength(1)),
});

auth.get("/login", (c) => {
  return c.render(<LoginPage />, { title: "Sign In" });
});

auth.get("/register", (c) => {
  return c.render(<RegisterPage />, { title: "Create Account" });
});

auth.post("/register", async (c) => {
  try {
    const body = await c.req.parseBody();
    const { email, password } = v.parse(RegisterSchema, body);

    const existingUser = await kysely
      .selectFrom("user")
      .select("id")
      .where("email", "=", email)
      .executeTakeFirst();

    if (existingUser) {
      return c.html(<AuthError message="Email already in use" />);
    }

    const passwordHash = await hashPassword(password);

    const [user] = await kysely
      .insertInto("user")
      .values({ email, passwordHash })
      .returning("id")
      .execute();

    const token = await createSession(user.id);

    setCookie(c, "auth_session", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: SESSION_EXPIRY_SECONDS,
      path: "/",
    });

    c.header("HX-Redirect", "/");
    return c.body(null);
  } catch (e) {
    if (v.isValiError(e)) {
      const message = e.issues.map((issue) => issue.message).join(", ");
      return c.html(<AuthError message={message} />);
    }
    throw e;
  }
});

auth.post("/login", async (c) => {
  try {
    const body = await c.req.parseBody();
    const { email, password } = v.parse(LoginSchema, body);

    const user = await kysely
      .selectFrom("user")
      .selectAll()
      .where("email", "=", email)
      .executeTakeFirst();

    if (!user) {
      return c.html(<AuthError message="Invalid email or password" />);
    }

    const valid = await verifyPassword(user.passwordHash, password);
    if (!valid) {
      return c.html(<AuthError message="Invalid email or password" />);
    }

    const token = await createSession(user.id);

    setCookie(c, "auth_session", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "Lax",
      maxAge: SESSION_EXPIRY_SECONDS,
      path: "/",
    });

    c.header("HX-Redirect", "/");
    return c.body(null);
  } catch (e) {
    if (v.isValiError(e)) {
      const message = e.issues.map((issue) => issue.message).join(", ");
      return c.html(<AuthError message={message} />);
    }
    throw e;
  }
});

auth.post("/logout", async (c) => {
  const token = getCookie(c, "auth_session");
  if (token) {
    const [sessionId] = token.split(".");
    await invalidateSession(sessionId);
  }
  deleteCookie(c, "auth_session", { path: "/" });
  return c.redirect("/auth/login");
});

export default auth;
