import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: uuid().primaryKey(),
  title: text().notNull(),
  done: boolean().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull(),
  deletedAt: timestamp({ withTimezone: true }),
});
