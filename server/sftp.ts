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

export async function fetchBotJSON(filename: string): Promise<BotCardsJSON> {
  const sftp = new Client();
  
  try {
    await sftp.connect(SFTP_CONFIG);
    console.log(`[SFTP] Connected to fetch ${filename}`);
    
    const remotePath = `/home/container/jsons/${filename}`;
    const data = await sftp.get(remotePath);
    
    // Convert buffer to string and parse JSON
    const jsonString = data.toString('utf8');
    const parsed = JSON.parse(jsonString);
    
    console.log(`[SFTP] Fetched ${parsed.cards?.length || 0} items from ${filename}`);
    return parsed;
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
