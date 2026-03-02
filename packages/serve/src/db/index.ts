import SQL from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { relations } from "./relations";
import * as schema from "./schema";

export type DB = ReturnType<typeof createSqliteDB>;

export const createSqliteDB = (dbFile: string) => {
  const bunDB = new SQL(dbFile);
  const sqliteDB = drizzle({
    schema,
    relations,
    client: bunDB,
  });

  return sqliteDB;
};
