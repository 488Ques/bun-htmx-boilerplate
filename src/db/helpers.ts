import { type Kysely, sql } from "kysely";

export async function createUpdatedAtTrigger(
  db: Kysely<any>,
  tableName: string,
) {
  await sql`
    CREATE TRIGGER ${sql.raw(`update_${tableName}_updated_at`)}
    BEFORE UPDATE ON ${sql.ref(tableName)}
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `.execute(db);
}

export async function dropUpdatedAtTrigger(db: Kysely<any>, tableName: string) {
  await sql`
    DROP TRIGGER IF EXISTS update_${tableName}_updated_at ON ${sql.ref(
      tableName,
    )};
  `.execute(db);
}
