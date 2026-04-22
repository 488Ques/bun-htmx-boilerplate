# Agent Instructions

## Runtime & Package Manager

- This repo uses **Bun** exclusively. Do not use `npm`, `node`, or `npx`.

## Developer Commands

| Command | What it does |
|---------|--------------|
| `bun install` | Install dependencies |
| `bun run dev` | Start Tailwind watch + hot-reload server (default port 3000) |
| `PORT=3001 bun run dev:server` | Start only the server on a custom port |
| `bun run build` | Build CSS + bundle server to `dist/` |
| `bun run start` | Run the production build from `dist/` |
| `bun run check` | Run Biome lint + format check |
| `bun run format` | Auto-format with Biome |
| `bun run db:codegen` | Regenerate `src/db/types.ts` from Postgres schema |

## Stack Quirks

- **JSX**: Import source is `hono/jsx` (set in `tsconfig.json`). Do not import `react` or `react/jsx-runtime`.
- **Tailwind CSS v4**: Config is CSS-based (`@import "tailwindcss"` in `public/css/base.css`). There is no `tailwind.config` file.
- **Biome**: Config at `biome.json`. Ignores `public/js`, `public/css/app.css`, and `dist/*`.
- **No tests** currently exist in the repo.

## Database

- **PostgreSQL** is required. Start it with `docker compose up -d`.
- **Query builder**: Kysely with `CamelCasePlugin` enabled. DB columns like `password_hash` map to `passwordHash` in TypeScript.
- **Migrations**: Run via `kysely-ctl` (installed as devDependency). Config is at `.config/kysely.config.ts`.
  - `bunx kysely-ctl migrate` – run pending migrations
  - `bunx kysely-ctl migrate down` – rollback one migration
  - `bunx kysely-ctl seed` – run seeds
- **Codegen**: After changing schema, run `bun run db:codegen` to update `src/db/types.ts`.

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — Postgres connection string
- `PORT` — optional, defaults to `3000`
- `NODE_ENV` — optional, defaults to `development`

## Entrypoints & Structure

- `src/index.ts` — Bun server entry (exports `{ port, fetch }`)
- `src/app.tsx` — Hono app: static files, auth middleware, JSX renderer, routes
- `src/config.ts` — Env validation via `valibot`
- `src/db/client.ts` — Kysely client
- `src/features/auth/` — Session-based auth (routes, middleware, sessions)
- `src/features/home/` — Demo task app (in-memory store, not DB-backed)
- `public/css/app.css` — Generated Tailwind output (do not edit manually)

## Build Artifacts

- `dist/` — Server bundle output
- `public/css/app.css` — Generated CSS

Both are gitignored and should be regenerated with `bun run build`.
