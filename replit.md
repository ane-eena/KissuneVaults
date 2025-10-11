# Kissune K-pop Collection

## Overview
Kissune is a vibrant K-pop collection website integrated with Discord bot. Collectors can add K-pop cards, wallpapers, and frames via Discord's `/addcard` command, and they appear instantly on the colorful, fun showcase website. Images are stored in AWS S3 for reliable hosting.

## Features
- **K-pop Themed Design**: Vibrant pink, purple, and cyan color scheme inspired by K-pop album art
- **Multiple Item Types**: Cards (794x1154px), Wallpapers (2635x1636px), and Frames (794x1154px)
- **Category System**: Limited, Event, Regular, and Collabs
- **Discord Bot Integration**: Add items using `/addcard` slash command
- **AWS S3 Storage**: All images stored in S3 buckets with CDN delivery
- **Beautiful Gallery**: Responsive grid with search, type filters, and category filters
- **Item Details**: Individual pages with metadata, canvas dimensions, and sharing
- **Dark/Light Mode**: Theme toggle with K-pop inspired colors in both modes
- **Real-time Updates**: Auto-refresh every 5 seconds to show new additions

## Item Types & Categories

### Item Types
- **Cards**: Portrait photocard format (794x1154px)
- **Wallpapers**: Landscape desktop wallpapers (2635x1636px)
- **Frames**: Portrait frame overlays (794x1154px)

### Categories
- **Limited**: Exclusive, rare items with gold gradient and sparkle effects
- **Event**: Special event items with rainbow gradients
- **Regular**: Standard collection items
- **Collabs**: Special collaboration items with multi-color gradients

## Tech Stack
### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching (auto-refresh every 5s)
- Tailwind CSS + Shadcn UI components
- Vibrant K-pop color palette with gradients
- Montserrat/Outfit for bold typography

### Backend
- Express.js server
- AWS S3 SDK for image storage
- In-memory storage for item metadata
- Multer for file uploads
- RESTful API with type/category filtering

## Project Structure
```
client/
  src/
    components/
      navbar.tsx          # Colorful header with gradient logo
      hero-section.tsx    # K-pop idol background with stats
      filter-bar.tsx      # Type and category filters
      card-grid.tsx       # Responsive grid layout
      card-item.tsx       # Item card with gradients
      card-skeleton.tsx   # Loading state
      theme-provider.tsx  # Dark/light K-pop themes
    pages/
      home.tsx           # Main gallery with filters
      card-detail.tsx    # Item detail with canvas info
      not-found.tsx      # 404 page
    
server/
  s3.ts                 # S3 upload utilities
  routes.ts             # REST API endpoints
  storage.ts            # In-memory storage
  seed-data.ts          # K-pop demo collection

shared/
  schema.ts             # TypeScript types with K-pop fields

attached_assets/
  *.jpg                 # K-pop idol images for design
```

## API Endpoints
- `GET /api/cards` - Fetch all items (cards/wallpapers/frames)
- `GET /api/cards/:id` - Fetch single item
- `POST /api/cards` - Create item (with image upload)
  - Fields: name, image, itemType, category, canvasWidth, canvasHeight, description
- `DELETE /api/cards/:id` - Delete item

## Discord Bot Setup
The website API is ready to receive items from your Discord bot!

**Important**: The Replit Discord integration provides user OAuth tokens, not bot tokens. To use `/addcard`, set up your own Discord bot:

1. See `DISCORD_BOT_SETUP.md` for complete instructions
2. Your bot should POST to `/api/cards` with these fields:
   - `name` (required): Item name
   - `image` (required): File upload
   - `itemType` (optional): "cards", "wallpapers", or "frames"
   - `category` (optional): "limited", "event", "regular", or "collabs"
   - `canvasWidth` (optional): Canvas width in pixels
   - `canvasHeight` (optional): Canvas height in pixels
   - `description` (optional): Item description
3. Items appear on the website within 5 seconds (auto-refresh)

### `/addcard` Command Example
When your bot is set up, users can add items like this:
```
/addcard 
  name: "Winter - Rich Man Energy"
  image: [attachment]
  itemType: cards
  category: limited
  description: "aespa Winter exclusive photocard"
```

## Environment Variables
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_S3_BUCKET_NAME` - S3 bucket name
- `AWS_REGION` - AWS region (e.g., us-east-1)

## Design System
- **Primary Colors**: 
  - Hot Pink (#E63B7A) - Category highlights
  - Electric Purple (#B76AFF) - Accents
  - Bright Cyan (#0DD9E8) - Secondary accents
- **Category Gradients**:
  - Limited: Gold (Yellow → Orange)
  - Event: Rainbow (Pink → Purple → Cyan)
  - Regular: Gray
  - Collabs: Multi-color (Pink → Purple → Cyan)
- **Fonts**: 
  - Display: Montserrat (bold headings)
  - Accent: Outfit (fun labels)
  - Body: Inter (readable text)
  - Mono: JetBrains Mono (IDs/technical)
- **Spacing**: Generous 6-8 gap, 12-20 section padding

## User Journey
1. User opens Discord and uses `/addcard` command
2. Bot uploads image to S3 and saves item metadata
3. Item appears in website gallery within 5 seconds
4. Users can filter by type (Cards/Wallpapers/Frames) and category
5. Users can search, view details, download, and share items

## Recent Changes
- **October 11, 2025**: Complete K-pop redesign with vibrant colors
- Multiple item types (cards, wallpapers, frames) with proper aspect ratios
- Category system (Limited, Event, Regular, Collabs) with gradient styling
- K-pop idol imagery integration in hero section
- Enhanced filters and colorful UI throughout
