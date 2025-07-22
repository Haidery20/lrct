import { users, membershipApplications, type User, type InsertUser, type MembershipApplication, type InsertMembershipApplication } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createMembershipApplication(insertApplication: InsertMembershipApplication): Promise<MembershipApplication>;
  getNextReferenceNumber(): Promise<string>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getNextReferenceNumber(): Promise<string> {
    // Get the latest application to determine the next reference number
    const [latestApp] = await db
      .select()
      .from(membershipApplications)
      .orderBy(desc(membershipApplications.id))
      .limit(1);

    let nextNumber = 1;
    if (latestApp) {
      // Extract number from reference like "LRCT/Adm/001"
      const match = latestApp.referenceNumber.match(/LRCT\/Adm\/(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1]) + 1;
      }
    }

    // Format as 3-digit number with leading zeros
    return `LRCT/Adm/${nextNumber.toString().padStart(3, '0')}`;
  }

  async createMembershipApplication(insertApplication: InsertMembershipApplication): Promise<MembershipApplication> {
    const referenceNumber = await this.getNextReferenceNumber();
    
    const [application] = await db
      .insert(membershipApplications)
      .values({
        ...insertApplication,
        referenceNumber,
      })
      .returning();
    
    return application;
  }
}

export const storage = new DatabaseStorage();
