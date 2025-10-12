import { InsertCard, Card } from "@shared/schema";
import { getCardsCollection } from "./mongodb";
import { ObjectId } from "mongodb";

export interface IStorage {
  getAllCards(): Promise<Card[]>;
  getCardById(id: string): Promise<Card | null>;
  createCard(data: InsertCard): Promise<Card>;
  updateCard(id: string, data: Partial<InsertCard>): Promise<Card | null>;
  deleteCard(id: string): Promise<boolean>;
}

class MongoStorage implements IStorage {
  async getAllCards(): Promise<Card[]> {
    const collection = await getCardsCollection();
    const cards = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return cards.map(card => ({
      ...card,
      _id: card._id?.toString(),
    })) as Card[];
  }

  async getCardById(id: string): Promise<Card | null> {
    const collection = await getCardsCollection();
    const card = await collection.findOne({ _id: new ObjectId(id) as any });
    if (!card) return null;
    return {
      ...card,
      _id: card._id?.toString(),
    } as Card;
  }

  async createCard(data: InsertCard): Promise<Card> {
    const collection = await getCardsCollection();
    const now = new Date();
    const cardData = {
      ...data,
      printNumber: data.printNumber || 1,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await collection.insertOne(cardData as any);
    const card = await collection.findOne({ _id: result.insertedId });
    
    return {
      ...card,
      _id: card?._id?.toString(),
    } as Card;
  }

  async updateCard(id: string, data: Partial<InsertCard>): Promise<Card | null> {
    const collection = await getCardsCollection();
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };
    
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) as any },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result) return null;
    
    return {
      ...result,
      _id: result._id?.toString(),
    } as Card;
  }

  async deleteCard(id: string): Promise<boolean> {
    const collection = await getCardsCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) as any });
    return result.deletedCount > 0;
  }
}

export const storage = new MongoStorage();
