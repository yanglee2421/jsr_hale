import { fakerZH_CN as faker } from "@faker-js/faker";
import { createDB } from "./db";
import * as schema from "./db/schema";
import { seed } from "drizzle-seed";

const main = async () => {
  const dbPath = "postgresql://postgres:test123456@localhost:5432/postgres";
  const db = createDB(dbPath);
  void faker;

  await seed(db, schema, { count: 100 });

  console.log("Finished Database Update");
};

main();
