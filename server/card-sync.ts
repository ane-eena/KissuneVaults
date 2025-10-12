import { fetchAllBotCards } from './sftp';
import { MongoDBStorage } from './storage';
import { Card } from '@shared/schema';
import { createHash } from 'crypto';

interface BotCard {
  // Common fields
  image: string;
  code?: string;
  
  // Card/Event/Special fields
  name?: string;
  subcat?: string;
  group?: string;
  theme?: string;
  
  // Frame-specific fields
  color?: string;
  price?: number;
  mintPrice?: number;
  isSpecial?: boolean;
  availability?: string;
  
  // Wallpaper-specific fields
  gemPrice?: number;
}

// Generate a stable _id for bot cards using hash of unique identifiers
function generateBotCardId(
  itemType: string,
  code: string | undefined,
  imageUrl: string,
  name: string,
  printNumber: number
): string {
  // Use code + printNumber if available, otherwise use image URL + name
  const uniqueString = code 
    ? `bot-${itemType}-${code}-${printNumber}`
    : `bot-${itemType}-${imageUrl}-${name}`;
  
  return createHash('md5').update(uniqueString).digest('hex').substring(0, 24);
}

// Convert bot JSON format to our Card format
function convertBotCardToCard(
  botCard: BotCard,
  itemType: 'cards' | 'wallpapers' | 'frames',
  category: 'limited' | 'event' | 'regular',
  printNumber: number = 1
): Card {
  // Determine display name and idol name based on item type
  let displayName: string;
  let idolName: string | undefined;
  
  if (itemType === 'frames') {
    // For frames: name is the frame name, not idol
    displayName = botCard.name || botCard.code || 'Frame';
    idolName = undefined;
  } else if (itemType === 'wallpapers') {
    // For wallpapers: construct name from group + theme
    displayName = [botCard.group, botCard.theme].filter(Boolean).join(' - ') || botCard.code || 'Wallpaper';
    idolName = undefined;
  } else {
    // For cards/specials/events: name is the idol name
    displayName = botCard.name || botCard.code || 'Card';
    idolName = botCard.name;
  }
  
  const _id = generateBotCardId(itemType, botCard.code, botCard.image, displayName, printNumber);
  
  return {
    _id,
    name: displayName,
    imageUrl: botCard.image,
    itemType,
    category,
    idolName,
    theme: botCard.theme,
    group: botCard.group,
    subcat: botCard.subcat,
    code: botCard.code,
    printNumber,
    createdAt: new Date(),
    updatedAt: new Date(),
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

      const allCards: Card[] = [];

      // Process regular cards
      const regularWithPrints = assignPrintNumbers(botData.regularCards);
      regularWithPrints.forEach(card => {
        const printNumber = (card as any).printNumber || 1;
        allCards.push(convertBotCardToCard(card, 'cards', 'regular', printNumber));
      });

      // Process event cards
      const eventWithPrints = assignPrintNumbers(botData.eventCards);
      eventWithPrints.forEach(card => {
        const printNumber = (card as any).printNumber || 1;
        allCards.push(convertBotCardToCard(card, 'cards', 'event', printNumber));
      });

      // Process limited cards (specials)
      const limitedWithPrints = assignPrintNumbers(botData.limitedCards);
      limitedWithPrints.forEach(card => {
        const printNumber = (card as any).printNumber || 1;
        allCards.push(convertBotCardToCard(card, 'cards', 'limited', printNumber));
      });

      // Process frames
      const framesWithPrints = assignPrintNumbers(botData.frames);
      framesWithPrints.forEach(card => {
        const printNumber = (card as any).printNumber || 1;
        allCards.push(convertBotCardToCard(card, 'frames', 'regular', printNumber));
      });

      // Process wallpapers
      const wallpapersWithPrints = assignPrintNumbers(botData.wallpapers);
      wallpapersWithPrints.forEach(card => {
        const printNumber = (card as any).printNumber || 1;
        allCards.push(convertBotCardToCard(card, 'wallpapers', 'regular', printNumber));
      });

      console.log(`[CardSync] Processed ${allCards.length} cards from bot`);
      this.lastSync = new Date();
      
      return allCards;
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
