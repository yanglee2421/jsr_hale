import { drizzle } from "drizzle-orm/bun-sql";
import { relations } from "./relations";
import * as schema from "./schema";
import { SQL } from "bun";

export type DB = ReturnType<typeof createDB>;

export const createDB = (connectionString: string) => {
  const pool = new SQL(connectionString);
  const db = drizzle({ client: pool, schema, relations });

  return db;
};
