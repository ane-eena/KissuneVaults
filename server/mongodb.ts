import { MongoClient, Db, Collection } from "mongodb";
import type { Card, User } from "@shared/schema";

let client: MongoClient | null = null;
let db: Db | null = null;

export async function connectToMongoDB(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("kissune");
    console.log("✅ Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
}

export async function getCardsCollection(): Promise<Collection<Card>> {
  const database = await connectToMongoDB();
  return database.collection<Card>("cards");
}

export async function getUsersCollection(): Promise<Collection<User>> {
  const database = await connectToMongoDB();
  return database.collection<User>("users");
}

export async function closeMongoDB() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("MongoDB connection closed");
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await closeMongoDB();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeMongoDB();
  process.exit(0);
});
