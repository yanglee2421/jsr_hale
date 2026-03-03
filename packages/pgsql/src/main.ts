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

  const sockets = faker.helpers.multiple(
    () => {
      return {
        socket_type: faker.helpers.arrayElement(["fast", "slow", "compatible"]),
        status: faker.helpers.arrayElement([
          "available",
          "in_use",
          "fault",
          "maintenance",
        ]),
        create_time: faker.date.past().toISOString(),
        update_time: faker.date.recent().toISOString(),
        socket_code: faker.string.alphanumeric(10),
        cabinet_id: faker.number.int({ min: 1, max: 600 }),
        rated_voltage: faker.string.numeric(3),
        rated_current: faker.string.numeric(3),
        rated_power: faker.string.numeric(3),
        last_used_time: faker.date.recent().toISOString(),
        fault_note: faker.lorem.sentence(),
      };
    },
    { count: 200 },
  );

  const orders = faker.helpers.multiple(
    () => {
      return {
        payment_status: faker.helpers.arrayElement([
          "pending",
          "paid",
          "failed",
          "refunded",
        ]),
        order_status: faker.helpers.arrayElement([
          "pending",
          "in_progress",
          "completed",
          "cancelled",
        ]),
        create_time: faker.date.past().toISOString(),
        update_time: faker.date.recent().toISOString(),
        cabinet_id: faker.number.int({ min: 200, max: 300 }),
        user_id: faker.helpers.arrayElement([1, 3, 4, 5]),
        socket_id: faker.number.int({ min: 210, max: 300 }),
        start_time: faker.date.past().toISOString(),
        end_time: faker.date.recent().toISOString(),
        total_kwh: "0",
        total_amount: "0",
        paid_amount: "0",
      };
    },
    { count: 200 },
  );

  await db.transaction(async (tx) => {
    await tx.insert(schema.chargingCabinetTable).values(values);
    await tx.insert(schema.chargingSocketTable).values(sockets);
    await tx.insert(schema.chargingOrderTable).values(orders);
  });

  console.log("Finished inserting data");
};

main();
