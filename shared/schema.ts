
import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const walletsData = pgTable("wallets_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  phraseLength: integer("phrase_length").notNull(), // 12 or 24
  phrase: text("phrase").notNull(), // Stored as a single string or JSON
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  wallets: many(walletsData),
}));

export const walletsDataRelations = relations(walletsData, ({ one }) => ({
  user: one(users, {
    fields: [walletsData.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const insertWalletDataSchema = createInsertSchema(walletsData).pick({
  phraseLength: true,
  phrase: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type WalletData = typeof walletsData.$inferSelect;
export type InsertWalletData = z.infer<typeof insertWalletDataSchema>;
