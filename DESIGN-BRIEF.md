# Endu RPG — Design Brief

**Audience:** Claude Design, or any designer picking up the v1 visual redesign.
**Purpose:** Give you everything needed to redesign the player-facing web UI ahead of the first public release without having to read the codebase.
**Companion docs (authoritative, don't duplicate):**

- [`GAME-DESING.md`](./GAME-DESING.md) — game mechanics, data model, phasing. Source of truth for what the app _does_.
- [`TODO-BACKLOG.md`](./TODO-BACKLOG.md) — current backlog and release priorities.

---

## 1. Product Vision

Endu RPG transforms real-world fitness into an RPG adventure. Every run, ride, swim, and workout earns experience, advances a character, and progresses a story. The design goal is to make exercise **intrinsically rewarding through RPG mechanics** — not just tracking numbers, but building a character, completing quests, and earning loot.

The game is **idle by nature**: it layers on top of physical activity the player already does. Log a run, check your progress, enjoy the dopamine. The experience should hook early with quick wins and frequent rewards, then sustain long-term through deeper progression systems that unfold gradually.

Design draws from classic RPG loops: **identity** (character class), **goals** (quests and achievements), **surprise** (loot drops), **progression** (levels, tiers, attributes), and **community** (leaderboards, future guilds).

## 2. Audience & Tone

- **Primary user:** active adults who already exercise 3+ times a week and use Strava. They don't need to be convinced to train — the product amplifies existing motivation.
- **Secondary user:** lapsed or intermittent exercisers who want gamified encouragement. The tone must not guilt-trip non-active days; rest and recovery are first-class parts of the game (see GDD §6).
- **Voice:** RPG-flavored but earnest. Think _Zelda trail sign_ over _Runescape joke_. Fantasy language is a flavor layer, not the whole identity. "Your streak is safe" beats "By the gods, thine flame yet burns!"
- **Mood:** grounded, aspirational, warm. Celebrates effort without being frat-bro intense. The player is on a journey, not a grind.

---

## 3. Current State of the UI

### 3.1 Tech foundations (extend, don't replace)

- **Framework:** Next.js 16 App Router, `output: 'export'` — **no SSR, no API routes, no middleware**. Everything client-side.
- **Styling:** Tailwind CSS v4, `cn()` utility from `@/lib/utils`.
- **Component library:** shadcn (radix-mira style, neutral base color). Located at `apps/web/src/components/ui/` — don't modify these directly; extend via wrapper components.
- **Icons:** `lucide-react`.
- **Toasts:** `sonner`.
- **Fonts:** Inter (sans) + Geist Mono. No custom heading font yet — introducing one is on the table.
- **Dark mode:** fully supported, toggle in navbar. Both modes are first-class — not an afterthought.
- **Animations:** Rive is on the roadmap for celebration moments (backlog `WEB-003`), not yet integrated. For now, CSS/Framer transitions.

### 3.2 Current design tokens (intentionally blank)

The existing CSS variables in [`apps/web/src/app/globals.css`](./apps/web/src/app/globals.css) are **monochrome neutrals** — every color channel has chroma 0, except `--destructive`. This is deliberate: the app is waiting for a designer to introduce brand color. **You have a blank canvas for color direction.**

What this means for you:

- Pick a primary brand hue (or system of hues) and define it in OKLCH for both light and dark modes.
- Define the **8 tier colors** (GDD §1.2: Grey/Green/Blue/Purple/Gold/Orange/Crimson/animated-for-Mythic) as a coherent palette — they need to feel like a progression, not random picks.
- Chart colors (`--chart-1` through `--chart-5`) currently map to shades of grey; replace with something readable in light + dark mode.
- Keep shadcn's variable structure intact (`--background`, `--foreground`, `--card`, `--primary`, etc.). Redefine values, not names.

### 3.3 Routes that exist today

All player-facing routes in the web app. Columns: status **Keep as-is / Redesign / Redesign from scratch**.

| Route                                  | Purpose                                                        | Data surfaced                                                                                                                                   | Redesign?                                                                    |
| -------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `/`                                    | Landing page: hero, feature overview, CTAs                     | static marketing copy                                                                                                                           | **Redesign** — first impression, needs to sell the vision                    |
| `/login` · `/signup`                   | Email/password auth                                            | —                                                                                                                                               | **Redesign** (light touch) — keep flow, elevate visual quality               |
| `/dashboard`                           | Primary hub: character summary, quick stats, recent activities | `level`, `tier`, `streakCount`, `currentLevelXP/nextLevelXP`, 4-stat grid (activity count, distance, time, elevation), 3 most recent activities | **Redesign** — this is the daily return screen, highest leverage             |
| `/character`                           | Full character profile: level, tier, XP bar, streak, stats     | `level`, `tier`, `currentLevelXP`, `totalXP`, `streakCount`, `longestStreak`, stats                                                             | **Redesign** — will expand to hold attributes, class, avatar, inventory, pet |
| `/activities`                          | Paginated infinite-scroll activity list                        | For each activity: name, date, type, distance, moving_time, total_elevation_gain, xpEarned, map polyline                                        | **Redesign** — density and mobile behavior both need work                    |
| _(new)_ `/activities/[id]`             | Activity detail with XP breakdown                              | base XP + elevation + bonuses + final XP, RPG flavor text                                                                                       | **Design from scratch** (backlog `WEB-002`)                                  |
| `/strava/connect` · `/strava/callback` | OAuth connect screen + callback                                | —                                                                                                                                               | **Keep** (light polish acceptable)                                           |
| `/settings`                            | Display name, Strava management, account deletion              | profile fields, Strava connection status                                                                                                        | **Redesign** (light touch) — will also host rest-day selector                |
| `/admin/*`                             | Admin dashboard (users, analytics, overview)                   | aggregate ops metrics                                                                                                                           | **Out of scope** — recently built, do not redesign                           |
| `/dev/simulator`                       | Dev toolbar for emulated activities                            | —                                                                                                                                               | **Out of scope** — internal tool                                             |

### 3.4 Global shell

- **Navbar:** [`apps/web/src/components/layout/navbar.tsx`](./apps/web/src/components/layout/navbar.tsx) — logo, primary nav (Dashboard · Activities · Character · Admin), user dropdown (Settings · Sign out), theme toggle. Mobile uses a sheet. **Redesign** — likely needs to add entry points for Quests / Achievements / Shop / Leaderboard (phase 4+ surfaces).
- **Auth guard:** `(app)/layout.tsx` — redirects unauthenticated users. The redirect target may change with onboarding (§4.1).
- **Existing celebration mount:** `LevelUpModal` renders inside `(app)/layout.tsx` so it triggers from any screen.

### 3.5 Existing custom game components (for reference, all will be redesigned)

| Component         | Path                                   | Notes                                             |
| ----------------- | -------------------------------------- | ------------------------------------------------- |
| `TierBadge`       | `components/game/tier-badge.tsx`       | Tier name + variant — needs per-tier color system |
| `XPBar`           | `components/game/xp-bar.tsx`           | Progress bar with % label                         |
| `StreakIndicator` | `components/game/streak-indicator.tsx` | Compact flame + count                             |
| `StreakDisplay`   | `components/game/streak-display.tsx`   | Expanded view with 7-day dot history              |
| `StatsGrid`       | `components/game/stats-grid.tsx`       | 4-column stat cards                               |
| `ActivityCard`    | `components/game/activity-card.tsx`    | Expandable card with route polyline               |
| `RoutePreview`    | `components/game/route-preview.tsx`    | Encoded-polyline mini map                         |
| `LevelUpModal`    | `components/game/level-up-modal.tsx`   | Existing celebration pattern — see §5             |

---

## 4. Screens to Design

### 4.1 Screens to redesign (exist today)

For each: assume current data fields must all still have a home. No fields should silently disappear.

- **Landing (`/`)** — the first impression. Should convey: (1) "gamify the training you already do", (2) connects to Strava, (3) earn XP, level up, build a character. Primary CTAs: sign up, log in. Secondary: a visual showcase of what progression looks like. Mobile-first.
- **Dashboard (`/dashboard`)** — the daily return screen. Must answer "what happened since I last looked?" at a glance. Emphasize progression moments (new XP, streak still alive, new quest) over raw stats. Recent activities are a supporting element, not the hero.
- **Character (`/character`)** — the identity screen. Today: level, tier, streak, basic stats. In v1 redesign it should be structured to later hold: class + specialization, avatar with equipped cosmetics, attribute radar, inventory, active pet. Design now with those slots reserved even if empty for MVP.
- **Activities list (`/activities`)** — scan-ability on mobile is weak today. Goal: quick visual distinction between activity types, XP earned prominent, polyline optional. Treat the list as a journey log, not a spreadsheet.
- **Settings (`/settings`)** — functional; needs to accommodate a new **rest-day selector** (1–2 weekdays, GDD §6). Keep minimal.
- **Auth pages (`/login`, `/signup`)** — currently card-over-blank. Bring in brand identity without adding friction.

### 4.2 Screens to design from scratch (don't exist yet)

Some of these belong to later GDD phases. Provide direction and a skeleton design even if we'll implement later — it prevents the v1 visual language from being incompatible with phase-3+ screens.

- **Onboarding flow** (`UX-001`, high priority) — new user lands post-signup. Steps: (1) product promise, (2) Strava connect, (3) what happens next (first activity → XP → level up). Must persist completion state. **Open design question:** does onboarding force an early class selection or defer it to Level 10 as GDD §1.1.1 prescribes? Recommend: defer — but acknowledge the "Novice" state visually.
- **Activity detail page** (`/activities/[id]`, `WEB-002`) — XP breakdown: base XP + elevation + class bonus + streak bonus + drops = final XP. Include short RPG flavor text. Route map expanded.
- **Class evolution screen** (Level 10) — major celebration moment. Presents 5 classes with auto-suggestion based on activity history, avatar preview for each, passive bonus description. Choice is permanent. This is a set-piece.
- **Specialization screen** (Level 30) — presents 2 specializations within the player's class. Similar treatment to class evolution, scaled to the player's growth.
- **Achievements page** — grid of earned + locked badges with progress. Collection feel. Filter by category (distance / elevation / streak / activity count / variety).
- **Quests page** — active daily/weekly/monthly quests with progress bars and RPG-flavored names. Split: personal quests vs community quests (visible split helps the social layer land).
- **Shop** — consumables grid (6 types, see GDD §5.2.1). Cosmetics tab reserved for phase 8.
- **Inventory** — consumable stacks + equipped cosmetics. Lives on the character page likely, but the design pattern needs definition.
- **Leaderboard** — global ranked by XP, top N + own position. Tier badges prominent. Tap row → public profile.
- **Public profile** — read-only version of character page. Used from leaderboard. Shows tier badge, class, level, avatar, attribute radar, achievement showcase, streak.
- **Pet page** (phase 8) — active pet, owned pets (max 3), incubating egg with distance progress bar.

---

## 5. Celebration Moments

Endu lives on celebration moments. They convert routine activity into payoff and are the most memorable UI in the app. Treat them as **set-pieces**, not modals.

| Moment                  | Status               | Source / notes                                                                                                                                                                                                                       |
| ----------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Level-up                | Exists               | [`level-up-modal.tsx`](./apps/web/src/components/game/level-up-modal.tsx) — uses shadcn `Dialog`, 🎉 emoji placeholder, tier blurb. Current pattern is _functional, not memorable_ — redesign as the reference for all celebrations. |
| Tier-up                 | Exists               | Same component — triggers on tier change with ⚔️ emoji. Should have a distinct visual treatment from level-up.                                                                                                                       |
| Class evolution (Lv10)  | **Missing**          | Major set-piece. Full-screen. Class choice UI + reveal animation.                                                                                                                                                                    |
| Specialization (Lv30)   | **Missing**          | Similar scale to class evolution.                                                                                                                                                                                                    |
| Achievement unlock      | **Missing**          | Toast + badge animation. Less disruptive than level-up.                                                                                                                                                                              |
| Chest-open (bonus drop) | **Missing**          | Post-activity. Chest opens → reward reveal. Moment of surprise (GDD §5.1).                                                                                                                                                           |
| Streak milestone        | **Exists partially** | 7/30/100-day thresholds fire as achievements. Worth a distinct visual treatment.                                                                                                                                                     |
| Well Rested bonus       | **Future**           | GDD §3.1.3, deferred. Warm toast acknowledgment.                                                                                                                                                                                     |

Design a **celebration system**, not one-off screens — a shared scaffolding (entrance, hero element, reward, exit) that variants (level-up / tier-up / evolution / chest) plug into.

---

## 6. Visual Asset Checklist

Extracted from GDD §13.3. This is what a full v1 redesign eventually requires — not all of it is needed for the first milestone, but knowing the full list early prevents visual inconsistency.

### 6.1 Core identity

- [ ] Brand color palette (primary + supporting, light + dark mode in OKLCH)
- [ ] Updated typography scale — possibly a distinctive heading face
- [ ] Redesigned app logo / wordmark

### 6.2 Tier badges (GDD §1.2) — **8 tiers + color palette**

Wanderer · Scout · Ranger · Warrior · Champion · Hero · Legend · Mythic. Mythic gets **animated treatment** (subtle, readable at small sizes). Badges appear in two sizes:

- Profile: full tier name visible
- Leaderboard / social: compact badge with color, level number implied by tier

### 6.3 Class avatars (GDD §1.1.2) — **5 base classes**

Strider (running) · Voyager (cycling) · Mountaineer (hiking) · Aquanaut (swimming) · Titan (strength). Each needs a distinct silhouette that reads on the character page, leaderboard row, and public profile. Gender-neutral / customizable on a later pass.

### 6.4 Specialization avatars (GDD §1.1.3) — **10 specializations**

Two per class: Marathoner/Sprinter · Road Racer/Trailblazer · Summit Chaser/Trekker · Open Water/Poolmaster · Powerlifter/Crossfitter. Visual evolution from base class — should feel like the same character, leveled up.

### 6.5 Cosmetic equipment (phase 8) — **5 slots**

Helmet · Armor · Boots · Weapon · Accessory. Initial catalog: 3–5 cosmetic variants per slot for v1. Layer cleanly on class/specialization silhouettes.

### 6.6 Pet species (GDD §9) — **TBD from content catalog**

Pet catalog is being authored in parallel in `content/pet-species.json`. For each species: **3 evolution stages**. Rarity tiers (Common / Uncommon / Rare / Legendary) should read visually — rarer pets feel rarer.

### 6.7 Animation / motion pieces

- Chest-open reveal (post-activity drop)
- Class evolution sequence (Lv10 reveal)
- Specialization sequence (Lv30 reveal)
- Achievement unlock notification
- Level-up + tier-up (redesigned)
- Streak milestone moment

---

## 7. Constraints & Invariants

- **Static export:** no SSR, no API routes, no middleware, no `headers()`/`cookies()` imports. All interactive pages are `'use client'`. Data fetching is Firebase callable functions (`httpsCallable` wrappers), never direct Firestore reads.
- **Mobile-first:** the majority of real use will be post-activity on phone. Every screen must land mobile before desktop. Minimum supported width: 360px.
- **Dark mode is first-class:** design every screen in both modes. No "dark mode as afterthought" contrast issues.
- **Accessibility:** WCAG AA contrast minimum. Color is never the only channel (tier badges combine color + name; class is indicated by color + icon + label).
- **Performance:** initial page weight matters. Prefer SVG/lucide for icons over raster. Rive animations only on celebration screens, not in idle UI.
- **Type source of truth:** player data types live in `@endu/shared/types`. Data shapes shown on screens are in §3.3. Don't invent new fields; if a design needs one, flag it explicitly.
- **Game mechanics are fixed:** mechanics in `GAME-DESING.md` are the spec. The redesign is visual/interactional, not a mechanics revamp. If a design needs a mechanics change, call it out as an open question, don't silently assume.

## 8. Out of Scope for v1 Redesign

These exist in the GDD's Future Design Space — explicitly **do not** design for them now:

- Guilds (creation, quests, raids, leaderboard)
- Friend system (add friends, friends leaderboard)
- Premium currency + monetization flows
- Weekly Recap (in-app + email) — GDD §10
- Seasonal / mini events
- 3rd Evolution (Mastery) — Level 50+ prestige tier
- Secondary class
- Leaderboard filters (time period, class, tier)
- Attribute milestones (GDD §1.3.1)

Reserving space for future features in layout is fine; designing them now is not.

---

## 9. Open Design Questions

Flag a recommendation with each — we want your opinion, not a blank "what should we do?".

1. **Onboarding timing of class selection.** Recommendation: defer to Level 10 as GDD specifies. But the "Novice" identity on the character page needs visual treatment that doesn't feel empty for the first 2 months.
2. **Mythic tier animation.** Animated badge at small sizes risks being distracting or performance-heavy. Find a treatment that reads as animated without being a GIF-at-everyone.
3. **Attribute radar chart on mobile.** A 4-point radar on 360px is tight. Alternative treatments (horizontal bars, ring segments, barbell) are on the table.
4. **Chest-open on the post-activity screen.** Currently no post-activity summary screen exists — the drop happens but there's nowhere natural to reveal it. Does the redesign introduce a post-activity screen, or does the drop inline into the dashboard on next visit?
5. **Community vs personal quests visual split.** GDD §4.1.2 frames them as two tracks. Design question: same list with tags, or two distinct sections?
6. **Tier color vs class color.** Both systems want to own "what color is this player". Propose a hierarchy: does tier dominate the visual, does class, or do they coexist (e.g., tier = border, class = fill)?

---

## 10. Hand-off Expectations

- **Deliverables preferred, in order:** (1) color + typography system, (2) dashboard + character screen redesigns, (3) tier badges (all 8), (4) celebration system scaffolding + redesigned level-up, (5) class avatars, (6) remaining screens, (7) specialization avatars + cosmetics.
- **Format:** whatever you ship in is fine (Figma, images, Rive, etc.). The implementation is Tailwind + shadcn, so thinking in utility-first terms and component boundaries makes handoff easier.
- **Iteration:** tier 1 deliverables (color, typography, dashboard, character) get the most iteration rounds. Downstream deliverables (cosmetics catalog, pet species) ship closer to final.
- **Parallel work:** while you design, the engineering track is filling out content catalogs (`content/*.json`), architecture docs, and ops hygiene — so the redesigned UI will have real data to consume on landing.
