# Kissune K-pop Collection

## Overview
Kissune is a vibrant K-pop collection website with Discord OAuth authentication for staff management. Collectors can add K-pop cards, wallpapers, and frames via Discord bot integration, and they appear instantly on the colorful, fun showcase website. All data is stored in MongoDB with images hosted on AWS S3.

## Features
- **Discord OAuth Login**: Staff can log in with Discord (Owner has full edit/delete permissions)
- **K-pop Themed Design**: Vibrant pink, purple, and cyan color scheme inspired by K-pop album art
- **Multiple Item Types**: Cards (794x1154px), Wallpapers (2635x1636px), and Frames (794x1154px)
- **Category System**: Limited, Event, Regular, and Collabs with gradient styling
- **Rich Metadata**: Idol name, group, theme, subcat, code, and print number tracking
- **Discord Bot Integration**: Add items using `/addcard` slash command via secure API
- **AWS S3 Storage**: All images stored in S3 buckets with CDN delivery
- **MongoDB Database**: Persistent storage for all card metadata and user accounts
- **Beautiful Gallery**: Responsive grid with search, type filters, and category filters
- **Item Details**: Individual pages with K-pop metadata, canvas dimensions, and sharing
- **Owner Controls**: Edit and delete functionality for owner account
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

### K-pop Metadata Fields
- **Idol Name**: Name of the K-pop idol
- **Group**: Group the idol belongs to
- **Theme**: Theme of the card (e.g., "Rich Man", "Cosmic")
- **Subcat**: Optional subcategory
- **Code**: Unique card code (e.g., "WNT-001")
- **Print Number**: Track multiple prints of the same card

## Tech Stack
### Frontend
- React with TypeScript
- Wouter for routing
- TanStack Query for data fetching (auto-refresh every 5s)
- Tailwind CSS + Shadcn UI components
- Vibrant K-pop color palette with gradients
- Montserrat/Outfit for bold typography
- Discord OAuth authentication with avatar display

### Backend
- Express.js server
- MongoDB for persistent storage
- Discord Passport.js OAuth strategy
- AWS S3 SDK for image storage
- Multer for file uploads
- RESTful API with authentication middleware

## Project Structure
```
client/
  src/
    lib/
      auth.tsx            # Auth context provider
    components/
      navbar.tsx          # Colorful header with login/logout
      hero-section.tsx    # K-pop idol background with stats
      filter-bar.tsx      # Type and category filters
      card-grid.tsx       # Responsive grid layout
      card-item.tsx       # Item card with K-pop metadata
      card-skeleton.tsx   # Loading state
      theme-provider.tsx  # Dark/light K-pop themes
    pages/
      home.tsx           # Main gallery with filters
      card-detail.tsx    # Item detail with edit/delete controls
      not-found.tsx      # 404 page
    
server/
  mongodb.ts            # MongoDB connection
  auth.ts               # Discord OAuth configuration
  s3.ts                 # S3 upload utilities
  routes.ts             # REST API endpoints
  storage.ts            # MongoDB storage operations

shared/
  schema.ts             # Zod schemas with K-pop fields

BOT_INTEGRATION.md     # Complete Discord bot integration guide
```

## API Endpoints

### Authentication
- `GET /auth/discord` - Initiate Discord OAuth
- `GET /auth/discord/callback` - OAuth callback
- `GET /auth/logout` - Logout
- `GET /auth/user` - Get current user

### Cards (Public)
- `GET /api/cards` - Fetch all items
- `GET /api/cards/:id` - Fetch single item

### Cards (Bot Integration)
- `POST /api/bot/cards` - Create card from Discord bot (requires shared secret)
  - Headers: `x-shared-secret: ANNOUNCE_SHARED_SECRET`
  - Fields: name, image, itemType, category, idolName, group, theme, subcat, code, printNumber, etc.

### Cards (Owner Only)
- `POST /api/cards` - Create card via web (requires owner auth)
- `PATCH /api/cards/:id` - Update card (requires owner auth)
- `DELETE /api/cards/:id` - Delete card (requires owner auth)

## Bot Data Integration

The website automatically syncs with your Cybrancee Discord bot's collection data in two ways:

### 1. SFTP Data Sync (Primary - Live Data)
- **Reads bot's JSON files** directly from Cybrancee SFTP server every 5 seconds
- **SFTP Server**: `cybrancee-bot-na-west-07.cybrancee.com:2022`
- **Working Path**: `jsons/` (cards.json, eventcards.json, frames.json, wallpapers.json, specials.json)
- **Credentials**: `SFTP_USERNAME` and `SFTP_PASSWORD` environment variables
- **Result**: Website displays all cards from bot's collection automatically
- **No bot changes needed** - just reads existing JSON files

### 2. Discord Bot Upload API (Optional - Custom Cards)
Your Discord bot can also upload custom cards directly! See **BOT_INTEGRATION.md** for the complete guide.

**Quick Start:**
1. Set `WEBSITE_URL` and `ANNOUNCE_SHARED_SECRET` in your bot's environment
2. POST to `/api/bot/cards` with:
   - Header: `x-shared-secret: YOUR_SECRET`
   - Image file + card metadata
3. Bot receives S3 URL in response
4. Card appears on website within 5 seconds

### Example `/addcard` Command Fields
```
/addcard 
  name: "Winter - Rich Man Energy"
  image: [attachment]
  idol: "Winter"
  group: "aespa"
  theme: "Rich Man"
  code: "WNT-001"
  category: limited
  type: cards
  print: 1
```

## Authentication System

### Discord OAuth
- Staff can log in with Discord account
- Owner ID: **866820869909381160** (has full edit/delete permissions)
- User avatars and usernames displayed in navbar
- Session persists for 30 days

### Permissions
- **Public**: View all cards, search, filter
- **Authenticated**: Same as public (no additional permissions yet)
- **Owner**: Can edit and delete any card on the website

## Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string
- `DISCORD_CLIENT_ID` - Discord OAuth client ID
- `DISCORD_BOT_TOKEN` - Discord bot token (used as OAuth secret)
- `ANNOUNCE_SHARED_SECRET` - Shared secret for bot communication
- `SESSION_SECRET` - Session encryption key
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_S3_BUCKET_NAME` - S3 bucket name
- `AWS_REGION` - AWS region (e.g., us-east-1)

### Optional
- `REPLIT_DEV_DOMAIN` - Auto-set by Replit for OAuth callback

## Design System
- **Primary Colors**: 
  - Hot Pink (#E63B7A) - Category highlights
  - Electric Purple (#B76AFF) - Accents
  - Bright Cyan (#0DD9E8) - Secondary accents
- **Category Gradients**:
  - Limited: Gold (Yellow → Orange) with pulse animation
  - Event: Rainbow (Pink → Purple → Cyan)
  - Regular: Gray
  - Collabs: Multi-color (Pink → Purple → Cyan)
- **Fonts**: 
  - Display: Montserrat (bold headings)
  - Accent: Outfit (fun labels)
  - Body: Inter (readable text)
  - Mono: JetBrains Mono (codes/technical)
- **Spacing**: Generous 6-8 gap, 12-20 section padding

## User Journey

### Public User
1. Browse collection with vibrant K-pop cards
2. Filter by type (Cards/Wallpapers/Frames) and category
3. Search by name, idol, group, or code
4. View detailed card info with K-pop metadata
5. Download images and share links

### Staff (Discord Login)
1. Click "Staff Login" → Discord OAuth
2. Login with Discord account
3. See avatar and username in navbar
4. Browse collection like public users

### Owner (ID: 866820869909381160)
1. Same as staff, plus:
2. See Edit and Delete buttons on card detail pages
3. Can delete cards with confirmation dialog
4. Full management control over collection

### Discord Bot User
1. Use `/addcard` command in Discord
2. Upload image with card metadata
3. Bot uploads to S3 and sends to website API
4. Card appears on website within 5 seconds
5. Get confirmation with direct link to new card

## Database Schema (MongoDB)

### Cards Collection
```javascript
{
  _id: ObjectId,
  name: String,
  imageUrl: String,
  itemType: "cards" | "wallpapers" | "frames",
  category: "limited" | "event" | "regular" | "collabs",
  idolName: String (optional),
  theme: String (optional),
  group: String (optional),
  subcat: String (optional),
  code: String (optional),
  printNumber: Number (default: 1),
  canvasWidth: Number (optional),
  canvasHeight: Number (optional),
  description: String (optional),
  discordUserId: String (optional),
  discordUsername: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection
```javascript
{
  _id: ObjectId,
  discordId: String,
  username: String,
  avatar: String (optional),
  email: String (optional),
  isOwner: Boolean,
  createdAt: Date
}
```

## Recent Changes
- **October 12, 2025**: UI/UX Improvements & Bug Fixes
  - ✅ Fixed card detail 404 error - `/api/cards/:id` now searches CardSyncService (bot + customs) instead of just MongoDB
  - ✅ Enhanced multi-field search - searches across name, idol, group, theme, subcat, and code with null-safe handling
  - ✅ Updated hero section text to "Discord K-Pop Collection" (was "Add via Discord /addcard")
  - ✅ Added Discord server invite button in navbar ("Join Server" with Discord branding)
  - ✅ Reduced filter bar thickness (py-3 instead of py-6) for cleaner, more compact look
  - ✅ Updated navbar logo from Sparkles icon to KS card image
  - ✅ Improved mobile responsiveness with overflow-x-auto on all filter sections
  - ✅ Fixed search crash bug when cards have missing optional fields (theme, subcat, code)
  - 🔧 Note: Discord OAuth still needs DISCORD_CLIENT_SECRET (currently using BOT_TOKEN as workaround)
- **October 12, 2025**: SFTP Integration & Data Sync Successfully Implemented
  - ✅ Successfully connected to Cybrancee SFTP server (path: `jsons/`)
  - ✅ Implemented automatic data sync from bot's JSON files (cards.json, eventcards.json, frames.json, wallpapers.json, specials.json)
  - ✅ Created CardSyncService to merge bot data with MongoDB customs
  - ✅ Website now displays 390+ cards from bot collection in real-time
  - ✅ Auto-refresh every 5 seconds ensures website stays synced with bot
  - ✅ Fixed React key prop errors in CardGrid component
  - ✅ Optimized SFTP path detection for faster loading
  - Major authentication and database update:
    - Implemented Discord OAuth login for staff
    - Migrated from in-memory to MongoDB storage
    - Added owner permissions (edit/delete controls)
    - Created secure bot API endpoint with shared secret
    - Enhanced schema with K-pop metadata (idol, group, theme, code, print)
    - Added print number tracking system
    - Updated UI with auth controls and new metadata display
    - Created comprehensive bot integration documentation
- **October 11, 2025**: Complete K-pop redesign with vibrant colors
  - Multiple item types with proper aspect ratios
  - Category system with gradient styling
  - K-pop idol imagery integration
