import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  AttachmentBuilder,
  REST,
  Routes,
} from "discord.js";
import { uploadImageToS3 } from "./s3";
import { storage } from "./storage";

let connectionSettings: any;

async function getAccessToken() {
  if (
    connectionSettings &&
    connectionSettings.settings.expires_at &&
    new Date(connectionSettings.settings.expires_at).getTime() > Date.now()
  ) {
    return connectionSettings.settings.access_token;
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? "repl " + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? "depl " + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error("X_REPLIT_TOKEN not found for repl/depl");
  }

  connectionSettings = await fetch(
    "https://" +
      hostname +
      "/api/v2/connection?include_secrets=true&connector_names=discord",
    {
      headers: {
        Accept: "application/json",
        X_REPLIT_TOKEN: xReplitToken,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);

  const accessToken =
    connectionSettings?.settings?.access_token ||
    connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error("Discord not connected");
  }
  return accessToken;
}

export async function initializeDiscordBot() {
  try {
    const token = await getAccessToken();

    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    // Register slash command
    const commands = [
      new SlashCommandBuilder()
        .setName("addcard")
        .setDescription("Add a new card to the Kissune collection")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Name of the card")
            .setRequired(true)
        )
        .addAttachmentOption((option) =>
          option
            .setName("image")
            .setDescription("Card image")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("rarity")
            .setDescription("Card rarity")
            .setRequired(false)
            .addChoices(
              { name: "Common", value: "common" },
              { name: "Uncommon", value: "uncommon" },
              { name: "Rare", value: "rare" },
              { name: "Ultra", value: "ultra" },
              { name: "Legendary", value: "legendary" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("description")
            .setDescription("Card description")
            .setRequired(false)
        ),
    ].map((command) => command.toJSON());

    client.once("ready", async (c) => {
      console.log(`✅ Discord bot ready! Logged in as ${c.user.tag}`);

      // Register commands globally
      const rest = new REST({ version: "10" }).setToken(token);
      try {
        await rest.put(Routes.applicationCommands(c.user.id), {
          body: commands,
        });
        console.log("✅ Slash commands registered successfully!");
      } catch (error) {
        console.error("❌ Error registering commands:", error);
      }
    });

    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      if (interaction.commandName === "addcard") {
        await interaction.deferReply();

        try {
          const name = interaction.options.getString("name", true);
          const image = interaction.options.getAttachment("image", true);
          const rarity = interaction.options.getString("rarity") || "common";
          const description = interaction.options.getString("description") || "";

          // Validate image
          if (!image.contentType?.startsWith("image/")) {
            await interaction.editReply("❌ Please upload a valid image file!");
            return;
          }

          // Download image
          const response = await fetch(image.url);
          const buffer = Buffer.from(await response.arrayBuffer());

          // Upload to S3
          const imageUrl = await uploadImageToS3(
            buffer,
            image.name,
            image.contentType
          );

          // Save to storage
          const card = await storage.createCard({
            name,
            imageUrl,
            rarity,
            description,
            discordUserId: interaction.user.id,
            discordUsername: interaction.user.username,
          });

          await interaction.editReply(
            `✅ Card **${name}** added successfully!\n🔗 View it here: ${process.env.REPLIT_DOMAINS?.split(",")[0] || "your-website"}/card/${card.id}`
          );
        } catch (error) {
          console.error("Error adding card:", error);
          await interaction.editReply(
            "❌ Failed to add card. Please try again later."
          );
        }
      }
    });

    await client.login(token);
    console.log("🤖 Discord bot initialized successfully");

    return client;
  } catch (error) {
    console.error("❌ Failed to initialize Discord bot:", error);
    throw error;
  }
}
