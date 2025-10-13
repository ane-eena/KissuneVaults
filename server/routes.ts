import type { Express } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import multer from "multer";
import { MongoStorage, storage } from "./storage";
import { CardSyncService } from "./card-sync";
import { uploadImageToS3 } from "./s3";
import { insertCardSchema } from "@shared/schema";
import { requireAuth, requireOwner } from "./auth";

// Initialize card sync service
const cardSyncService = new CardSyncService(storage as MongoStorage);

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.get("/auth/discord", passport.authenticate("discord"));

  app.get(
    "/auth/discord/callback",
    passport.authenticate("discord", { failureRedirect: "/" }),
    (req, res) => {
      console.log("✅ OAuth callback successful, user:", req.user);
      console.log("🍪 Session ID:", req.sessionID);
      console.log("🔐 Is authenticated:", req.isAuthenticated());
      res.redirect("/");
    }
  );

  app.get("/auth/logout", (req, res) => {
    req.logout(() => {
      res.redirect("/");
    });
  });

  app.get("/auth/user", (req, res) => {
    console.log("📍 /auth/user - Is authenticated:", req.isAuthenticated(), "User:", req.user);
    if (req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.json({ user: null });
    }
  });

  // Debug endpoint to inspect JSON file structure
  app.get("/api/debug/json/:filename", async (req, res) => {
    try {
      const { fetchBotJSON } = await import('./sftp');
      const data = await fetchBotJSON(req.params.filename);
      res.json({
        filename: req.params.filename,
        keys: Object.keys(data),
        structure: data,
        cardsCount: data.cards?.length || 0
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all cards (public) - combines bot JSON + MongoDB customs
  app.get("/api/cards", async (_req, res) => {
    try {
      const cards = await cardSyncService.getAllCards();
      res.json(cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      res.status(500).json({ error: "Failed to fetch cards" });
    }
  });

  // Get single card (public) - searches both bot cards and MongoDB customs
  app.get("/api/cards/:id", async (req, res) => {
    try {
      // Get all cards from sync service (includes bot + customs)
      const allCards = await cardSyncService.getAllCards();
      const card = allCards.find(c => c._id === req.params.id);
      
      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }
      res.json(card);
    } catch (error) {
      console.error("Error fetching card:", error);
      res.status(500).json({ error: "Failed to fetch card" });
    }
  });

  // Create card via Discord bot (with shared secret)
  app.post("/api/bot/cards", upload.single("image"), async (req, res) => {
    try {
      const sharedSecret = req.headers["x-shared-secret"];
      if (sharedSecret !== process.env.ANNOUNCE_SHARED_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }

      // Upload image to S3
      const imageUrl = await uploadImageToS3(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );

      // Parse and validate card data with new fields
      const cardData = insertCardSchema.parse({
        name: req.body.name,
        imageUrl,
        itemType: req.body.itemType || "cards",
        category: req.body.category || "regular",
        idolName: req.body.idolName,
        theme: req.body.theme,
        group: req.body.group,
        subcat: req.body.subcat,
        code: req.body.code,
        printNumber: req.body.printNumber ? parseInt(req.body.printNumber) : 1,
        canvasWidth: req.body.canvasWidth ? parseInt(req.body.canvasWidth) : undefined,
        canvasHeight: req.body.canvasHeight ? parseInt(req.body.canvasHeight) : undefined,
        description: req.body.description,
        discordUserId: req.body.discordUserId,
        discordUsername: req.body.discordUsername,
      });

      const card = await storage.createCard(cardData);
      res.status(201).json({ success: true, card, imageUrl });
    } catch (error) {
      console.error("Error creating card from bot:", error);
      res.status(500).json({ error: "Failed to create card" });
    }
  });

  // Create card via web (requires owner auth)
  app.post("/api/cards", requireOwner, upload.single("image"), async (req, res) => {
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
        itemType: req.body.itemType || "cards",
        category: req.body.category || "regular",
        idolName: req.body.idolName,
        theme: req.body.theme,
        group: req.body.group,
        subcat: req.body.subcat,
        code: req.body.code,
        printNumber: req.body.printNumber ? parseInt(req.body.printNumber) : 1,
        canvasWidth: req.body.canvasWidth ? parseInt(req.body.canvasWidth) : undefined,
        canvasHeight: req.body.canvasHeight ? parseInt(req.body.canvasHeight) : undefined,
        description: req.body.description,
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

  // Update card (owner only)
  app.patch("/api/cards/:id", requireOwner, async (req, res) => {
    try {
      const updateData = {
        ...req.body,
        printNumber: req.body.printNumber ? parseInt(req.body.printNumber) : undefined,
        canvasWidth: req.body.canvasWidth ? parseInt(req.body.canvasWidth) : undefined,
        canvasHeight: req.body.canvasHeight ? parseInt(req.body.canvasHeight) : undefined,
      };

      const card = await storage.updateCard(req.params.id, updateData);
      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }
      res.json(card);
    } catch (error) {
      console.error("Error updating card:", error);
      res.status(500).json({ error: "Failed to update card" });
    }
  });

  // Delete card (owner only)
  app.delete("/api/cards/:id", requireOwner, async (req, res) => {
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
