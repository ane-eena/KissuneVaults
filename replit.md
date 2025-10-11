# Kissune Card Showcase

## Overview
Kissune is a fullstack card showcase website integrated with a Discord bot. Users can add cards to the collection via Discord's `/addcard` command, and the cards are instantly displayed on the website. Images are stored in AWS S3 for reliable hosting.

## Features
- **Discord Bot Integration**: Add cards using `/addcard` slash command from Discord
- **AWS S3 Storage**: All card images are stored in S3 buckets
- **Card Gallery**: Beautiful, responsive grid layout with search and filter
- **Card Details**: Individual card pages with metadata and sharing
- **Real-time Updates**: Cards added via Discord appear instantly on the website
- **Dark/Light Mode**: Theme toggle with persistent preferences

## Tech Stack
### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching
- Tailwind CSS + Shadcn UI components
- Theme system with dark mode

### Backend
- Express.js server
- Discord.js for bot integration
- AWS S3 SDK for image storage
- In-memory storage for card metadata
- Multer for file uploads

## Project Structure
```
client/
  src/
    components/
      navbar.tsx          # Header with search and theme toggle
      hero-section.tsx    # Hero banner with card count
      filter-bar.tsx      # Rarity filter badges
      card-grid.tsx       # Grid layout for cards
      card-item.tsx       # Individual card component
      card-skeleton.tsx   # Loading state
      theme-provider.tsx  # Dark/light mode provider
    pages/
      home.tsx           # Main gallery page
      card-detail.tsx    # Individual card detail page
      not-found.tsx      # 404 page
    
server/
  discord-bot.ts        # Discord bot with /addcard command
  s3.ts                 # S3 upload utilities
  routes.ts             # REST API endpoints
  storage.ts            # In-memory storage interface

shared/
  schema.ts             # TypeScript types and Zod schemas
```

## API Endpoints
- `GET /api/cards` - Fetch all cards
- `GET /api/cards/:id` - Fetch single card
- `POST /api/cards` - Create card (with image upload)
- `DELETE /api/cards/:id` - Delete card

## Discord Bot Setup
The website is ready to receive cards from a Discord bot! 

**Important Note**: The Replit Discord integration provides user OAuth tokens (for user authentication), not bot tokens. To use the `/addcard` slash command feature, you need to set up your own Discord bot application:

1. See `DISCORD_BOT_SETUP.md` for complete step-by-step setup instructions
2. Your bot will POST to the `/api/cards` endpoint with image and card data
3. The website API is fully functional and ready to receive cards from your bot
4. Demo cards are pre-loaded so you can see how the gallery works immediately

### `/addcard` Command (when bot is set up)
- **name** (required): Card name
- **image** (required): Card image attachment
- **rarity** (optional): common, uncommon, rare, ultra, legendary
- **description** (optional): Card description

## Environment Variables
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_S3_BUCKET_NAME` - S3 bucket name
- `AWS_REGION` - AWS region (e.g., us-east-1)
- Discord connection managed via Replit integration

## Design System
- **Primary Color**: Purple (#8B5CF6) - Discord connection theme
- **Rarity Colors**: 
  - Common: Gray
  - Uncommon: Green
  - Rare: Gold
  - Ultra: Purple
  - Legendary: Rainbow gradient
- **Spacing**: 2, 4, 8, 12, 16, 20 (Tailwind units)
- **Fonts**: Inter (primary), JetBrains Mono (code/IDs)

## User Journey
1. User opens Discord and uses `/addcard` command
2. Bot uploads image to S3 and saves card metadata
3. Card appears instantly on the website gallery
4. Users can search, filter by rarity, and view details
5. Card detail pages show full image and metadata

## Recent Changes
- **October 11, 2025**: Initial build with Discord integration and S3 storage
- Complete MVP with card gallery, detail pages, and Discord bot
