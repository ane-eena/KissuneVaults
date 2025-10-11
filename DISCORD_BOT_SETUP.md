# Discord Bot Setup Instructions

The Kissune website is ready to receive cards from your Discord bot! Follow these instructions to set up your own Discord bot with the `/addcard` command.

## Step 1: Create a Discord Bot

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name (e.g., "Kissune")
3. Go to the "Bot" tab and click "Add Bot"
4. Under "Privileged Gateway Intents", enable:
   - Message Content Intent
   - Server Members Intent
5. Copy your Bot Token (keep it secret!)

## Step 2: Set Up the Bot Code

Create a new file `discord-bot/index.js` with this code:

```javascript
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');
const FormData = require('form-data');
const fetch = require('node-fetch');

const DISCORD_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE';
const WEBSITE_URL = 'YOUR_REPLIT_URL_HERE'; // e.g., https://your-repl.replit.app

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

const commands = [
  new SlashCommandBuilder()
    .setName('addcard')
    .setDescription('Add a new card to the Kissune collection')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Name of the card')
        .setRequired(true)
    )
    .addAttachmentOption(option =>
      option.setName('image')
        .setDescription('Card image')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('rarity')
        .setDescription('Card rarity')
        .setRequired(false)
        .addChoices(
          { name: 'Common', value: 'common' },
          { name: 'Uncommon', value: 'uncommon' },
          { name: 'Rare', value: 'rare' },
          { name: 'Ultra', value: 'ultra' },
          { name: 'Legendary', value: 'legendary' }
        )
    )
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Card description')
        .setRequired(false)
    ),
];

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  
  // Register slash commands
  const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);
  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands.map(cmd => cmd.toJSON()) }
    );
    console.log('✅ Slash commands registered!');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  
  if (interaction.commandName === 'addcard') {
    await interaction.deferReply();
    
    try {
      const name = interaction.options.getString('name');
      const image = interaction.options.getAttachment('image');
      const rarity = interaction.options.getString('rarity') || 'common';
      const description = interaction.options.getString('description') || '';
      
      // Validate image
      if (!image.contentType?.startsWith('image/')) {
        await interaction.editReply('❌ Please upload a valid image file!');
        return;
      }
      
      // Download image
      const imageResponse = await fetch(image.url);
      const imageBuffer = await imageResponse.buffer();
      
      // Create form data
      const formData = new FormData();
      formData.append('image', imageBuffer, image.name);
      formData.append('name', name);
      formData.append('rarity', rarity);
      formData.append('description', description);
      formData.append('discordUserId', interaction.user.id);
      formData.append('discordUsername', interaction.user.username);
      
      // Send to website API
      const response = await fetch(`${WEBSITE_URL}/api/cards`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const card = await response.json();
      
      await interaction.editReply(
        `✅ Card **${name}** added successfully!\n🔗 View it here: ${WEBSITE_URL}/card/${card.id}`
      );
    } catch (error) {
      console.error('Error adding card:', error);
      await interaction.editReply('❌ Failed to add card. Please try again later.');
    }
  }
});

client.login(DISCORD_BOT_TOKEN);
```

## Step 3: Install Dependencies

```bash
npm install discord.js@14 form-data node-fetch@2
```

## Step 4: Configure the Bot

1. Replace `YOUR_BOT_TOKEN_HERE` with your actual bot token
2. Replace `YOUR_REPLIT_URL_HERE` with your Replit website URL

## Step 5: Invite Bot to Server

1. Go back to Discord Developer Portal
2. Go to "OAuth2" > "URL Generator"
3. Select scopes: `bot`, `applications.commands`
4. Select permissions: `Send Messages`, `Use Slash Commands`
5. Copy the generated URL and open it to invite the bot to your server

## Step 6: Run the Bot

```bash
node discord-bot/index.js
```

## How It Works

1. User runs `/addcard` command in Discord
2. Bot receives the command with name, image, and optional metadata
3. Bot downloads the image from Discord
4. Bot sends a POST request to your Kissune website API
5. Website uploads image to S3 and saves card data
6. Card appears instantly on the website!

## Troubleshooting

- **Bot not responding**: Check that the bot token is correct and bot is online
- **Slash commands not showing**: Wait a few minutes for Discord to sync commands
- **Upload fails**: Ensure your AWS S3 credentials are set correctly in Replit Secrets
- **Image not appearing**: Check that S3 bucket permissions allow public read access
