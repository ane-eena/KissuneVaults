# Kissune Card Showcase - Design Guidelines

## Design Approach: Hybrid System

**Selected Approach**: Design System Foundation with Trading Card Database Inspiration

**Justification**: This is a utility-focused card gallery requiring efficient browsing and search, but the visual presentation of cards is paramount. Drawing inspiration from modern card databases (TCGPlayer, Scryfall) and Pinterest's masonry layouts for visual richness.

**Key Design Principles**:
- Cards-first presentation - images are the primary content
- Efficient scanning and discovery
- Clean, distraction-free browsing experience
- Fast visual comprehension

---

## Core Design Elements

### A. Color Palette

**Dark Mode Primary** (default):
- Background: 220 25% 8% (deep navy-black)
- Surface: 220 20% 12% (elevated card backgrounds)
- Surface Elevated: 220 18% 16% (modals, dropdowns)
- Border: 220 15% 24% (subtle dividers)

**Light Mode**:
- Background: 220 20% 97% (soft white)
- Surface: 0 0% 100% (pure white cards)
- Border: 220 15% 88% (light gray dividers)

**Accent Colors**:
- Primary: 260 60% 58% (vibrant purple - Discord connection)
- Primary Hover: 260 65% 62%
- Success: 142 76% 36% (card added confirmation)
- Warning: 38 92% 50% (rare card indicator)

**Text**:
- Dark Mode: 0 0% 95% (primary), 220 10% 65% (secondary)
- Light Mode: 220 20% 15% (primary), 220 15% 45% (secondary)

### B. Typography

**Font Stack**:
- Primary: 'Inter', system-ui, sans-serif (clean, modern)
- Display: 'Bricolage Grotesque', 'Inter', sans-serif (card titles, headers)
- Mono: 'JetBrains Mono', monospace (card IDs, technical data)

**Scale**:
- Hero/Display: text-5xl to text-6xl, font-bold (page titles)
- Headings: text-2xl to text-3xl, font-semibold (section headers)
- Card Names: text-lg, font-semibold (card grid)
- Body: text-base, font-normal (descriptions, metadata)
- Labels: text-sm, font-medium (filters, tags)
- Metadata: text-xs, font-normal (card stats, timestamps)

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 8, 12, 16, 20 for consistency
- Micro spacing: p-2, gap-2 (tight card metadata)
- Standard spacing: p-4, gap-4 (card padding, grid gaps)
- Section spacing: py-8, py-12 (between major sections)
- Page margins: px-4 (mobile), px-8 (tablet), px-12 to px-16 (desktop)

**Grid System**:
- Card Gallery: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4`
- Max container: max-w-7xl mx-auto
- Responsive breakpoints: sm:640px, md:768px, lg:1024px, xl:1280px

### D. Component Library

**Navigation**:
- Sticky top header with blur backdrop: backdrop-blur-xl bg-background/80
- Logo + search bar (prominent center) + user menu (right)
- Mobile: hamburger menu with slide-out drawer
- Active state: border-b-2 border-primary

**Card Components**:
- Card Container: rounded-lg overflow-hidden border border-border bg-surface hover:shadow-xl transition-shadow
- Image Display: aspect-square object-cover w-full (consistent ratios)
- Card Info Overlay: absolute bottom-0 gradient-to-t from-black/80 p-4
- Quick Actions: hover-revealed buttons (view, share, favorite)
- Rarity Indicators: colored border-t-4 (common: gray, rare: gold, ultra: rainbow gradient)

**Search & Filters**:
- Global Search: Large centered input with icon, rounded-full, shadow-lg
- Filter Pills: rounded-full px-4 py-1.5, active state with bg-primary text-white
- Advanced Filters: Slide-out panel from right, organized sections with checkboxes/sliders
- Sort Dropdown: Custom styled select with icons

**Card Detail Modal/Page**:
- Large image showcase (left 60% on desktop)
- Metadata panel (right 40%): name, ID, rarity, stats, timestamps
- Related cards section below
- Share/download buttons with icons

**Data Display**:
- Stats Grid: 2-column layout with label-value pairs
- Timeline: vertical line with connected events (card history)
- Tags: inline-flex flex-wrap gap-2 with rounded badges

**Forms (Add Card via Discord)**:
- Visual Upload Area: dashed border, drag-drop zone with icon
- Preview Panel: immediate image preview after upload
- Success Toast: slide-in from top-right with check icon

### E. Visual Enhancements

**Animations** (minimal):
- Card hover: transform scale-105 transition-transform duration-200
- Filter toggle: smooth opacity transitions
- Image loading: skeleton pulse animation
- No scroll-triggered animations (performance priority)

**Effects**:
- Card shadows: hover:shadow-2xl hover:shadow-primary/20
- Image optimization: lazy loading, blur placeholder
- Glassmorphism: backdrop-blur-xl on header/modals only

---

## Page-Specific Guidelines

### Homepage/Gallery
- **Hero Section**: Full-width search bar with "Browse X,XXX Cards" count, subtle gradient background
- **Featured Cards**: Horizontal scroll carousel of newest/rarest cards (h-64)
- **Main Gallery**: Infinite scroll grid of all cards
- **Quick Filters**: Sticky filter bar below header

### Card Detail View
- **Layout**: Side-by-side image + metadata on desktop, stacked on mobile
- **Image**: max-h-screen with zoom-on-click modal
- **Metadata Sections**: Rarity, Stats, Discord Info, Upload History
- **Actions**: Share link, Download, Report Issue buttons

### Admin/Add Card Interface
- **Dashboard Style**: Left sidebar navigation
- **Upload Interface**: Large dropzone, bulk upload support
- **Preview Grid**: Live preview of uploaded cards before publishing
- **S3 Status**: Connection indicator, CDN health check

---

## Images

**Hero Background**: Abstract card pattern texture (subtle, dark, low opacity ~10%) - decorative element behind search
**Card Placeholders**: Gradient with card silhouette during load
**Empty States**: Illustrated empty box with "No cards found" message
**Discord Integration Icon**: Discord logo in navigation to show connection status

The website includes a prominent search-focused hero (not image-based) with card gallery as primary content below.