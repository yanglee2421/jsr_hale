import {
  boolean,
  decimal,
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export type User = typeof userTable.$inferSelect;
export type ChargingCabinet = typeof cabinetTable.$inferSelect;
export type ChargingSocket = typeof socketTable.$inferSelect;
export type Session = typeof sessionTable.$inferSelect;
export type UserFeedback = typeof userFeedbackTable.$inferSelect;
export type ChargingOrder = typeof orderTable.$inferSelect;
export type PaymentRecord = typeof paymentRecordTable.$inferSelect;

export const socketTypeEnum = pgEnum("socket_type", [
  "fast",
  "slow",
  "compatible",
]);
export const socketStatusEnum = pgEnum("socket_status", [
  "available",
  "in_use",
  "fault",
  "maintenance",
]);
export const chargingStatusEnum = pgEnum("charging_status", [
  "available",
  "maintenance",
  "fault",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
]);
export const paymentTypeEnum = pgEnum("payment_type", [
  "charge_balance",
  "wechat_pay",
  "ali_pay",
]);
export const deviceMaintenanceTypeEnum = pgEnum("device_maintenance_type", [
  "fault_report",
  "routine_maintenance",
  "fault_repair",
]);
export const deviceMaintenanceStatusEnum = pgEnum("device_maintenance_status", [
  "pending",
  "in_progress",
  "completed",
]);
export const userFeedbackEnum = pgEnum("user_feedback_status", [
  "pending",
  "replied",
  "resolved",
]);

export const userTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  phone: varchar({ length: 20 }).notNull().unique(),
  password: varchar({ length: 64 }),
  nickname: varchar({ length: 50 }),
  real_name: varchar({ length: 50 }),
  balance: decimal({ precision: 10, scale: 2 }).notNull().default("0.00"),
  status: boolean().notNull().default(true),
  create_time: timestamp({ withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  update_time: timestamp({ withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const sessionTable = pgTable(
  "sessions",
  {
    id: uuid().primaryKey().defaultRandom(),
    expires_at: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    create_time: timestamp({ withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
    update_time: timestamp({ withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date().toISOString()),

    user_id: integer()
      .notNull()
      .references(() => userTable.id),
  },
  (table) => [
    index("idx_sessions_user_id").on(table.user_id),
    index("idx_sessions_expires_at").on(table.expires_at),
  ],
);

export const cabinetTable = pgTable("charging_cabinets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  cabinet_code: varchar({ length: 30 }).notNull().unique(),
  province: varchar({ length: 20 }),
  city: varchar({ length: 20 }),
  district: varchar({ length: 20 }),
  detail_address: varchar({ length: 255 }),
  longitude: decimal({ precision: 10, scale: 6 }),
  latitude: decimal({ precision: 10, scale: 6 }),
  status: chargingStatusEnum().notNull().default("available"),
  create_time: timestamp({ withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  update_time: timestamp({
    withTimezone: true,
    mode: "string",
  })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),
});

export const socketTable = pgTable("charging_sockets", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  socket_code: varchar({ length: 30 }).notNull().unique(),
  socket_type: socketTypeEnum().notNull().default("slow"),
  rated_voltage: decimal({ precision: 5, scale: 1 }).notNull(),
  rated_current: decimal({ precision: 5, scale: 1 }).notNull(),
  rated_power: decimal({ precision: 5, scale: 1 }).notNull(),
  status: socketStatusEnum().notNull().default("available"),
  last_used_time: timestamp({ withTimezone: true, mode: "string" }),
  fault_note: varchar({ length: 255 }),
  create_time: timestamp({ withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  update_time: timestamp({ withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),

  cabinet_id: integer()
    .notNull()
    .references(() => cabinetTable.id),
});

export const socketRunningRecordTable = pgTable("socket_running_records", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  record_time: timestamp({ withTimezone: true, mode: "string" }),
  real_voltage: decimal({ precision: 5, scale: 1 }),
  real_current: decimal({ precision: 5, scale: 1 }),
  real_power: decimal({ precision: 5, scale: 1 }),
  current_kwh: decimal({ precision: 10, scale: 2 }),
  temperature: decimal({ precision: 4, scale: 1 }),

  socket_id: integer()
    .notNull()
    .references(() => socketTable.id),
  order_id: integer().references(() => orderTable.id),
});

export const orderTable = pgTable("charging_orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  order_status: orderStatusEnum().notNull().default("pending"),
  start_time: timestamp({ withTimezone: true, mode: "string" }),
  end_time: timestamp({ withTimezone: true, mode: "string" }),
  total_kwh: decimal({ precision: 10, scale: 2 }).default("0.00"),
  total_amount: decimal({ precision: 10, scale: 2 }).default("0.00"),
  paid_amount: decimal({ precision: 10, scale: 2 }).default("0.00"),
  payment_status: paymentStatusEnum().notNull().default("pending"),
  create_time: timestamp({ withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  update_time: timestamp({ withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date().toISOString()),

  user_id: integer()
    .notNull()
    .references(() => userTable.id),
  socket_id: integer().references(() => socketTable.id),
  cabinet_id: integer().references(() => cabinetTable.id),
});

export const paymentRecordTable = pgTable("payment_records", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  payment_amount: decimal({ precision: 10, scale: 2 }),
  payment_type: paymentTypeEnum().notNull().default("charge_balance"),
  payment_status: paymentStatusEnum().notNull().default("pending"),
  transaction_id: varchar({ length: 64 }),
  create_time: timestamp({ withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),

  order_id: integer()
    .notNull()
    .references(() => orderTable.id),
  user_id: integer().references(() => userTable.id),
});

export const deviceMaintenanceTable = pgTable("device_maintenance", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  type: deviceMaintenanceTypeEnum().notNull().default("fault_report"),
  content: varchar({ length: 500 }),
  status: deviceMaintenanceStatusEnum().notNull().default("pending"),
  handle_time: timestamp({ withTimezone: true, mode: "string" }),
  create_time: timestamp({ withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),

  handler_id: integer().references(() => userTable.id),
  cabinet_id: integer().references(() => cabinetTable.id),
  socket_id: integer()
    .notNull()
    .references(() => socketTable.id),
});

export const userFeedbackTable = pgTable("user_feedback", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  content: varchar({ length: 1000 }),
  status: userFeedbackEnum().notNull().default("pending"),
  reply_content: varchar({ length: 1000 }),
  create_time: timestamp({ withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),

  user_id: integer().references(() => userTable.id),
  cabinet_id: integer(),
  socket_id: integer(),
  order_id: integer(),
});
