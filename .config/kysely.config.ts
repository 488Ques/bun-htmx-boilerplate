import { defineConfig } from "kysely-ctl";
import { kysely } from "../src/db/client";

export default defineConfig({
  kysely,
  migrations: {
    migrationFolder: "../src/db/migrations",
  },
  seeds: {
    seedFolder: "../src/db/seeds",
  },
});
