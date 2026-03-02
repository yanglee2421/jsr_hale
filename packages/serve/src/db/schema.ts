import * as sqlite from "drizzle-orm/sqlite-core";

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;

export const users = sqlite.sqliteTable("users", {
  id: sqlite.integer("id").primaryKey(),
  name: sqlite.text("name"),
  email: sqlite.text("email").unique(),
});

export const sessions = sqlite.sqliteTable("sessions", {
  id: sqlite.integer("id").primaryKey(),
  userId: sqlite.integer("user_id").notNull(),
  token: sqlite.text("token").unique(),
  expireAt: sqlite
    .integer("expire_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  createAt: sqlite
    .integer("create_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date()),
  updateAt: sqlite
    .integer("update_at", { mode: "timestamp" })
    .notNull()
    .$default(() => new Date())
    .$onUpdate(() => new Date()),
});
