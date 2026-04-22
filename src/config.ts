import * as v from "valibot";

export const configSchema = v.object({
  PORT: v.optional(v.pipe(v.string(), v.toNumber()), "3000"),
  NODE_ENV: v.optional(
    v.picklist(["development", "production", "test"]),
    "development",
  ),
  DATABASE_URL: v.string(),
});

export const { PORT, NODE_ENV, DATABASE_URL } = v.parse(configSchema, {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
});
