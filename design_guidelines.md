# Kissune K-pop Collection - Design Guidelines

## Design Approach: Vibrant K-pop Aesthetic

**Selected Approach**: Bold, Colorful, Playful K-pop Album Art Inspiration

**Justification**: This is a K-pop card collection bot where visual energy and excitement are paramount. The design should capture the vibrant, dynamic essence of K-pop culture with bold colors, playful interactions, and eye-catching visuals.

**Key Design Principles**:
- **Maximum Visual Energy** - Bright gradients, bold colors, playful animations
- **K-pop Culture** - Inspired by album covers, photo cards, and concert aesthetics
- **Fun & Engaging** - Interactive elements, smooth transitions, delightful surprises
- **Category-First** - Clear differentiation between Cards, Wallpapers, and Frames

---

## Core Design Elements

### A. Vibrant Color Palette

**Primary Colors** (K-pop Energy):
- Hot Pink: 330 81% 60% (#E63B7A)
- Electric Purple: 280 69% 65% (#B76AFF)
- Bright Cyan: 190 95% 55% (#0DD9E8)
- Lime Green: 85 80% 60% (#A7F070)
- Sunshine Yellow: 50 100% 60% (#FFD93D)

**Gradient Backgrounds**:
- Hero: `from-pink-500 via-purple-500 to-cyan-500`
- Cards: `from-purple-400 to-pink-500`
- Wallpapers: `from-cyan-400 to-blue-500`
- Frames: `from-yellow-400 to-orange-500`

**Dark Mode** (still vibrant):
- Background: 260 30% 8% (deep purple-black)
- Surface: 260 25% 12% (elevated purple-dark)
- Text: 0 0% 98% (bright white)
- Accents: Full saturation colors

**Light Mode** (soft but colorful):
- Background: 300 60% 98% (soft pink-white)
- Surface: 0 0% 100% (pure white)
- Text: 260 50% 15% (purple-black)
- Accents: Full saturation colors

### B. Typography

**Font Stack**:
- Display: 'Montserrat', 'Inter', sans-serif (bold, energetic)
- Body: 'Inter', system-ui, sans-serif (clean, readable)
- Accent: 'Outfit', 'Montserrat', sans-serif (fun headings)
- Code: 'JetBrains Mono', monospace (IDs, technical)

**Scale** (bigger, bolder):
- Hero: text-6xl to text-7xl, font-black (massive impact)
- Section Headers: text-4xl to text-5xl, font-bold
- Card Names: text-xl, font-bold
- Category Labels: text-lg, font-semibold
- Body: text-base, font-normal
- Metadata: text-sm, font-medium

### C. Layout System

**Spacing** (generous, airy): 4, 6, 8, 12, 16, 20, 24
- Tight spacing: gap-4 (between small elements)
- Standard: gap-6 to gap-8 (cards, sections)
- Generous: py-12 to py-20 (page sections)
- Hero: py-20 to py-32 (maximum impact)

**Grid Systems**:
- **Cards Grid**: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`
  - Aspect ratio: `aspect-[794/1154]` (portrait cards)
- **Wallpapers Grid**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
  - Aspect ratio: `aspect-[2635/1636]` (wide wallpapers)
- **Frames Grid**: Same as cards
- Max container: max-w-[1400px] (wider for impact)

### D. Component Library

**Hero Section** (Maximum Impact):
- Full-width K-pop idol image background with gradient overlay
- Animated gradient text for title
- Large category pills with icons
- Floating elements/sparkles animation
- "Add via Discord" prominent CTA

**Navigation**:
- Glassmorphic sticky header: `backdrop-blur-2xl bg-white/10 dark:bg-black/20`
- Bold logo with gradient
- Search with colorful focus ring
- Animated menu items

**Category Filters** (Bold & Clear):
- Large pill buttons with gradients per category
- Icon + Label for each type
- Active state: full gradient + scale transform
- Smooth color transitions

**Item Cards**:
- **Cards/Frames**: 
  - `aspect-[794/1154]` portrait ratio
  - Gradient border (category-based)
  - Hover: lift effect + glow
  - Category badge in corner
- **Wallpapers**:
  - `aspect-[2635/1636]` landscape ratio
  - Same visual treatment
  - Larger display for impact

**Type Badges**:
- **Limited**: Gold gradient with sparkle effect
- **Event**: Rainbow gradient animated
- **Regular**: Solid category color
- **Collabs**: Multi-color gradient

**Interactive Elements**:
- Hover: scale-105 + shadow-2xl + glow
- Click: scale-95 spring animation
- Gradient borders that animate on hover
- Floating particles on special items

### E. K-pop Visual Enhancements

**Background Elements**:
- K-pop idol images as hero backgrounds with blur/overlay
- Animated gradient meshes
- Floating sparkles and stars
- Color-shifting glows

**Animations** (playful, energetic):
- Page load: stagger-fade-in for cards
- Hover: scale + glow + subtle rotation
- Category switch: color-morph transition
- Scroll: parallax on hero images
- Special items: pulse/shimmer effect

**Effects**:
- Glassmorphism everywhere
- Gradient borders (animated)
- Neon glows on hover
- Confetti on special actions
- Image blur-up placeholders

---

## Page-Specific Guidelines

### Homepage/Gallery
- **Hero**: Full-screen K-pop image with vibrant gradient overlay
- **Title**: Massive animated gradient text "Kissune K-pop Collection"
- **Category Tabs**: Large, bold pills (Cards | Wallpapers | Frames)
- **Type Filters**: Below categories (Limited | Event | Regular | Collabs)
- **Grid**: Masonry-style with proper aspect ratios
- **Stats**: Floating counter badges with animations

### Item Detail View
- **Layout**: 70% image, 30% metadata (desktop)
- **Image**: Max display with zoom capability
- **Metadata**: Category, Type, Dimensions, Added by, Date
- **Actions**: Download (gradient button), Share (outline), Set as Profile (sparkle)
- **Background**: Blurred version of item image

### Category Pages
- Each category gets its own gradient theme
- Dedicated empty states with category-specific illustrations
- Different grid layouts per type (cards vs wallpapers)

---

## K-pop Idol Images Usage

**Hero Rotator**: Use provided images as rotating hero backgrounds:
- Aespa - Pink/Purple gradient overlay
- Red Velvet - Soft pink overlay  
- Stray Kids - Blue/Yellow overlay
- TXT - Cyan/Purple overlay
- EXO - Monochrome cool overlay

**Parallax Effects**: Hero images move slower than foreground on scroll
**Blur Overlays**: Always use colorful gradient overlays, never pure dark
**Mood Matching**: Image color extraction for dynamic theme colors

---

## Rarity/Type Visual System

**Limited** (Exclusive, Rare):
- Gold gradient border: `from-yellow-400 via-yellow-500 to-orange-500`
- Sparkle animation
- Glow effect: `shadow-2xl shadow-yellow-500/50`

**Event** (Special, Temporary):
- Rainbow gradient border (animated)
- Shimmer effect
- Glow: `shadow-2xl shadow-purple-500/50`

**Regular** (Standard):
- Category color border (solid)
- Subtle hover lift
- Glow: category-based

**Collabs** (Special Partnerships):
- Multi-color gradient: `from-pink-500 via-purple-500 to-cyan-500`
- Pulse animation
- Glow: `shadow-2xl shadow-pink-500/50`

---

## Motion & Interaction

**Micro-interactions**:
- Button press: scale-95 with spring
- Card hover: lift + glow in 200ms
- Filter switch: color morph 300ms
- Modal open: scale + fade 250ms
- Success: confetti burst

**Page Transitions**:
- Route change: fade + slight slide
- Category switch: smooth color transition
- Filter apply: stagger animation on cards

**Loading States**:
- Skeleton: gradient shimmer (colorful)
- Spinner: gradient rotating ring
- Image load: blur-up with color

---

## Accessibility & Polish

- High contrast ratios maintained even with bright colors
- Focus rings: colorful, visible (purple/pink gradient)
- Motion: respects `prefers-reduced-motion`
- Touch targets: min 44px on mobile
- Keyboard nav: clear focus states

The website should feel like a K-pop album come to life - vibrant, energetic, and absolutely fun to explore!
