import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const membershipApplications = pgTable("membership_applications", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number").notNull().unique(),
  jinaLaMwombaji: text("jina_la_mwombaji").notNull(),
  tareheyaKuzaliwa: text("tarehe_ya_kuzaliwa").notNull(),
  jinsia: text("jinsia").notNull(),
  slp: text("slp").notNull(),
  anuaniKamili: text("anuani_kamili").notNull(),
  nambaYaSimu: text("namba_ya_simu").notNull(),
  baruaPepe: text("barua_pepe").notNull(),
  wasifuWaMwombaji: text("wasifu_wa_mwombaji").notNull(),
  umepatajeTaarifa: text("umepata_je_taarifa").notNull(),
  jinaLaMdhamini: text("jina_la_mdhamini").notNull(),
  slpYaMdhamini: text("slp_ya_mdhamini").notNull(),
  anuaniYaMdhamini: text("anuani_ya_mdhamini").notNull(),
  nambaYaSimuYaMdhamini: text("namba_ya_simu_ya_mdhamini").notNull(),
  baruaPepeYaMdhamini: text("barua_pepe_ya_mdhamini").notNull(),
  malezoYaMdhamini: text("malezo_ya_mdhamini").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMembershipApplicationSchema = createInsertSchema(membershipApplications).omit({
  id: true,
  referenceNumber: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMembershipApplication = z.infer<typeof insertMembershipApplicationSchema>;
export type MembershipApplication = typeof membershipApplications.$inferSelect;
