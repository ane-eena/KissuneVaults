import { z } from "zod";

// Card schema for MongoDB
export const cardSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  imageUrl: z.union([z.string(), z.array(z.string())]), // Single image or array for double-sided cards
  itemType: z.enum(["cards", "wallpapers", "frames"]).default("cards"),
  category: z.enum(["limited", "event", "regular", "collabs"]).default("regular"),
  
  // New fields for K-pop cards
  idolName: z.string().optional(), // Name of the idol
  theme: z.string().optional(), // Theme of the card
  group: z.string().optional(), // Group name
  subcat: z.string().optional(), // Subcategory (optional)
  code: z.string().optional(), // Unique card code
  
  canvasWidth: z.number().optional(),
  canvasHeight: z.number().optional(),
  description: z.string().optional(),
  discordUserId: z.string().optional(),
  discordUsername: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const insertCardSchema = cardSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = z.infer<typeof cardSchema>;

// User schema for Discord OAuth
export const userSchema = z.object({
  _id: z.string().optional(),
  discordId: z.string(),
  username: z.string(),
  avatar: z.string().optional(),
  email: z.string().optional(),
  isOwner: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
});

export const insertUserSchema = userSchema.omit({
  _id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof userSchema>;

// Session data
export interface SessionData {
  userId: string;
  discordId: string;
  username: string;
  isOwner: boolean;
}
