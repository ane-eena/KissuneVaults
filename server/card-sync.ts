import { fetchAllBotCards } from './sftp';
import { MongoDBStorage } from './storage';
import { Card } from '@shared/schema';

interface BotCard {
  name: string;
  subcat?: string;
  group?: string;
  theme?: string;
  code?: string;
  image: string;
}

// Convert bot JSON format to our Card format
function convertBotCardToCard(
  botCard: BotCard,
  itemType: 'cards' | 'wallpapers' | 'frames',
  category: 'limited' | 'event' | 'regular'
): Omit<Card, '_id' | 'createdAt' | 'updatedAt'> {
  return {
    name: botCard.name,
    imageUrl: botCard.image,
    itemType,
    category,
    idolName: botCard.name, // The name field in bot JSON is the idol name
    theme: botCard.theme,
    group: botCard.group,
    subcat: botCard.subcat,
    code: botCard.code,
    printNumber: 1,
  };
}

// Count prints: how many times the same code appears
function countPrints(cards: BotCard[]): Map<string, number> {
  const printCounts = new Map<string, number>();
  
  for (const card of cards) {
    if (card.code) {
      const count = printCounts.get(card.code) || 0;
      printCounts.set(card.code, count + 1);
    }
  }
  
  return printCounts;
}

// Assign print numbers to cards with the same code
function assignPrintNumbers(cards: BotCard[]): BotCard[] {
  const codeTracker = new Map<string, number>();
  
  return cards.map(card => {
    if (card.code) {
      const currentPrint = (codeTracker.get(card.code) || 0) + 1;
      codeTracker.set(card.code, currentPrint);
      return { ...card, printNumber: currentPrint } as BotCard & { printNumber: number };
    }
    return card;
  });
}

export class CardSyncService {
  private storage: MongoDBStorage;
  private lastSync: Date | null = null;

  constructor(storage: MongoDBStorage) {
    this.storage = storage;
  }

  async syncFromBot(): Promise<Card[]> {
    try {
      console.log('[CardSync] Fetching cards from bot...');
      const botData = await fetchAllBotCards();

      const allCards: Omit<Card, '_id' | 'createdAt' | 'updatedAt'>[] = [];

      // Process regular cards
      const regularWithPrints = assignPrintNumbers(botData.regularCards);
      regularWithPrints.forEach(card => {
        allCards.push({
          ...convertBotCardToCard(card, 'cards', 'regular'),
          printNumber: (card as any).printNumber || 1,
        });
      });

      // Process event cards
      const eventWithPrints = assignPrintNumbers(botData.eventCards);
      eventWithPrints.forEach(card => {
        allCards.push({
          ...convertBotCardToCard(card, 'cards', 'event'),
          printNumber: (card as any).printNumber || 1,
        });
      });

      // Process limited cards (specials)
      const limitedWithPrints = assignPrintNumbers(botData.limitedCards);
      limitedWithPrints.forEach(card => {
        allCards.push({
          ...convertBotCardToCard(card, 'cards', 'limited'),
          printNumber: (card as any).printNumber || 1,
        });
      });

      // Process frames
      const framesWithPrints = assignPrintNumbers(botData.frames);
      framesWithPrints.forEach(card => {
        allCards.push({
          ...convertBotCardToCard(card, 'frames', 'regular'),
          printNumber: (card as any).printNumber || 1,
        });
      });

      // Process wallpapers
      const wallpapersWithPrints = assignPrintNumbers(botData.wallpapers);
      wallpapersWithPrints.forEach(card => {
        allCards.push({
          ...convertBotCardToCard(card, 'wallpapers', 'regular'),
          printNumber: (card as any).printNumber || 1,
        });
      });

      console.log(`[CardSync] Processed ${allCards.length} cards from bot`);
      this.lastSync = new Date();
      
      return allCards as Card[];
    } catch (error) {
      console.error('[CardSync] Error syncing from bot:', error);
      return [];
    }
  }

  async getAllCards(): Promise<Card[]> {
    try {
      // Fetch from bot JSON files
      const botCards = await this.syncFromBot();
      
      // Fetch customs from MongoDB (items with isCustom flag or no code)
      const mongoCards = await this.storage.getAllCards();
      
      // Customs are cards that have a discordUserId (uploaded via website)
      const customs = mongoCards.filter((card: Card) => card.discordUserId);
      
      // Combine bot cards + customs
      const allCards = [...botCards, ...customs];
      
      console.log(`[CardSync] Total cards: ${allCards.length} (${botCards.length} from bot, ${customs.length} customs)`);
      
      return allCards;
    } catch (error) {
      console.error('[CardSync] Error getting all cards:', error);
      return [];
    }
  }

  getLastSyncTime(): Date | null {
    return this.lastSync;
  }
}
