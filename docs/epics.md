## EcoShift - Epic Breakdown

**Author:** Vlad  
**Date:** 2025-11-21  
**Project Level:** Web App MVP (Low Complexity)  
**Target Scale:** Browser-first global launch

---

## Overview

This document transforms the EcoShift PRD into actionable epics and bite-sized stories that Phase 4 implementation teams can execute without further decomposition.

**Living Document Notice:** This is the initial version. Future UX Design and Architecture workflows will inject deeper interaction details and technical decisions, and this file will be updated accordingly.

---

## Workflow Mode

🆕 **INITIAL CREATION MODE**

No existing `epics.md` was found, so this workflow run will create the first complete epic breakdown for EcoShift from the current PRD.

---

## Available Context

**Available Inputs**

- ✅ PRD (`docs/prd.md`) — primary source for scope, FRs, and success criteria  
- ✅ Current React/Vite UI (`ecoshift-global-protocol/`) — treat existing app screens/components as the working UX flow reference  
- ⚪ Architecture spec — not yet produced; future runs can add technical decisions and APIs  
- ⚪ Domain/Product briefs — not available; PRD already encapsulates the latest intent

---

## Functional Requirements Inventory

FR1. Global Google Maps canvas with pollution sectors, metadata overlays.  
FR2. Mission panel opens with AI narrative, stats, action buttons.  
FR3. Sector recoloring states (polluted, recovering, clean) based on progress.  
FR4. Map filtering by pollution type, difficulty, partner campaign tags.  
FR5. Offline-safe fallback grid when Google Maps unavailable.  
FR6. Launch at least one 30-second aerial/merge mini-game awarding XP & EcoCoins.  
FR7. Unlockable additional mini-game templates mapped to pollution types.  
FR8. Real-time transformation animation after each mini-game.  
FR9. Mission performance tracking surfaced in rewards modal.  
FR10. Pause/exit mini-game with graceful state handling.  
FR11. Persistent player profile with XP leveling and titles.  
FR12. Achievements/badges for key milestones.  
FR13. Post-MVP skill trees/upgrade branches.  
FR14. Hangar UI listing upgrades (costs, stats, level caps).  
FR15. Upgrades immediately adjust stats and reflect in gameplay.  
FR16. Idle cleanup state per sector continues after missions.  
FR17. Idle return summary overlay with cleaned units/tokens/sectors.  
FR18. Idle calculations using timestamps and LocalStorage snapshots.  
FR19. Idle acceleration via upgrades or temporary boosters.  
FR20. EcoCoins wallet accruing from missions, idle, achievements.  
FR21. Spend EcoCoins on upgrades, boosts, sector unlocks.  
FR22. Impact tokens for high-impact actions redeemable for ecological support.  
FR23. Partner-branded rewards in wallet with sponsor details.  
FR24. Token transaction logging for transparency/reporting.  
FR25. Admin-configurable ecological projects/NGO campaigns with metadata.  
FR26. Partner campaigns can sponsor sectors/mini-games with branding/rewards.  
FR27. Reporting dashboard aggregating partner impact metrics.  
FR28. Redemption receipts with shareable summaries.  
FR29. Leaderboards for individual/squad metrics.  
FR30. Squad/regional challenges with shared goals.  
FR31. Schedulable live events with unique missions/modifiers/rewards.  
FR32. Global megamissions updating world state in real time (vision).  
FR33. Gemini-generated mission briefings personalized per sector/player.  
FR34. Player feedback loop for AI narrative quality.  
FR35. AI recommends next-best sectors based on impact, preferences, partners.

---

## Epic Structure Proposal

1. **Epic 1 – Atlas Command & Sector Intelligence**  
   Deliver the live Google Maps battle board plus fallback grid, sector overlays, AI briefings, and UX shell so players can explore hotspots and launch missions from the existing React flows. (FR1–FR5, FR33)

2. **Epic 2 – Instant Cleanup Missions**  
   Implement the 30-second mini-game loop, transformation animation, rewards modal, and mission lifecycle hooks so players experience the “polluted → healed” payoff the UX already sketches. (FR6–FR10, FR8–FR9 reuse Hangar UI assets)

3. **Epic 3 – Progression, Idle Loop & Hangar Upgrades**  
   Persist player profiles, XP titles, idle cleanup math, and the upgrade shop using the current panel components, ensuring every return session surfaces momentum. (FR11–FR21)

4. **Epic 4 – Impact Economy & Partner Rewards**  
   Stand up EcoCoins/Impact tokens, partner-configurable projects, reporting dashboards, and branded rewards UI so ecological impact is quantifiable and sponsor-friendly. (FR22–FR28, FR25–FR27)

5. **Epic 5 – Collective Momentum & LiveOps Guidance**  
   Layer in leaderboards, squads, live events, megamissions, and the AI guidance loop that recommends next targets and captures narrative feedback for ongoing engagement. (FR29–FR35)

Each epic delivers a player-facing milestone aligned with the current React/Vite UX: map first, missions second, retention systems third, monetizable impact fourth, and social/AI liveops last.

---

## FR Coverage Map

| Epic | Functional Requirements Covered |
| --- | --- |
| Epic 1 – Atlas Command & Sector Intelligence | FR1, FR2, FR3, FR4, FR5, FR33 |
| Epic 2 – Instant Cleanup Missions | FR6, FR7, FR8, FR9, FR10 |
| Epic 3 – Progression, Idle Loop & Hangar Upgrades | FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR20, FR21 |
| Epic 4 – Impact Economy & Partner Rewards | FR22, FR23, FR24, FR25, FR26, FR27, FR28 |
| Epic 5 – Collective Momentum & LiveOps Guidance | FR29, FR30, FR31, FR32, FR34, FR35 |

All FRs from the inventory are mapped; vision-scale FR32 intentionally lands in Epic 5 for future-ready planning while keeping earlier epics MVP-focused.

---

## Epic 1: Atlas Command & Sector Intelligence

Deliver the live pollution atlas experience: Google Maps canvas (with Tiles API quota guard), clickable sectors, AI narrative mission panels, and UX-safe fallbacks so players can explore and launch missions directly from the current React flows.

### Story 1.1: Mission Control Foundation & Maps Bootstrap
As a returning EcoShift engineer,  
I want the Vite/React shell wired with Google Maps JS plus a fallback grid scaffold,  
So that the atlas view loads reliably before we layer sector data.

**Acceptance Criteria**
- **Given** the app loads via `index.tsx`  
  **When** the player opens the Atlas tab  
  **Then** the Google Maps canvas mounts with placeholder tiles and reserves the existing `CityMap` layout zones.
- **Given** Google Maps quota or script load fails  
  **When** the error is detected  
  **Then** the fallback grid view renders with neutral styling, matching the UX panel spacing.

**Prerequisites:** none  
**Technical Notes:** Add Maps API loader, env key plumbing, and grid fallback component under `components/MapFallback.tsx`. Preserve theming from `App.tsx`.

### Story 1.2: Sector Data Model & Overlay Rendering
As a player scanning the globe,  
I want sectors visualized with toxicity badges, status icons, and hover states,  
So that I can instantly find hotspots that match my goals.

**Acceptance Criteria**
- **Given** sector seed data (mocked in `constants.ts`)  
  **When** the map loads  
  **Then** clusters/markers render with pollution type glyphs and level badges per UX spec.
- **Given** I hover or tap a marker  
  **When** the sector is selected  
  **Then** the overlay highlights, tooltips show summary stats, and URL state updates for shareability.

**Prerequisites:** Story 1.1  
**Technical Notes:** Extend `types.ts` with `SectorState`, drive overlays via Google Maps Data layer; use existing `components/SectorBadge`. Ensure 60 FPS by throttling re-renders.

### Story 1.3: Mission Panel & AI Briefing Slot
As a player choosing a hotspot,  
I want a mission panel to slide in with AI narrative, stats, and the Start Cleanup CTA,  
So that I understand context before launching a mission.

**Acceptance Criteria**
- **Given** a sector is selected  
  **When** the panel opens  
  **Then** it shows pollution metadata, idle status, XP rewards, and a placeholder AI paragraph sourced via `geminiService.ts` mock.
- **Given** `geminiService` is unavailable  
  **When** the panel opens  
  **Then** a cached narrative or “briefing pending” state displays without blocking the CTA.

**Prerequisites:** Stories 1.1, 1.2  
**Technical Notes:** Reuse `components/MissionPanel`, add hook for async AI call with loading shimmer. Cache responses per sector ID in LocalStorage.

### Story 1.4: Sector State Transitions & Visual Feedback
As a player finishing missions,  
I want sectors to morph from polluted → recovering → clean on the map,  
So that I see instant impact.

**Acceptance Criteria**
- **Given** a mission completes (mocked event)  
  **When** the sector state changes  
  **Then** the marker color, glow, and badge update within 500 ms, mirroring animation cues from `App.tsx`.
- **Given** I revisit the map later  
  **When** state is restored from storage  
  **Then** the same visuals reflect the persisted status.

**Prerequisites:** Stories 1.2, 1.3  
**Technical Notes:** Create `useSectorState` hook with LocalStorage persistence, tie into `CityMap` CSS transitions, plan for future idle updates.

### Story 1.5: Filters, Campaign Tags & Grid Fallback Polish
As an eco-strategist,  
I want filters for pollution type, difficulty, and campaign tags plus a polished grid fallback,  
So that I can focus on relevant missions even when Maps is offline.

**Acceptance Criteria**
- **Given** the filter bar is visible  
  **When** I toggle pollution types or sponsor tags  
  **Then** the map (or fallback grid) immediately scopes sectors and the panel updates counts.
- **Given** the grid fallback is active  
  **When** filters change  
  **Then** card-based sectors reflow responsively and maintain status colors.

**Prerequisites:** Stories 1.2, 1.4  
**Technical Notes:** Implement filter state in context, drive both map overlays and fallback list. Tag data pulled from `constants.ts`. Ensure keyboard navigation and ARIA labels per UX flow.

**FRs Covered:** FR1, FR2, FR3, FR4, FR5, FR33

---

## FR Coverage Matrix

_Pending synthesis_

---

## Summary

_Pending final review_

---

_For implementation: Use the `create-story` workflow to turn each story into a detailed implementation plan once Architecture and UX specs are finalized._

