import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { jsxRenderer } from "hono/jsx-renderer";
import { authMiddleware } from "./features/auth/middleware";
import auth from "./features/auth/routes";
import home from "./features/home/routes";
import RootLayout from "./views/RootLayout";

const app = new Hono();

app.use("/*", serveStatic({ root: "./public" }));
app.use("*", authMiddleware);

app.use(
  "*",
  jsxRenderer(({ children, title }) => (
    <RootLayout title={title}>{children}</RootLayout>
  )),
);

app.route("/", home);
app.route("/auth", auth);

export default app;
