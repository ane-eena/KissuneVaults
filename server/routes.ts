import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { uploadImageToS3 } from "./s3";
import { insertCardSchema } from "@shared/schema";
import { seedDemoCards } from "./seed-data";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed demo cards on startup
  seedDemoCards();
  // Get all cards
  app.get("/api/cards", async (_req, res) => {
    try {
      const cards = await storage.getAllCards();
      res.json(cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      res.status(500).json({ error: "Failed to fetch cards" });
    }
  });

  // Get single card
  app.get("/api/cards/:id", async (req, res) => {
    try {
      const card = await storage.getCard(req.params.id);
      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }
      res.json(card);
    } catch (error) {
      console.error("Error fetching card:", error);
      res.status(500).json({ error: "Failed to fetch card" });
    }
  });

  // Create card (web upload or Discord bot)
  app.post("/api/cards", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }

      // Upload image to S3
      const imageUrl = await uploadImageToS3(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      // Parse and validate card data
      const cardData = insertCardSchema.parse({
        name: req.body.name,
        imageUrl,
        rarity: req.body.rarity || "common",
        description: req.body.description || "",
        discordUserId: req.body.discordUserId,
        discordUsername: req.body.discordUsername,
      });

      const card = await storage.createCard(cardData);
      res.status(201).json(card);
    } catch (error) {
      console.error("Error creating card:", error);
      res.status(500).json({ error: "Failed to create card" });
    }
  });

  // Delete card
  app.delete("/api/cards/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCard(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Card not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting card:", error);
      res.status(500).json({ error: "Failed to delete card" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
