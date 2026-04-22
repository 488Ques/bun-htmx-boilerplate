import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { DATABASE_URL } from "../config";
import type { DB } from "./types";

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: DATABASE_URL,
    max: 10,
  }),
});

export const kysely = new Kysely<DB>({
  dialect,
  plugins: [new CamelCasePlugin()],
});

export type KyselyClient = typeof kysely;
