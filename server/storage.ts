import { type User, type InsertUser, type Card, type InsertCard } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Card methods
  getAllCards(): Promise<Card[]>;
  getCard(id: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  deleteCard(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cards: Map<string, Card>;

  constructor() {
    this.users = new Map();
    this.cards = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllCards(): Promise<Card[]> {
    return Array.from(this.cards.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getCard(id: string): Promise<Card | undefined> {
    return this.cards.get(id);
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = randomUUID();
    const card: Card = {
      id,
      name: insertCard.name,
      imageUrl: insertCard.imageUrl,
      itemType: insertCard.itemType || "cards",
      category: insertCard.category || "regular",
      canvasWidth: insertCard.canvasWidth || null,
      canvasHeight: insertCard.canvasHeight || null,
      description: insertCard.description || null,
      discordUserId: insertCard.discordUserId || null,
      discordUsername: insertCard.discordUsername || null,
      createdAt: new Date(),
    };
    this.cards.set(id, card);
    return card;
  }

  async deleteCard(id: string): Promise<boolean> {
    return this.cards.delete(id);
  }
}

export const storage = new MemStorage();
