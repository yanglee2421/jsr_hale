import { faker } from "@faker-js/faker";
import { createDB } from "./db";
import * as schema from "./db/schema";

const statusOptions = ["available", "maintenance", "fault"] as const;
type Status = (typeof statusOptions)[number];

const main = async () => {
  const dbPath = "postgresql://postgres:test123456@localhost:5432/postgres";
  const db = createDB(dbPath);

  await db.transaction(async (tx) => {});

  console.log("Finished Database Update");
};

main();
