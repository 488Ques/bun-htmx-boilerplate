import "hono";

declare module "hono" {
  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: Hono requires object type
    (content: string | Promise<string>, props?: { title: string }): Response;
  }
}
