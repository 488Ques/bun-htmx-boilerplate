# Bun HTMX Boilerplate

A small Bun + Hono + HTMX starter.

## Stack

- Bun runtime and package manager
- Hono server with JSX rendering
- HTMX for server-rendered interactions
- Tailwind CSS v4 CLI
- Biome for linting and formatting

## Getting Started

Install dependencies:

```sh
bun install
```

Run the dev server:

```sh
bun run dev
```

Open http://localhost:3000

Use another port when needed:

```sh
PORT=3001 bun run dev:server
```

## Scripts

- `bun run dev` starts Tailwind watch mode and the hot-reloading Bun server.
- `bun run build` generates CSS and bundles the server into `dist/`.
- `bun run check` runs Biome checks.
- `bun run format` formats the project.
