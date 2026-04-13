import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type SeverityLevel = "Low" | "Medium" | "High";

export interface Alert {
  id: string;
  type: "typhoon" | "flood" | "earthquake" | "landslide" | "fire";
  title: string;
  date: string;
  description: string;
  severity: SeverityLevel;
  location: string;
}
