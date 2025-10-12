import Client from 'ssh2-sftp-client';

const SFTP_CONFIG = {
  host: 'cybrancee-bot-na-west-07.cybrancee.com',
  port: 2022,
  username: process.env.SFTP_USERNAME!,
  password: process.env.SFTP_PASSWORD!,
  readyTimeout: 20000,
};

interface BotCard {
  name: string;
  subcat?: string;
  group?: string;
  theme?: string;
  code?: string;
  image: string;
}

interface BotCardsJSON {
  cards: BotCard[];
}

export async function listSFTPDirectory(path: string): Promise<any[]> {
  const sftp = new Client();
  
  try {
    await sftp.connect(SFTP_CONFIG);
    console.log(`[SFTP] Connected to list directory: ${path}`);
    
    const list = await sftp.list(path);
    console.log(`[SFTP] Directory ${path} contains:`, list.map(f => f.name));
    
    return list;
  } catch (error) {
    console.error(`[SFTP] Error listing ${path}:`, error);
    throw error;
  } finally {
    await sftp.end();
  }
}

export async function fetchBotJSON(filename: string): Promise<BotCardsJSON> {
  const sftp = new Client();
  
  try {
    await sftp.connect(SFTP_CONFIG);
    console.log(`[SFTP] Connected to fetch ${filename}`);
    
    // Try different path variations (jsons/ is the working path for Cybrancee SFTP)
    const paths = [
      `jsons/${filename}`, // Primary path that works
      `/jsons/${filename}`,
      `container/jsons/${filename}`,
      `/container/jsons/${filename}`,
      filename,
    ];
    
    let data: Buffer | null = null;
    let successPath = '';
    
    for (const remotePath of paths) {
      try {
        console.log(`[SFTP] Trying path: ${remotePath}`);
        data = await sftp.get(remotePath) as Buffer;
        successPath = remotePath;
        console.log(`[SFTP] Success with path: ${remotePath}`);
        break;
      } catch (err) {
        console.log(`[SFTP] Path ${remotePath} failed, trying next...`);
      }
    }
    
    if (!data) {
      throw new Error(`Could not fetch ${filename} from any known path`);
    }
    
    // Convert buffer to string and parse JSON
    const jsonString = data.toString('utf8');
    const parsed = JSON.parse(jsonString);
    
    // Handle different JSON structures
    let cardsArray: BotCard[] = [];
    
    if (Array.isArray(parsed)) {
      // Direct array structure: [...]
      cardsArray = parsed;
      console.log(`[SFTP] Fetched ${cardsArray.length} items from ${filename} (direct array, path: ${successPath})`);
    } else {
      // Object structure - try different key names based on filename
      const fileBase = filename.replace('.json', '');
      const possibleKeys = [
        fileBase,           // e.g., "cards", "eventcards", "frames", "wallpapers", "specials"
        'cards',            // fallback
        Object.keys(parsed)[0]  // first key as last resort
      ];
      
      for (const key of possibleKeys) {
        if (parsed[key] && Array.isArray(parsed[key])) {
          cardsArray = parsed[key];
          console.log(`[SFTP] Fetched ${cardsArray.length} items from ${filename} (key: "${key}", path: ${successPath})`);
          break;
        }
      }
      
      if (cardsArray.length === 0) {
        const keys = Object.keys(parsed);
        console.log(`[SFTP] Warning: ${filename} has unexpected structure. Keys: [${keys.join(', ')}]`);
      }
    }
    
    return { cards: cardsArray };
  } catch (error) {
    console.error(`[SFTP] Error fetching ${filename}:`, error);
    throw error;
  } finally {
    await sftp.end();
  }
}

export async function fetchAllBotCards() {
  try {
    const [cards, eventCards, frames, specials, wallpapers] = await Promise.all([
      fetchBotJSON('cards.json').catch(() => ({ cards: [] })),
      fetchBotJSON('eventcards.json').catch(() => ({ cards: [] })),
      fetchBotJSON('frames.json').catch(() => ({ cards: [] })),
      fetchBotJSON('specials.json').catch(() => ({ cards: [] })),
      fetchBotJSON('wallpapers.json').catch(() => ({ cards: [] })),
    ]);

    return {
      regularCards: cards.cards || [],
      eventCards: eventCards.cards || [],
      frames: frames.cards || [],
      limitedCards: specials.cards || [],
      wallpapers: wallpapers.cards || [],
    };
  } catch (error) {
    console.error('[SFTP] Error fetching all bot cards:', error);
    return {
      regularCards: [],
      eventCards: [],
      frames: [],
      limitedCards: [],
      wallpapers: [],
    };
  }
}
