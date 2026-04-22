import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { jsxRenderer } from "hono/jsx-renderer";
import home from "./features/home/routes";
import RootLayout from "./shared/RootLayout";

const app = new Hono();

app.use("/*", serveStatic({ root: "./public" }));

app.use(
  "*",
  jsxRenderer(({ children, title }) => (
    <RootLayout title={title}>{children}</RootLayout>
  )),
);

app.route("/", home);

export default app;
