import type { PropsWithChildren } from "hono/jsx";

type RootLayoutProps = PropsWithChildren & {
  title?: string;
};

export default function RootLayout({ children, title }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/css/app.css" />
        <script src="/js/htmx@2.0.8.min.js" defer></script>
        <title>{title ?? "Bun HTMX Boilerplate"}</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
