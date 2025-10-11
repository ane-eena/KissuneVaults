import { storage } from "./storage";

// Demo card data with placeholder images
const demoCards = [
  {
    name: "Mystic Dragon",
    imageUrl: "https://images.unsplash.com/photo-1578926078829-b6f6c3b6d171?w=800&h=800&fit=crop",
    rarity: "legendary",
    description: "A legendary dragon that commands the power of ancient magic",
    discordUsername: "CardMaster",
  },
  {
    name: "Forest Guardian",
    imageUrl: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=800&fit=crop",
    rarity: "ultra",
    description: "Protector of the enchanted forest",
    discordUsername: "NatureLover",
  },
  {
    name: "Crystal Knight",
    imageUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=800&h=800&fit=crop",
    rarity: "rare",
    description: "A warrior forged from pure crystal",
    discordUsername: "WarriorKing",
  },
  {
    name: "Shadow Assassin",
    imageUrl: "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=800&h=800&fit=crop",
    rarity: "rare",
    description: "Strikes from the darkness unseen",
    discordUsername: "ShadowPlayer",
  },
  {
    name: "Thunder Mage",
    imageUrl: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&h=800&fit=crop",
    rarity: "uncommon",
    description: "Master of lightning spells",
    discordUsername: "SpellCaster",
  },
  {
    name: "Ice Phoenix",
    imageUrl: "https://images.unsplash.com/photo-1551244072-5d12893278ab?w=800&h=800&fit=crop",
    rarity: "ultra",
    description: "A mythical bird that freezes everything in its path",
    discordUsername: "FrostMage",
  },
  {
    name: "Earth Golem",
    imageUrl: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&h=800&fit=crop",
    rarity: "common",
    description: "A sturdy defender made of stone and earth",
    discordUsername: "RockSolid",
  },
  {
    name: "Fire Spirit",
    imageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=800&fit=crop",
    rarity: "uncommon",
    description: "Embodies the fury of flames",
    discordUsername: "BlazeRunner",
  },
  {
    name: "Celestial Archer",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=800&fit=crop",
    rarity: "rare",
    description: "Arrows that never miss their mark",
    discordUsername: "StarShooter",
  },
  {
    name: "Void Walker",
    imageUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=800&fit=crop",
    rarity: "legendary",
    description: "Travels between dimensions at will",
    discordUsername: "DimensionHopper",
  },
  {
    name: "Ocean Serpent",
    imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop",
    rarity: "ultra",
    description: "Ruler of the deep seas",
    discordUsername: "WaveRider",
  },
  {
    name: "Wind Dancer",
    imageUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&h=800&fit=crop",
    rarity: "uncommon",
    description: "Moves with the grace of the wind",
    discordUsername: "AirBender",
  },
];

export async function seedDemoCards() {
  try {
    const existingCards = await storage.getAllCards();
    
    // Only seed if no cards exist (avoid duplicates)
    if (existingCards.length === 0) {
      console.log("🌱 Seeding demo cards...");
      for (const card of demoCards) {
        await storage.createCard(card);
      }
      console.log(`✅ Added ${demoCards.length} demo cards`);
    } else {
      console.log(`ℹ️  Database already has ${existingCards.length} cards, skipping seed`);
    }
  } catch (error) {
    console.error("❌ Error seeding demo cards:", error);
  }
}
