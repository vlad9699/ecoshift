# EcoShift - Product Requirements Document

**Author:** Vlad
**Date:** 2025-11-21
**Version:** 1.0

---

## Executive Summary

EcoShift is a browser-first environmental impact platform that dramatizes pollution hotspots on a live Google Maps canvas and invites players into ultra-short cleanup missions. It targets eco-conscious casual players and students who want meaningful impact without installs or long sessions, combining fast 30-second actions with idle progress tracking so they always feel momentum. Each polluted sector becomes a playable micro-scenario where AI narrators contextualize the damage, the player performs a rapid cleanup interaction, and the world map instantly reflects the healing they caused.

### What Makes This Special

Players receive instant, map-scale visual redemption the moment they complete a 30-second cleanup: a toxic Google Maps sector blooms green, AI narrates the comeback story, and partner brands immediately surface rewards for that good action—making the emotional payoff (“я реально змінив щось”) inseparable from tangible ecological impact.

---

## Project Classification

**Technical Type:** Web App
**Domain:** General
**Complexity:** Low

Web-app classification matched best because the experience is delivered through a browser-based React/Vite front end (`index.tsx`, `App.tsx`) with modular components (`CityMap`, `MiniGame`, `DroneGame`, `WaterGame`) and service hooks (`geminiService.ts`). Domain detection landed on "general" since, despite gamified elements, this is an environmental engagement platform rather than a regulated industry product, and it intentionally avoided the BMGD redirect by scoping gameplay to lightweight mini-sectors inside a broader platform. Complexity is considered low: there are no compliance gates, safety certifications, or mission-critical integrations yet, and the tech stack is the existing TypeScript SPA plus the planned Google Maps layer.

### Input Sources

- Product brief: _Not provided — capturing directly from EcoShift app context and live discovery._
- Domain brief: _Not provided — treated as general domain with no regulated addenda._
- Research docs: _None discovered in `/docs`; empirical hooks come from `ecoshift-global-protocol` folder and future Google Maps data feeds._

### Domain Context

EcoShift operates in the “general” software domain with environmental storytelling, so there are no external regulatory gates (HIPAA, PCI, etc.). The complexity lies in orchestrating near-real-time pollution visualization, AI narration, and token economies inside a browser-first experience—meaning success depends more on data freshness, user trust, and seamless partner integrations than on traditional compliance frameworks. Future integrations with NGOs or donation platforms should add lightweight governance (impact verification, partner approvals) but remain far simpler than high-compliance industries.

---

## Success Criteria

1. **Impact Engagement Loop**  
   - ≥60% of daily active players complete at least one full cleanup loop (scan hotspot → play 30-second mini-game → watch sector transform) per session and earn impact tokens.  
   - ≥50% of players who witness the transformation animation return within 24 hours to claim idle progress or start another mission.

2. **Progression & Mastery**  
   - Achievement ladder (Novice Eco-Warrior → Gaia Guardian) motivates players: ≥40% of active players unlock at least one new title or badge each week.  
   - Diverse mini-game modes (aerial drone, aquabot, land sweeper, future additions) maintain variety with ≥70% of missions rotating templates driven by pollution type.

3. **Token-to-Impact Conversion**  
   - ≥30% of minted impact tokens are redeemed for real ecological actions (project support, ocean cleanup, tree planting) each month.  
   - ≥25% of redemptions trigger partner rewards (“good action → brand reward”), validating sponsor ROI dashboards.

4. **Map Awareness & Data Trust**  
   - Players explore at least three distinct Google Maps sectors per week, ensuring global pollution storytelling coverage.  
   - 100% of sectors show before/after snapshots and AI-generated context, reinforcing the “I changed something real” moment.

### Business Metrics

- Activate at least 5 concurrent brand or NGO reward campaigns per quarter, each tied to measurable “good action → reward” triggers.
- Channel ≥$50K equivalent value per quarter into real ecological initiatives through token conversions (direct donations, project sponsorship, partner token swaps).
- Maintain a healthy economy: impact token inflow/outflow ratio stays between 0.8 and 1.2, preventing inflation while keeping redemptions meaningful.

---

## Product Scope

### MVP - Minimum Viable Product

1. **Base World Map (Browser-First)**  
   - Interactive Google Maps-style canvas with polluted sectors showing toxicity level, pollution type, and status badge.  
   - Clicking a sector opens the mission panel matching the existing UI shell.

2. **Core Cleanup Mini-Game (≥1 Template)**  
   - Single 30-second aerial/merge mission that runs instantly in Chrome, awards XP + EcoCoins, and visually flips the sector from grey to green.

3. **Progress + Idle System**  
   - Idle cleanup continues after mission completion, surfaces offline rewards (“Your sector cleaned X units while you were away”), and persists via LocalStorage.

4. **Token Rewards (Internal Only)**  
   - EcoCoins counter earned from missions/idle progress, spendable on 1–2 upgrades (e.g., faster drones, idle rate boost).

5. **Minimal UI Panels**  
   - Sector info, mission UI, rewards modal, upgrades tab, and XP level indicator—all styled like current EcoShift components.

6. **Essential Game Logic**  
   - XP leveling, sector state transitions (polluted → recovering → clean), and reliable state saving/loading.

### Growth Features (Post-MVP)

1. **Multiple Mini-Game Templates**  
   - Add aquabot water cleanup, smog-filtering drone runs, hazard waste sorting, and grid merge v2 for replay variety.

2. **Richer Achievements & Upgrade Trees**  
   - 20–40 badges, full skill trees (drones, tech, eco-stations), sector mastery bonuses.

3. **Squad Play / Social Layer**  
   - Team events, shared pollution index, monthly leaderboards, and “Clean your city” regional challenges.

4. **Live Events / LiveOps**  
   - Time-limited “Ocean Week”, “Smog Crisis”, “Plastic Storm” with boosters and unique missions.

5. **Deeper Partner Integrations**  
   - Sponsored missions, real-world rewards (discounts, donation matches), and CSR/ESG dashboards for brands.

### Vision (Future)

1. **AR Cleanups**  
   - Players scan real-world locations and sync rewards with in-game sectors.

2. **User-Generated Sectors**  
   - Community-built polluted zones, mini-games, narratives, and missions (Roblox-style creation).

3. **MMO-Scale Global Megamissions**  
   - Millions of players collaborate on continent-wide cleanups with real-time world-state shifts.

4. **AI Narrative Engine**  
   - Dynamic mission briefings, evolving sector stories, personalized arcs.

5. **Hybrid Tokenization Layer**  
   - Optional impact tokens redeemable for eco rewards, donation pools tied to NGOs, transparent on-chain receipts.

---

{{#if domain_considerations}}

## Domain-Specific Requirements

{{domain_considerations}}

This section shapes all functional and non-functional requirements below.
{{/if}}

---

{{#if innovation_patterns}}

## Innovation & Novel Patterns

1. **Live Google Maps Cleanup Board** – Instead of abstract level select screens, polluted sectors are literal map tiles augmented with AI-generated context, so every mission feels tied to a real place and data can evolve daily.
2. **Instant Visual Redemption Loop** – Ultra-short mini-games that immediately flip an entire sector’s visual state (grey → green) to deliver an emotional payoff that most idle/merge games delay behind long progress bars.
3. **Impact Token Economy with Brand Rewards** – Tokens earned from cleanups convert into ecological project funding and branded rewards, closing the loop between player effort, real-world action, and sponsor incentives.
4. **AI Storyteller for Environmental Context** – Gemini-driven narrators personalize each hotspot briefing, giving players bespoke micro-stories rather than canned mission text.
5. **Dual-Mode Progression (Active + Idle)** – Blending 30-second active play with idle sector healing keeps the game accessible while still surfacing measurable ecological stats per sector.

### Validation Approach

1. **Map Transformation Telemetry** – Instrument before/after sector view time and post-mission retention to prove instant visual redemption increases the next-day return rate by the targeted ≥50%.  
2. **Token-to-Impact Funnel Tracking** – Measure total tokens earned → redeemed → real-world dollars routed; A/B test partner reward prompts to maintain ≥30% ecological conversion.  
3. **AI Narrative Quality Loops** – Collect player sentiment on AI briefings (thumbs-up/down) and re-prompt Gemini with feedback tags to ensure ≥80% positive ratings before scaling.  
4. **Sponsor Pilot Cohorts** – Run early campaigns with 1–2 eco brands, tracking cost per “good action” and reward redemption latency to validate ROI before expanding inventory.
{{/if}}

---

## Web App Specific Requirements

1. **Front-End Framework & Composition**  
   - Continue using the existing Vite + React + TypeScript stack (`App.tsx`, modular components under `components/`).  
   - Preserve the design system already established in `ecoshift-global-protocol` (dark sci-fi palette, rounded cards, iconography).  
   - Each sector view is a componentized card with props for pollution metadata, allowing rapid injection of the Google Maps overlay.

2. **Google Maps Integration**  
   - Embed Google Maps (JS API) as the primary canvas with custom overlays for sectors; load pollution heat tiles, clickable markers, and state-driven styling (polluted vs. recovered).  
   - Provide graceful fallback (static geo grid) if Maps quota is exceeded, but default to live map.

3. **Data & Service Layer**  
   - Centralize remote calls in `services/` (extend `geminiService.ts` or add pollution/partner services).  
   - Pollution data ingestion initially mocked in TypeScript constants, but structure APIs for future real feeds.

4. **State Management & Persistence**  
   - Use React context/hooks for player profile, sectors, achievements, and token ledger; persist snapshots to LocalStorage for offline rewards.  
   - Support time-based diff calculations so idle progress can be computed after returning.

5. **Economy & Upgrades**  
   - Maintain upgrade catalogs defined in `constants.ts`, ensuring front-end sync for costs, icons, and stat effects.  
   - Token wallet UI should reflect eco coins, achievements, and future partner tokens.

6. **Responsive & Accessibility**  
   - Browser-first desktop experience with responsive scaling down to tablet/mobile (touch controls for mini-games).  
   - Ensure keyboard navigation for UI panels and basic WCAG AA color contrast, especially on critical buttons (Upgrade, Launch Mission).

---

## User Experience Principles

- **Hopeful Sci-Fi Control Room** – Interface echoes a mission control dashboard with deep navy gradients, neon accents, and a calm operator vibe.  
- **Instant Feedback Everywhere** – Every action (clicking a sector, completing a mini-game, spending tokens) triggers visual and audio cues reinforcing impact.  
- **30-Second Mastery** – Interactions must be learnable in under 5 seconds, with minimal HUD clutter.  
- **Accessible from Anywhere** – Large tap-friendly controls, clear typography, and contrast-safe palettes keep the experience approachable on laptops, tablets, or phones.  
- **Narrative Layering** – AI story blurbs surface in context (map tooltips, mission intros) without overwhelming the UI.

### Key Interactions

1. **Sector Dive** – Hover/click polluted sector → panel slides in with AI narrative, stats, and “Start Cleanup” CTA.  
2. **Mini-Game Loop** – Player executes a 30-second mechanic (drag drone, merge tiles, swipe debris) → immediate transformation animation + rewards modal.  
3. **Idle Rewards Check-In** – On returning, player sees an overlay summarizing idle progress and can claim tokens with a single click.  
4. **Upgrade Spend** – From Hangar tab, players review upgrades (Ion Thrusters, Graphene Battery, etc.), tap “Upgrade” and see stat boosts instantly apply.  
5. **Token Redemption** – Wallet panel lists available ecological projects and partner rewards, with a “Redeem” modal confirming impact narrative before completion.

---

## Functional Requirements

### Map & Sector Visualization
- **FR1:** Players can view a global Google Maps canvas segmented into pollution sectors with toxicity level, pollution type, and status badge overlays.  
- **FR2:** Players can hover or tap any sector to open a mission panel showing AI-generated narrative, stats, and action buttons.  
- **FR3:** The system dynamically recolors sectors (polluted, recovering, clean) based on mission outcomes and idle progress.  
- **FR4:** The map supports filtering by pollution type, difficulty, and partner campaign tags to highlight relevant hotspots.  
- **FR5:** When Google Maps is unavailable, players can fall back to a simplified grid map without losing sector data.

### Mission & Mini-Game Experience
- **FR6:** Players can launch at least one 30-second aerial/merge mini-game that awards XP and EcoCoins upon completion.  
- **FR7:** Additional mini-game templates (aquabot water cleanup, smog-filtering drone flight, hazardous waste sorting, grid merge v2) can be unlocked post-MVP and selected automatically based on sector pollution type.  
- **FR8:** Each mini-game culminates in a real-time transformation animation showing the sector flipping from grey/toxic to green/healthy.  
- **FR9:** The system tracks mission performance (score, completion time, streaks) and surfaces them in the rewards modal.  
- **FR10:** Players can pause or exit a mini-game, with partial progress saved or gracefully forfeited.

### Progression, Achievements & Titles
- **FR11:** Players have a persistent profile with XP leveling that unlocks new titles (Novice Eco-Warrior → Gaia Guardian).  
- **FR12:** The system awards achievements and badges tied to milestones (missions completed, sectors restored, upgrades purchased, partner actions).  
- **FR13:** Skill trees or upgrade branches (drones, tech, eco-stations) become available post-MVP to extend mastery.  
- **FR14:** A hangar UI lists available upgrades (Ion Thrusters, Graphene Battery, etc.) showing cost, stat boosts, and level caps.  
- **FR15:** Purchasing an upgrade immediately updates relevant stats (speed, battery, filter radius) and is reflected in-game.

### Idle & Return Loop
- **FR16:** After completing a mission, the sector enters an idle cleanup state that continues progress while the player is offline.  
- **FR17:** Upon returning, players receive an idle summary overlay showing cleaned units, tokens earned, and sectors affected.  
- **FR18:** Idle calculations leverage timestamps and LocalStorage/state snapshots so progress can be reconstructed even without network access.  
- **FR19:** Players can accelerate idle progress via upgrades or temporary boosters earned from events.

### Economy, Tokens & Rewards
- **FR20:** EcoCoins accrue from missions, idle progress, and achievements, and are displayed in a persistent wallet UI.  
- **FR21:** Players can spend EcoCoins on upgrades, consumable boosts, or to unlock new sectors.  
- **FR22:** Impact tokens (distinct from EcoCoins) are granted for high-impact actions and can be redeemed for real ecological support, donations, or in-game currency.  
- **FR23:** Partner-branded rewards appear in the wallet with details on the sponsoring organization and redemption conditions.  
- **FR24:** The system logs every token transaction for transparency and future reporting.

### Partner & Impact Integrations
- **FR25:** Admins can configure ecological projects or NGO campaigns with metadata (description, required tokens, proof-of-impact links).  
- **FR26:** Partner campaigns can sponsor specific sectors or mini-games, surfacing their branding and reward multipliers.  
- **FR27:** A reporting dashboard aggregates total tokens directed to each partner and the number of “good actions” completed.  
- **FR28:** Players receive confirmation receipts after redeeming tokens for real-world actions, including shareable summaries.

### Social, Events & LiveOps
- **FR29:** Leaderboards track individual and squad performance across metrics (sectors cleaned, tokens donated, streaks).  
- **FR30:** Squad or regional challenges allow players to join teams and contribute toward shared cleanup goals.  
- **FR31:** Live events (e.g., Ocean Week, Smog Crisis) can be scheduled with unique missions, temporary modifiers, and themed rewards.  
- **FR32:** Global megamissions (vision phase) update world-state metrics in real time as entire communities contribute.

### AI Narrative & Guidance
- **FR33:** Each mission briefing is generated or personalized via Gemini, referencing the sector’s pollution data and player history.  
- **FR34:** Players can rate AI narratives, and feedback is captured for continuous tuning.  
- **FR35:** The AI system can suggest next-best sectors to tackle based on impact potential, player preferences, and partner objectives.

---

## Non-Functional Requirements

### Performance
1. Map rendering and UI transitions should maintain 60 FPS on modern desktop browsers and graceful degradation (≥30 FPS) on mid-tier laptops/tablets.  
2. Initial load (cold start) should stay under 5 seconds on a 20 Mbps connection; map tiles and mini-game assets are lazy-loaded by sector.  
3. Idle loop calculations must complete within 200 ms on return so reward summaries feel instant.

### Security
1. Store only non-sensitive player data locally (XP, sectors, tokens); no PII or payment data resides in the front end.  
2. Token transactions and partner reward logs must be tamper-resistant (signed payloads or backend verification).  
3. Integrate with secure APIs (HTTPS, authenticated endpoints) for Google Maps, Gemini, and future pollution feeds.

### Scalability
1. Architecture must support expanding to thousands of sectors without degrading map performance (virtualization, clustering).  
2. Idle/job processing should handle concurrent players by scheduling updates client-side and reconciling with lightweight backend checkpoints.  
3. Partner reward integrations should use configurable adapters so new NGOs/brands can be added without redeploying core code.

### Accessibility
1. Meet WCAG 2.1 AA for color contrast and keyboard navigation across all interactive panels.  
2. Provide subtitles/text alternatives for AI-generated narratives and audio cues.  
3. Offer reduced-motion mode to accommodate users sensitive to animations while still conveying sector transformations.

### Integration
1. Google Maps JS API supplies geospatial layers; fallback tiles must reuse the same sector data structures.  
2. Gemini API handles narrative generation; requests include pollution metadata and must respect rate limits/quota.  
3. Future pollution data feeds (WHO, Sentinel) and partner CRM/CSR systems connect through the services layer with retry/backoff logic.

---

_This PRD captures the essence of EcoShift – a browser-first, Google Maps-powered cleanup platform where players witness instant transformation, drive real ecological impact, and unlock brand-backed rewards for every good action._

_Created through collaborative discovery between Vlad and AI facilitator._

