import { faker } from "@faker-js/faker";
import { createDB } from "./db";
import * as schema from "./db/schema";

const statusOptions = ["available", "maintenance", "fault"] as const;
type Status = (typeof statusOptions)[number];

const main = async () => {
  const dbPath = "postgresql://postgres:test123456@localhost:5432/postgres";
  const db = createDB(dbPath);

  const values = faker.helpers.multiple(
    () => {
      return {
        status: faker.helpers.arrayElement(statusOptions) as Status,
        create_time: faker.date.past().toISOString(),
        update_time: faker.date.recent().toISOString(),
        cabinet_code: faker.string.alphanumeric(10),
        province: null,
        city: null,
        district: null,
        detail_address: faker.location.streetAddress(),
        longitude: faker.location.longitude().toString(),
        latitude: faker.location.latitude().toString(),
      };
    },
    { count: 200 },
  );

  const rows = await db
    .insert(schema.chargingCabinetTable)
    .values(values)
    .returning();

  console.log(rows);
};

main();
