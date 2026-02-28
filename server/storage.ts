
import { db } from "./db";
import {
  users,
  walletsData,
  type User,
  type InsertUser,
  type WalletData,
  type InsertWalletData
} from "@shared/schema";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createWalletData(userId: number, data: InsertWalletData): Promise<WalletData>;
  getWalletsByUser(userId: number): Promise<WalletData[]>;
  
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createWalletData(userId: number, data: InsertWalletData): Promise<WalletData> {
    const [wallet] = await db.insert(walletsData).values({
      ...data,
      userId,
    }).returning();
    return wallet;
  }

  async getWalletsByUser(userId: number): Promise<WalletData[]> {
    return await db.select().from(walletsData).where(eq(walletsData.userId, userId));
  }
}

export const storage = new DatabaseStorage();
