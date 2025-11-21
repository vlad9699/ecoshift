# EcoShift - Game Architecture

## Executive Summary

EcoShift is a browser-first environmental impact game built with React, TypeScript, and Vite. The architecture follows a component-based SPA pattern with client-side state management, LocalStorage persistence, and AI-powered content generation via Google Gemini API. The game delivers 30-second mini-game experiences across three vehicle types (Drone, AquaBot, Rover) with a campaign progression system, upgrade mechanics, and real-world pollution sector mapping.

**Architecture Approach:** Monolithic SPA with modular component architecture, service layer for external APIs, and progressive enhancement for offline capabilities. No backend required for MVP - all state persists locally with future-ready hooks for cloud sync.

---

## Project Initialization

**Current Status:** Project already initialized with Vite + React + TypeScript

The project was bootstrapped using Vite with React plugin. No additional initialization needed.

**Base Architecture Decisions (Already Made):**
- Build Tool: Vite 6.2.0
- Framework: React 19.2.0
- Language: TypeScript 5.8.2
- Styling: Tailwind CSS (via utility classes)
- Icons: Lucide React 0.554.0
- Charts: Recharts 3.4.1 (for future analytics)

---

## Decision Summary

| Category | Decision | Version | Affects Epics | Rationale |
| -------- | -------- | ------- | ------------- | --------- |
| Frontend Framework | React | 19.2.0 | All | Component-based UI, excellent ecosystem, strong TypeScript support |
| Build Tool | Vite | 6.2.0 | All | Fast HMR, optimized production builds, modern tooling |
| Language | TypeScript | 5.8.2 | All | Type safety, better DX, prevents runtime errors |
| State Management | React useState/useEffect + LocalStorage | Native | Epic 3 | Simple state needs, no complex global state required |
| Styling | Tailwind CSS (utility classes) | Latest | All | Rapid UI development, consistent design system |
| AI Service | Google Gemini API | 2.5-flash | Epic 1, Epic 5 | Cost-effective, fast responses for narrative generation |
| Persistence | LocalStorage | Native | Epic 3 | No backend needed for MVP, instant saves |
| Game Rendering | HTML5 Canvas | Native | Epic 2 | Full control over game loop, performance, custom rendering |
| Audio | Web Audio API | Native | Epic 2 | Procedural sound generation, no asset loading |
| Maps Integration | Custom SVG-based sector map | Current | Epic 1 | No Google Maps API dependency, works offline |
| Component Architecture | Feature-based organization | N/A | All | Components grouped by feature (games, maps, UI) |
| Error Handling | Try-catch with fallbacks | N/A | All | Graceful degradation when AI/features unavailable |
| Code Organization | Feature-first, type definitions separate | N/A | All | Clear separation of concerns, easy to navigate |

---

## Project Structure

```
hachathon_v1/
├── ecoshift/                    # Main application directory
│   ├── components/             # React components
│   │   ├── CityMap.tsx         # Legacy city map (may be deprecated)
│   │   ├── CitySectorMap.tsx   # SVG-based sector visualization
│   │   ├── DroneGame.tsx       # Aerial cleanup mini-game
│   │   ├── WaterGame.tsx       # Underwater cleanup mini-game
│   │   ├── RoverGame.tsx       # Ground-based cleanup mini-game
│   │   ├── MiniGame.tsx        # Base game component (if shared logic)
│   │   └── TutorialModal.tsx   # First-time user tutorial
│   ├── services/               # External service integrations
│   │   └── geminiService.ts    # Google Gemini API client
│   ├── utils/                  # Utility functions and helpers
│   │   └── SoundManager.ts     # Web Audio API sound system
│   ├── types.ts                # TypeScript type definitions
│   ├── constants.ts            # Game constants, upgrades, achievements
│   ├── App.tsx                 # Main application component
│   ├── index.tsx               # Application entry point
│   ├── index.html              # HTML template
│   ├── vite.config.ts          # Vite configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json            # Dependencies and scripts
├── docs/                       # Project documentation
│   ├── prd.md                  # Product Requirements Document
│   ├── epics.md                # Epic breakdown and user stories
│   └── game-architecture.md    # This document
└── package.json               # Root package.json (if monorepo)
```

---

## Epic to Architecture Mapping

| Epic | Architecture Components | Key Technologies |
| --- | --- | --- |
| **Epic 1: Atlas Command & Sector Intelligence** | `CitySectorMap.tsx`, `geminiService.ts`, sector state management | SVG rendering, AI API, LocalStorage |
| **Epic 2: Instant Cleanup Missions** | `DroneGame.tsx`, `WaterGame.tsx`, `RoverGame.tsx`, `SoundManager.ts` | Canvas API, Web Audio API, game loop |
| **Epic 3: Progression, Idle Loop & Hangar** | `App.tsx` (state), `constants.ts` (upgrades), LocalStorage persistence | React state, upgrade calculations |
| **Epic 4: Impact Economy & Partner Rewards** | New components: `Wallet.tsx`, `PartnerRewards.tsx`, transaction logging | State management, UI components |
| **Epic 5: Collective Momentum & LiveOps** | Leaderboard components, event system, AI recommendation engine | State management, AI service |

---

## Technology Stack Details

### Core Technologies

**Frontend Framework: React 19.2.0**
- Component-based architecture
- Hooks for state and lifecycle management
- No global state library needed (useState/useEffect sufficient)
- Server Components not used (client-side SPA)

**Build System: Vite 6.2.0**
- Fast HMR for development
- Optimized production builds with code splitting
- Environment variable handling via `loadEnv`
- TypeScript compilation integrated

**Language: TypeScript 5.8.2**
- Strict type checking enabled
- Interfaces for all game entities (District, PlayerStats, DroneStats)
- Type-safe API responses

**Styling: Tailwind CSS (Utility Classes)**
- Utility-first approach
- Custom color palette (emerald, slate, blue themes)
- Responsive design with breakpoints
- Dark theme by default

### Integration Points

**Google Gemini API Integration**
- Service: `services/geminiService.ts`
- Model: `gemini-2.5-flash`
- Use Cases:
  - City level generation (`generateCityLevel`)
  - Mission briefing generation (`getMissionBriefing`)
- Error Handling: Falls back to simulation data if API unavailable
- Environment: `GEMINI_API_KEY` required in `.env.local`

**LocalStorage Persistence**
- Key: `ECOSHIFT_SAVE_DATA_V1`
- Data Structure:
  ```typescript
  {
    stats: PlayerStats,
    districts: District[],
    timestamp: number
  }
  ```
- Auto-save on state changes via `useEffect`
- Load on app initialization

**Web Audio API**
- Service: `utils/SoundManager.ts`
- Features:
  - Procedural music generation (cyberpunk bassline)
  - Sound effects (collect, damage, explosion, etc.)
  - Ambience (ocean sounds, whale calls)
- Singleton pattern: `soundManager` exported

---

## Novel Pattern Designs

### 1. AI-Driven City Generation with Topological Templates

**Purpose:** Generate realistic city districts with geographic accuracy without requiring Google Maps API.

**Components:**
- `geminiService.ts`: AI client and prompt engineering
- `constants.ts`: Topological template definitions (RIVER_SPLIT, COASTAL_WEST, etc.)
- `CitySectorMap.tsx`: SVG path rendering based on templates

**Data Flow:**
1. User selects city from campaign
2. `generateCityLevel()` sends city name + difficulty to Gemini
3. AI selects appropriate topology template
4. AI generates 6 districts with real names, problems, educational tips
5. Districts mapped to SVG paths from selected template
6. Districts rendered on `CitySectorMap` component

**Implementation Guide:**
- Always provide fallback simulation data if AI fails
- Cache AI responses per city to reduce API calls
- Validate AI response structure before using
- Map `sectorIndex` from AI to correct SVG path array index

**Affects Epics:** Epic 1

### 2. Multi-Vehicle Game System with Shared Base

**Purpose:** Three distinct mini-games (Drone, AquaBot, Rover) with different mechanics but shared infrastructure.

**Components:**
- `DroneGame.tsx`: Aerial pollution collection
- `WaterGame.tsx`: Underwater waste cleanup
- `RoverGame.tsx`: Ground-based combat/collection
- `MiniGame.tsx`: Shared base (if refactored)

**Shared Patterns:**
- Canvas-based rendering
- Game loop using `requestAnimationFrame`
- Stats system: `speed`, `battery`, `filterRadius`, `hull`
- Score calculation and completion callbacks
- Sound integration via `SoundManager`

**Vehicle-Specific Mechanics:**
- **Drone**: Air movement, pollution particles, EMP ability
- **AquaBot**: Underwater movement, bubble effects, sonar ability
- **Rover**: Ground movement, turret combat, crate smashing

**Implementation Guide:**
- Use `getVehicleStats(type)` to calculate stats from upgrades
- Game type determined by district content analysis
- Each game component receives `district` and `droneStats` props
- All games call `onComplete(score, success, tokensFound)` when done

**Affects Epics:** Epic 2

### 3. Upgrade System with Multi-Vehicle Support

**Purpose:** Single upgrade shop supporting three vehicle types with separate upgrade trees.

**Components:**
- `constants.ts`: `SHOP_UPGRADES`, `SUB_UPGRADES`, `ROVER_UPGRADES`
- `App.tsx`: `getVehicleStats()` calculates final stats
- Hangar UI: Tab-based vehicle selection

**Data Structure:**
```typescript
upgrades: Record<string, number>  // { 'eng_1': 3, 'bat_1': 2 }
```

**Calculation Pattern:**
- Base stats defined per vehicle type
- Iterate through relevant upgrade list
- Apply stat effects multiplicatively or additively
- Return final `DroneStats` object

**Implementation Guide:**
- Always check `hangarTab` state to show correct upgrade list
- Use `Math.pow(1.5, currentLevel)` for cost scaling
- Validate `maxLevel` before allowing purchase
- Immediately recalculate stats after purchase

**Affects Epics:** Epic 3

---

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents:

### Naming Conventions

**Components:**
- PascalCase for component files: `DroneGame.tsx`, `CitySectorMap.tsx`
- Component names match file names exactly
- Props interfaces: `{ComponentName}Props` (e.g., `DroneGameProps`)

**Functions:**
- camelCase for functions: `generateCityLevel`, `getVehicleStats`
- Async functions: No special suffix, just `async`
- Event handlers: `handle{Action}` (e.g., `handleMissionComplete`)

**Constants:**
- UPPER_SNAKE_CASE for constants: `SAVE_KEY`, `CAMPAIGN_CITIES`
- Arrays: Plural nouns: `SHOP_UPGRADES`, `ACHIEVEMENTS_LIST`

**Types/Interfaces:**
- PascalCase: `PlayerStats`, `District`, `DroneStats`
- Enums: PascalCase with UPPER values: `DistrictStatus.RESTORED`

### Code Organization Patterns

**File Structure:**
- One component per file
- Types in `types.ts` (shared) or co-located (component-specific)
- Constants in `constants.ts`
- Services in `services/` directory
- Utilities in `utils/` directory

**Component Structure:**
```typescript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { Type } from './types';

// 2. Interfaces
interface ComponentProps {
  // props
}

// 3. Constants (if component-specific)
const CONSTANT = 'value';

// 4. Component
export const Component: React.FC<ComponentProps> = ({ prop }) => {
  // State
  // Refs
  // Effects
  // Handlers
  // Render
  return <div>...</div>;
};
```

**State Management:**
- Use `useState` for local component state
- Use `useEffect` for side effects and persistence
- Use `useRef` for values that don't trigger re-renders (game loops, intervals)
- LocalStorage operations in `useEffect` with dependency arrays

### Error Handling

**Pattern:**
```typescript
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.warn("Operation failed, using fallback:", error);
  return fallbackValue;
}
```

**AI Service Fallbacks:**
- Always provide fallback data when AI unavailable
- Log warnings, don't throw errors that break UX
- Cache successful responses to reduce API dependency

**Game Loop Error Handling:**
- Wrap game loop in try-catch
- Gracefully degrade (pause game, show error message)
- Never let game loop crash entire app

### Logging Strategy

**Console Levels:**
- `console.warn()`: Recoverable issues (AI failures, missing data)
- `console.error()`: Critical failures (save corruption, API errors)
- `console.log()`: Development debugging (remove before production)

**No External Logging Service:**
- MVP uses browser console only
- Future: Add analytics service for production

### Data Format Patterns

**LocalStorage:**
- Single key: `ECOSHIFT_SAVE_DATA_V1`
- JSON serialization
- Include `timestamp` for version detection
- Validate on load, reset if corrupted

**API Responses:**
- Gemini returns JSON (via `responseMimeType`)
- Parse and validate structure
- Type assertions after validation

**State Updates:**
- Immutable updates: `setStats(prev => ({ ...prev, ...updates }))`
- Batch related updates in single setState call
- Use functional updates to avoid stale closures

### Communication Patterns

**Parent-Child Communication:**
- Props down: Pass data and callbacks as props
- Events up: Callbacks like `onComplete`, `onClose`
- No event bus or context needed for MVP

**Component Lifecycle:**
- `useEffect` for initialization (load from LocalStorage)
- `useEffect` for persistence (save on state change)
- `useEffect` cleanup for intervals, event listeners

**Game Loop Pattern:**
```typescript
const requestRef = useRef<number>(0);

useEffect(() => {
  const animate = (time: number) => {
    // Game logic
    requestRef.current = requestAnimationFrame(animate);
  };
  requestRef.current = requestAnimationFrame(animate);
  
  return () => cancelAnimationFrame(requestRef.current);
}, []);
```

### Location Patterns

**Component Files:**
- `components/` for all React components
- Group by feature, not by type

**Service Files:**
- `services/` for external API integrations
- One service per external system

**Utility Files:**
- `utils/` for pure functions and helpers
- Singleton classes (like `SoundManager`) in `utils/`

**Configuration:**
- `constants.ts` for game data (upgrades, achievements, cities)
- `types.ts` for TypeScript definitions
- `vite.config.ts` for build configuration

### Consistency Patterns

**Date/Time:**
- Use `Date.now()` for timestamps
- Store as numbers, not strings
- Calculate idle time: `Date.now() - lastSaveTimestamp`

**Currency Display:**
- EcoCoins: Integer display, "G" suffix (e.g., "500 G")
- Impact Tokens: Integer display, "Tokens" label
- No decimal places for currencies

**Loading States:**
- Use boolean flags: `loadingCity`, `loadingBriefing`
- Show spinner or skeleton UI during loading
- Always have fallback content if loading fails

**Responsive Design:**
- Mobile-first approach
- Breakpoints: `md:` (768px), `lg:` (1024px)
- Hide/show content with `hidden md:inline`
- Touch-friendly button sizes on mobile

---

## Data Architecture

### Core Data Models

**PlayerStats:**
```typescript
interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  ecoCoins: number;
  impactTokens: number;
  globalHealth: number;
  title: string;
  upgrades: Record<string, number>;  // upgradeId -> level
  unlockedAchievements: string[];   // achievement IDs
  missionsCompleted: number;
  districtsRestored: number;
  campaignStage: number;             // Current city index
  tutorialSeen: boolean;
  totalEnemiesDefeated: number;
  totalCratesSmashed: number;
}
```

**District:**
```typescript
interface District {
  id: string;                        // Unique identifier
  name: string;                      // Real district name
  realAddress?: string;
  googleMapsUri?: string;
  pollutionLevel: number;             // 0-100
  status: DistrictStatus;            // SCANNED, ACTIVE, RESTORED, etc.
  description?: string;
  realWorldProblem?: string;
  educationalTip?: string;
  coordinates?: { lat: number; lng: number };
  gridIndex?: number;                // Position on sector map
  mapPath?: string;                  // SVG path data
  type?: DistrictType;
}
```

**DroneStats:**
```typescript
interface DroneStats {
  speed: number;                     // Movement multiplier
  battery: number;                    // Max energy
  filterRadius: number;               // Collection range (pixels)
  hull: number;                       // Health points
  empRadius: number;                  // Special ability range (0 = not unlocked)
}
```

### Data Relationships

**Player → Districts:**
- One-to-many: Player has many districts
- Districts stored in array, filtered by `campaignStage`
- District status updated when mission completes

**Player → Upgrades:**
- Many-to-many: Player has many upgrades, each at a level
- Stored as `Record<string, number>`
- Upgrades affect vehicle stats via `getVehicleStats()`

**Player → Achievements:**
- Many-to-many: Player unlocks many achievements
- Stored as array of achievement IDs
- Checked on stat changes via `checkProgression()`

**District → Campaign City:**
- Many-to-one: Districts belong to a campaign city
- City selected via `campaignStage` index
- Districts regenerated when city changes

### State Flow

**Initialization:**
1. App loads → Read from LocalStorage
2. If no save: Use `DEFAULT_STATS`
3. Check `campaignStage` → Load/generate districts for current city
4. Render dashboard

**Mission Flow:**
1. Select district → Set `activeDistrict`
2. Generate briefing (async) → Update `briefing` state
3. Launch mission → Set `view` to 'GAME'
4. Game plays → Updates score, energy, health
5. Mission completes → Call `handleMissionComplete()`
6. Update stats → Save to LocalStorage
7. Update district status → Save to LocalStorage
8. Return to dashboard

**Upgrade Flow:**
1. Open Hangar → Set `view` to 'HANGAR'
2. Select vehicle tab → Set `hangarTab`
3. View upgrades → Filter by vehicle type
4. Purchase upgrade → Call `buyUpgrade()`
5. Update `stats.upgrades` → Save to LocalStorage
6. Stats recalculated on next mission

---

## API Contracts

### Google Gemini API

**Endpoint:** Google GenAI SDK (`@google/genai`)

**generateCityLevel:**
```typescript
generateCityLevel(cityName: string, difficulty: number): Promise<District[]>
```
- **Input:** City name, difficulty multiplier
- **Output:** Array of 6 District objects
- **Error Handling:** Returns `generateSimulationData()` on failure
- **Caching:** Not implemented (future: cache per city)

**getMissionBriefing:**
```typescript
getMissionBriefing(district: District): Promise<string>
```
- **Input:** District object
- **Output:** String briefing text (max 25 words)
- **Error Handling:** Returns fallback string on failure
- **Caching:** Not implemented (future: cache per district ID)

### LocalStorage API

**Save:**
```typescript
localStorage.setItem(SAVE_KEY, JSON.stringify({
  stats: PlayerStats,
  districts: District[],
  timestamp: number
}))
```

**Load:**
```typescript
const saved = localStorage.getItem(SAVE_KEY);
const parsed = JSON.parse(saved);
// Validate and use parsed.stats, parsed.districts
```

**Error Handling:**
- Try-catch around JSON.parse
- Reset to defaults if corrupted
- Log warnings, don't crash

---

## Security Architecture

### Client-Side Security

**API Keys:**
- Stored in `.env.local` (gitignored)
- Injected via Vite `define` in `vite.config.ts`
- Never exposed in client bundle (Vite handles this)
- Access via `process.env.GEMINI_API_KEY`

**LocalStorage:**
- No sensitive data stored (only game progress)
- No PII (Personally Identifiable Information)
- Save data can be reset by user
- No encryption needed for MVP

### Input Validation

**AI Responses:**
- Validate JSON structure before using
- Check required fields exist
- Sanitize text content (remove code blocks)
- Fallback to simulation data if invalid

**User Input:**
- No user-generated content in MVP
- Future: Validate any text inputs before sending to AI

### XSS Prevention

- React automatically escapes content
- No `dangerouslySetInnerHTML` used
- External links use `target="_blank" rel="noreferrer"`

---

## Performance Considerations

### Rendering Performance

**Canvas Optimization:**
- Use `requestAnimationFrame` for smooth 60 FPS
- Throttle particle updates if count > 1000
- Clear canvas each frame before redraw
- Use object pooling for particles (future optimization)

**React Optimization:**
- Memoize expensive calculations with `useMemo`
- Avoid unnecessary re-renders with proper dependency arrays
- Use `useRef` for values that don't need re-renders

**SVG Rendering:**
- `CitySectorMap` uses SVG paths (lightweight)
- No complex animations on map (CSS transitions only)
- Limit number of districts rendered simultaneously

### Asset Loading

**No External Assets:**
- All graphics procedurally generated (Canvas)
- All sounds procedurally generated (Web Audio API)
- No image/audio files to load
- Instant startup time

**Code Splitting:**
- Vite automatically code-splits
- Game components can be lazy-loaded (future)
- Current: All components loaded upfront (acceptable for MVP size)

### State Management Performance

**LocalStorage:**
- Save on state changes (debounced in future)
- Load once on initialization
- JSON serialization is fast for small data (< 100KB)

**State Updates:**
- Batch related updates
- Use functional updates to avoid stale closures
- Minimize re-renders with proper state structure

### AI API Performance

**Caching Strategy (Future):**
- Cache city generation per city name
- Cache mission briefings per district ID
- Reduce API calls by 80%+

**Error Handling:**
- Fast fallback to simulation data
- Don't block UI on AI failures
- Show loading states, but don't wait indefinitely

---

## Deployment Architecture

### Build Process

**Development:**
```bash
npm run dev
```
- Vite dev server on port 3000
- HMR enabled
- Source maps for debugging

**Production:**
```bash
npm run build
```
- Output to `dist/` directory
- Minified and optimized
- Code splitting enabled
- Environment variables injected at build time

### Hosting Options

**Static Hosting:**
- Deploy `dist/` folder to any static host
- Options: Vercel, Netlify, GitHub Pages, Cloudflare Pages
- No server required (pure SPA)

**Environment Variables:**
- Set `GEMINI_API_KEY` in hosting platform
- Vite injects at build time
- No runtime environment variable access needed

### Future Backend Considerations

**When Needed:**
- Cloud save sync
- Leaderboards
- Multiplayer features
- Partner reward redemption

**Architecture:**
- Keep current SPA architecture
- Add API client layer
- Progressive enhancement (works offline, syncs when online)

---

## Development Environment

### Prerequisites

- Node.js 18+ (for Vite 6)
- npm or yarn
- Google Gemini API key (for AI features)

### Setup Commands

```bash
# Install dependencies
cd ecoshift
npm install

# Create environment file
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Workflow

1. **Start Dev Server:** `npm run dev`
2. **Open Browser:** http://localhost:3000
3. **Make Changes:** HMR updates automatically
4. **Test Features:** Use browser dev tools
5. **Check Types:** TypeScript compiles on save
6. **Build:** `npm run build` before deployment

### Debugging

**Browser DevTools:**
- React DevTools extension (recommended)
- Console for warnings/errors
- LocalStorage inspection
- Network tab for API calls

**TypeScript:**
- Errors shown in IDE
- Compile-time type checking
- No runtime type validation needed

---

## Architecture Decision Records (ADRs)

### ADR-001: Monolithic SPA Architecture

**Decision:** Build as single-page application with no backend for MVP.

**Rationale:**
- Faster development (no server setup)
- Lower hosting costs (static hosting)
- Works offline (LocalStorage persistence)
- Future-ready (can add backend later)

**Alternatives Considered:**
- Full-stack with Node.js backend (overkill for MVP)
- Serverless functions (adds complexity, not needed yet)

**Consequences:**
- All state client-side
- No real-time multiplayer (acceptable for MVP)
- Cloud sync requires future backend

---

### ADR-002: Canvas-Based Game Rendering

**Decision:** Use HTML5 Canvas for all mini-games instead of DOM/CSS animations.

**Rationale:**
- Full control over rendering
- Better performance for particle systems
- Easier to implement game physics
- Consistent across all game types

**Alternatives Considered:**
- DOM-based games (limited performance)
- WebGL (overkill, adds complexity)

**Consequences:**
- More code for rendering logic
- No CSS animations for game elements
- Better performance for complex scenes

---

### ADR-003: Procedural Audio Generation

**Decision:** Generate all sounds procedurally using Web Audio API instead of loading audio files.

**Rationale:**
- Zero asset loading time
- Smaller bundle size
- Dynamic sound generation
- No copyright concerns

**Alternatives Considered:**
- Pre-recorded audio files (larger bundle, loading time)
- External audio service (adds dependency)

**Consequences:**
- More complex audio code
- Sounds are synthetic (acceptable for game feel)
- Easy to modify sounds programmatically

---

### ADR-004: AI-Powered Content Generation

**Decision:** Use Google Gemini API for city and mission content generation.

**Rationale:**
- Dynamic, personalized content
- Real-world accuracy (district names, problems)
- Educational value (tips, context)
- Reduces manual content creation

**Alternatives Considered:**
- Static content (less engaging)
- Other AI providers (Gemini is cost-effective)

**Consequences:**
- Requires API key
- Network dependency (mitigated with fallbacks)
- Cost per API call (minimal for MVP scale)

---

### ADR-005: LocalStorage-Only Persistence

**Decision:** Store all game data in browser LocalStorage, no cloud sync for MVP.

**Rationale:**
- Instant saves (no network delay)
- Works offline
- No backend required
- Simple implementation

**Alternatives Considered:**
- Cloud database (adds complexity, cost)
- IndexedDB (overkill for current data size)

**Consequences:**
- Data tied to browser/device
- No cross-device sync (future feature)
- Limited storage (5-10MB, sufficient for MVP)
- Can be cleared by user (acceptable risk)

---

### ADR-006: Component-Based Architecture

**Decision:** Organize code by feature/components, not by technical layer.

**Rationale:**
- Easy to find related code
- Clear component boundaries
- Scalable as features grow
- Matches React best practices

**Alternatives Considered:**
- Layer-based (components/, services/, utils/ separate) - harder to navigate
- Feature modules (overkill for current size)

**Consequences:**
- Some duplication possible (acceptable)
- Easy to extract to modules later
- Clear mental model for developers

---

## Consistency Rules

### Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `DroneGame.tsx`)
- Utilities: `PascalCase.ts` (e.g., `SoundManager.ts`)
- Types: `camelCase.ts` (e.g., `types.ts`)
- Constants: `camelCase.ts` (e.g., `constants.ts`)

**Variables:**
- `camelCase` for variables and functions
- `UPPER_SNAKE_CASE` for constants
- `PascalCase` for types and interfaces

**Components:**
- Export as named export: `export const Component`
- Props interface: `{Component}Props`
- File name matches component name exactly

### Code Organization

**Imports Order:**
1. React and React hooks
2. Third-party libraries
3. Local types
4. Local components
5. Local utilities/services
6. Local constants

**Component Structure:**
1. Imports
2. Type definitions (if component-specific)
3. Constants (if component-specific)
4. Component definition
5. Exports (if any)

**State Management:**
- Use `useState` for reactive state
- Use `useRef` for non-reactive values
- Use `useEffect` for side effects
- Group related state in objects when logical

### Error Handling

**Pattern:**
```typescript
try {
  // Operation
} catch (error) {
  console.warn("Context:", error);
  return fallback;
}
```

**AI Operations:**
- Always provide fallback data
- Log warnings, don't throw
- Don't block UI on failures

**Game Operations:**
- Wrap game loop in try-catch
- Gracefully pause on errors
- Show user-friendly error messages

### Logging

**Development:**
- `console.log()` for debugging (remove before production)
- `console.warn()` for recoverable issues
- `console.error()` for critical failures

**Production:**
- Remove all `console.log()` calls
- Keep `console.warn()` and `console.error()` for diagnostics
- Future: Add analytics service

---

_Generated by BMAD Game Architecture Workflow_  
_Date: 2025-01-27_  
_For: EcoShift Project_

