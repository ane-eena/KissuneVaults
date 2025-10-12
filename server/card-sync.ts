import { fetchAllBotCards } from './sftp';
import { MongoStorage } from './storage';
import { Card } from '@shared/schema';
import { createHash } from 'crypto';

interface BotCard {
  // Common fields
  image: string | string[]; // Can be single image or array for double-sided cards
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
  imageUrl: string | string[],
  name: string
): string {
  // Use code if available, otherwise use image URL + name
  const imageString = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
  const uniqueString = code 
    ? `bot-${itemType}-${code}`
    : `bot-${itemType}-${imageString}-${name}`;
  
  return createHash('md5').update(uniqueString).digest('hex').substring(0, 24);
}

// Convert bot JSON format to our Card format
function convertBotCardToCard(
  botCard: BotCard,
  itemType: 'cards' | 'wallpapers' | 'frames',
  category: 'limited' | 'event' | 'regular'
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
  
  const _id = generateBotCardId(itemType, botCard.code, botCard.image, displayName);
  
  return {
    _id,
    name: displayName,
    imageUrl: botCard.image, // Can be string or string[] for double-sided cards
    itemType,
    category,
    idolName,
    theme: botCard.theme,
    group: botCard.group,
    subcat: botCard.subcat,
    code: botCard.code,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export class CardSyncService {
  private storage: MongoStorage;
  private lastSync: Date | null = null;

  constructor(storage: MongoStorage) {
    this.storage = storage;
  }

  async syncFromBot(): Promise<Card[]> {
    try {
      console.log('[CardSync] Fetching cards from bot...');
      const botData = await fetchAllBotCards();

      const allCards: Card[] = [];

      // Process regular cards
      botData.regularCards.forEach(card => {
        allCards.push(convertBotCardToCard(card, 'cards', 'regular'));
      });

      // Process event cards
      botData.eventCards.forEach(card => {
        allCards.push(convertBotCardToCard(card, 'cards', 'event'));
      });

      // Process limited cards (specials)
      botData.limitedCards.forEach(card => {
        allCards.push(convertBotCardToCard(card, 'cards', 'limited'));
      });

      // Process frames
      botData.frames.forEach(card => {
        allCards.push(convertBotCardToCard(card, 'frames', 'regular'));
      });

      // Process wallpapers
      botData.wallpapers.forEach(card => {
        allCards.push(convertBotCardToCard(card, 'wallpapers', 'regular'));
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
