import { storage } from "./storage";

const kpopCollection = [
  // Cards
  {
    name: "Winter - Rich Man Energy",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=794&h=1154&fit=crop",
    itemType: "cards",
    category: "limited",
    canvasWidth: 794,
    canvasHeight: 1154,
    description: "aespa Winter exclusive limited photocard",
    discordUsername: "KpopCollector",
  },
  {
    name: "aespa - Rich Man All Members",
    imageUrl: "https://images.unsplash.com/photo-1619488289186-4c0e7d0a2e97?w=794&h=1154&fit=crop",
    itemType: "cards",
    category: "event",
    canvasWidth: 794,
    canvasHeight: 1154,
    description: "Special event card featuring all aespa members",
    discordUsername: "MYForever",
  },
  {
    name: "EXO Kai - Rover",
    imageUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=794&h=1154&fit=crop",
    itemType: "cards",
    category: "regular",
    canvasWidth: 794,
    canvasHeight: 1154,
    description: "EXO Kai from Rover era",
    discordUsername: "EXO-L",
  },
  {
    name: "Red Velvet Yeri - Cosmic",
    imageUrl: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=794&h=1154&fit=crop",
    itemType: "cards",
    category: "limited",
    canvasWidth: 794,
    canvasHeight: 1154,
    description: "Limited Yeri photocard from Cosmic album",
    discordUsername: "ReVeluv",
  },
  {
    name: "Seulgi - Lovers Universe",
    imageUrl: "https://images.unsplash.com/photo-1611162617263-4ec3f0d05e07?w=794&h=1154&fit=crop",
    itemType: "cards",
    category: "collabs",
    canvasWidth: 794,
    canvasHeight: 1154,
    description: "Collab special card from Lovers Universe",
    discordUsername: "SeulgiStan",
  },

  // Wallpapers
  {
    name: "Stray Kids Bang Chan - Maniac",
    imageUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=2635&h=1636&fit=crop",
    itemType: "wallpapers",
    category: "event",
    canvasWidth: 2635,
    canvasHeight: 1636,
    description: "Bang Chan Maniac era wallpaper",
    discordUsername: "StayForever",
  },
  {
    name: "Stray Kids Seungmin",
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=2635&h=1636&fit=crop",
    itemType: "wallpapers",
    category: "regular",
    canvasWidth: 2635,
    canvasHeight: 1636,
    description: "Seungmin stunning wallpaper",
    discordUsername: "SKZfan",
  },
  {
    name: "TXT Taehyun - Nightmare",
    imageUrl: "https://images.unsplash.com/photo-1619488289186-4c0e7d0a2e97?w=2635&h=1636&fit=crop",
    itemType: "wallpapers",
    category: "limited",
    canvasWidth: 2635,
    canvasHeight: 1636,
    description: "Limited wallpaper from Temptation Nightmare",
    discordUsername: "MOA_TXT",
  },

  // Frames
  {
    name: "Winter Gradient Frame",
    imageUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=794&h=1154&fit=crop",
    itemType: "frames",
    category: "regular",
    canvasWidth: 794,
    canvasHeight: 1154,
    description: "Elegant gradient frame for your cards",
    discordUsername: "FrameMaster",
  },
  {
    name: "aespa Holographic Frame",
    imageUrl: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=794&h=1154&fit=crop",
    itemType: "frames",
    category: "limited",
    canvasWidth: 794,
    canvasHeight: 1154,
    description: "Limited holographic frame effect",
    discordUsername: "FrameCollector",
  },
  {
    name: "K-pop Collab Frame",
    imageUrl: "https://images.unsplash.com/photo-1611162617263-4ec3f0d05e07?w=794&h=1154&fit=crop",
    itemType: "frames",
    category: "collabs",
    canvasWidth: 794,
    canvasHeight: 1154,
    description: "Special collaboration frame design",
    discordUsername: "FrameLover",
  },
];

export async function seedDemoCards() {
  try {
    const existingCards = await storage.getAllCards();
    
    if (existingCards.length === 0) {
      console.log("🌱 Seeding K-pop collection...");
      for (const item of kpopCollection) {
        await storage.createCard(item);
      }
      console.log(`✨ Added ${kpopCollection.length} K-pop items to collection`);
    } else {
      console.log(`ℹ️  Collection already has ${existingCards.length} items, skipping seed`);
    }
  } catch (error) {
    console.error("❌ Error seeding K-pop collection:", error);
  }
}
