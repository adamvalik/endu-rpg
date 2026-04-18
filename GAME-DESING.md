# Endu RPG — Game Design Document

## Vision

Endu RPG transforms real-world fitness into an RPG adventure. Every run, ride, swim, and workout earns experience, advances your character, and progresses a story. The goal is to make exercise intrinsically rewarding through RPG mechanics — not just tracking numbers, but building a character, completing quests, and earning loot.

The game is designed to be **idle by nature**. Players don't need to grind or dedicate extra time — the game layers on top of the physical activity they already do. Log a run, check your progress, enjoy the dopamine. The experience should hook early with quick wins and frequent rewards, then sustain long-term through deeper progression systems that unfold gradually. Because the core activity (exercise) is self-sustaining for active people, the game doesn't need to manufacture engagement — it amplifies motivation that already exists.

The design draws heavily from classic RPG loops: **identity** (character class), **goals** (quests and achievements), **surprise** (loot drops), **progression** (levels, tiers, attributes), and **community** (guilds and leaderboards).

---

## 1. Character System

### 1.1 Character Classes & Evolution

Every player starts as a **Novice** with no class bonus. Classes are earned through progression, not chosen at onboarding. This gives new players time to establish their activity patterns before committing to an identity.

#### 1.1.1 Class Evolution Path

| Evolution         | Trigger  | What Happens                                          |
| ----------------- | -------- | ----------------------------------------------------- |
| **Novice**        | Start    | No class, no bonus — the player is finding their path |
| **1st Evolution** | Level 10 | Choose a Base Class — unlocks class passive bonus     |
| **2nd Evolution** | Level 30 | Choose a Specialization within the class              |

#### 1.1.2 Base Classes

| Class           | Focus               | Passive Bonus                               |
| --------------- | ------------------- | ------------------------------------------- |
| **Strider**     | Running             | +XP from running activities                 |
| **Voyager**     | Cycling             | +XP from cycling activities                 |
| **Mountaineer** | Hiking / Elevation  | +XP from walking + elevated elevation bonus |
| **Aquanaut**    | Swimming            | +XP from swimming activities                |
| **Titan**       | Strength / Workouts | +XP from workout and strength activities    |

- Auto-suggested based on activity history at Level 10, or manually chosen
- This choice is permanent
- Each class has a distinct avatar/icon used across the app

#### 1.1.3 Specializations

At Level 30, players choose a Specialization within their class, granting an additional XP bonus for a specific sub-type of their activity.

| Base Class      | Specialization A                                    | Specialization B                        |
| --------------- | --------------------------------------------------- | --------------------------------------- |
| **Strider**     | Marathoner (bonus for long runs)                    | Sprinter (bonus for high pace)          |
| **Voyager**     | Road Racer (bonus for flat speed)                   | Trailblazer (bonus for MTB elevation)   |
| **Mountaineer** | Summit Chaser (bonus for single-activity elevation) | Trekker (bonus for long hikes)          |
| **Aquanaut**    | Open Water (bonus for distance swims)               | Poolmaster (bonus for swim frequency)   |
| **Titan**       | Powerlifter (bonus for strength sessions)           | Crossfitter (bonus for varied workouts) |

- Evolution moments are major celebration events with unique visuals
- Each specialization has a distinct avatar/icon

#### 1.1.4 Future Design Space: 3rd Evolution & Secondary Class

- **3rd Evolution (Mastery):** A prestige-tier identity at Level 50+ that further refines the specialization, potentially with titles generated from the player's actual stats and records
- **Secondary Class:** High-level players could unlock a secondary class passive at a reduced rate by meeting activity thresholds in another discipline, rewarding versatility without undermining primary identity

### 1.2 Tiers

Tiers represent major character milestones. Each tier-up is a celebration moment with unique visuals. Tiers provide at-a-glance recognition of a player's progression level across the app.

| Tier         | Level Range | Fantasy Flavor                                | Color    |
| ------------ | ----------- | --------------------------------------------- | -------- |
| **Wanderer** | 1–4         | A traveler setting out on their first journey | Grey     |
| **Scout**    | 5–9         | Learning the ways of the wild                 | Green    |
| **Ranger**   | 10–19       | A seasoned explorer of trails and roads       | Blue     |
| **Warrior**  | 20–29       | Proven through sweat and endurance            | Purple   |
| **Champion** | 30–39       | Known throughout the realm for their feats    | Gold     |
| **Hero**     | 40–49       | Inspires others to take up the path           | Orange   |
| **Legend**   | 50–64       | Their name echoes across the land             | Crimson  |
| **Mythic**   | 65+         | Transcended mortal limits                     | Animated |

#### 1.2.1 Visual Treatment

- **Profile page:** Full tier name displayed (e.g., "Champion"), tier color applied to profile border/frame
- **Leaderboards & social contexts:** Compact tier badge with color — communicates approximate level at a glance without showing the exact number, making different players visually distinguishable
- **Tier-up moment:** Celebration modal with the new tier name, badge, and color transition

Each tier-up unlocks a visual badge, a new title, and access to tier-specific quests. Quest difficulty and requirements scale with tier to ensure challenges remain appropriate and motivating at every progression stage.

### 1.3 Attributes

Four core stats that grow automatically based on _how_ you exercise, creating a unique build per player. Attributes are never manually allocated — they are a direct reflection of your training.

| Attribute     | Grows From                                    | What It Represents             |
| ------------- | --------------------------------------------- | ------------------------------ |
| **Endurance** | Long-duration activities (>45 min)            | Stamina and staying power      |
| **Speed**     | High-pace activities (above personal average) | Quickness and agility          |
| **Strength**  | Elevation gain + strength workouts            | Raw power and climbing ability |
| **Vitality**  | Consistency (streaks, weekly activity count)  | Health and resilience          |

- Each attribute has its own level (1–100) with a separate XP pool
- Displayed as a radar/spider chart on the character page
- Creates visual "character builds" unique to each player

#### 1.3.1 Future Design Space: Attribute Milestones

Reaching attribute level thresholds (e.g., 10, 25, 50) unlocks rewards. Rewards are varied to avoid over-relying on XP bonuses:

- **Cosmetic rewards:** Unique titles, avatar accessories, border effects tied to the attribute
- **Gold rewards:** One-time gold payouts or small passive gold-find bonuses
- **Gameplay unlocks:** Access to specific quests, boss challenges, or zones requiring a minimum attribute level
- **Quality-of-life perks:** Extra grace days, streak protections, rest day bonuses
- **XP bonuses:** Used sparingly — at most one per attribute tree

Specific milestone rewards to be defined during balancing. The goal is that each attribute feels like its own mini-progression with meaningful payoffs, without stacking XP multipliers.

---

## 2. Progression Systems Overview

The game tracks several progression values. Each serves a distinct role in the player experience. Specific earning rates and spending details are defined in their respective sections.

| System         | Type           | Purpose                                                                                                 |
| -------------- | -------------- | ------------------------------------------------------------------------------------------------------- |
| **XP**         | Accumulated    | Drives leveling and tier advancement — never spent, only earned                                         |
| **Gold**       | Earned & spent | Spent in the Item Shop on consumables and cosmetics                                                     |
| **Attributes** | Automatic      | Four stats (Endurance, Speed, Strength, Vitality) that grow from activity patterns — not player-managed |

### 2.1 Future Design Space: Premium Currency

- **Premium Currency:** A real-money currency for cosmetic-only purchases. Must never affect XP gain, attribute growth, or any gameplay advantage — strictly visual customization (skins, borders, effects). The core progression experience remains fully free.

---

## 3. Progression

### 3.1 Experience Points (XP)

XP is the core currency of progression. Every activity earns XP based on type, distance/time, and bonuses.

#### 3.1.1 Base XP Rates

**Distance-based activities:**

| Activity         | XP per km | Notes                                |
| ---------------- | --------- | ------------------------------------ |
| Running          | 100       | Includes trail running, virtual runs |
| Walking / Hiking | 50        |                                      |
| XC Skiing        | 50        | Nordic, backcountry                  |
| Downhill Skiing  | 25        | Alpine, snowboard                    |
| Cycling          | 25        | Road, MTB, e-bike, virtual           |
| Swimming         | 500       | High effort per km                   |

**Time-based activities (when no meaningful distance):**

| Activity            | XP per min | Notes                                                            |
| ------------------- | ---------- | ---------------------------------------------------------------- |
| Workouts / Strength | 10         | WeightTraining, Crossfit, RockClimbing, StairStepper, Elliptical |
| Yoga                | 5          | Low intensity                                                    |

**Universal bonuses:**

| Bonus       | Value          | Condition                        |
| ----------- | -------------- | -------------------------------- |
| Elevation   | 2 XP per meter | Applies to all activities        |
| Daily login | +50 XP         | First activity of the day        |
| Class bonus | +15%           | Activity matches character class |

#### 3.1.2 Anti-Cheat

Maximum speed thresholds per activity type. Activities exceeding these speeds are flagged and earn 0 XP.

| Rule               | Value   |
| ------------------ | ------- |
| Max running speed  | 25 km/h |
| Max cycling speed  | 80 km/h |
| Max swimming speed | 8 km/h  |
| Max walking speed  | 12 km/h |
| Max XC ski speed   | 35 km/h |

- Flagged activities are logged with a warning for review
- Speed is calculated as average speed over the activity — short GPS spikes are tolerated

#### 3.1.3 Future Design Space: Well Rested Bonus

If a player logs no activity for 2+ consecutive days, their next completed activity triggers a one-time **Well Rested Bonus**:

- Small flat XP bonus on the first activity back
- Accompanied by a "Well Rested! You gained a small XP bonus" warm acknowledgment message (toast notification)
- Does not accumulate — the bonus is the same whether the break was 2 days or 2 weeks
- Purpose is emotional (reduce return anxiety) rather than mechanical (catch-up progression)

### 3.2 Leveling

**Formula:** `XP_required(L) = 100 * L^2 + 300 * L`

| Level | Total XP Required | Approx. Time (active user) |
| ----- | ----------------- | -------------------------- |
| 2     | 700               | ~1 week                    |
| 5     | 4,000             | ~3 weeks                   |
| 10    | 13,000            | ~2 months                  |
| 25    | 70,000            | ~6 months                  |
| 50    | 265,000           | ~2 years                   |

- Approximate times will be recalculated during balancing once XP rates are finalized

#### 3.2.1 Level-Up Rewards

Each level-up triggers:

- Celebration modal with new level number and animation
- Tier-up announcement (if applicable)
- A reward chest containing Gold and/or random items (amounts scale with level — details in balancing)

### 3.3 Streak System

Streaks reward consistency without punishing life.

#### 3.3.1 Core Rules

- Activity on consecutive days increments the streak
- Same-day activities maintain (don't increment) the streak
- Missing a day consumes a **grace day** if available; otherwise streak decays (decay amount TBD in balancing)

#### 3.3.2 Grace Days

- Grace days are the primary streak protection mechanic — earned through consistency, they absorb missed days before the streak breaks
- Earned through consecutive active days (rate TBD in balancing)
- Maximum stored grace days capped (cap TBD in balancing)
- Grace days are consumed automatically on missed days
- Generous enough to cover rest days and minor disruptions, but not long absences — the streak should feel earned

#### 3.3.3 Late Sync / Offline Activities

Streak calculation is based on the **activity date from the source data** (e.g., GPS timestamp from Strava), not the date the activity was synced or uploaded. This ensures:

- Athletes training without internet (mountain, backcountry, open water) are not penalized
- When activities sync late, the streak is retroactively recalculated, so streak is calculated on sync
- Grace days that were auto-consumed during the offline period are restored if the gap is filled by late-syncing activities
- Any streak decay that occurred is reversed if retroactive data fills the missed days

#### 3.3.4 Streak Rewards

- Active streaks grant a scaling bonus (type and values TBD in balancing — could be XP multiplier, Gold find, loot chance, or a combination)
- Streak milestones (7 days, 30 days, 100 days, etc.) are handled in the Achievements system (Section 4) with corresponding badges

---

## 4. Quests & Achievements

### 4.1 Quests

Quests provide structured short and mid-term goals that refresh on a regular cadence. They are generated from a template pool and assigned automatically. All quests are presented with RPG-themed names and flavor text to reinforce the adventure narrative.

#### 4.1.1 Quest Cadence

| Type        | Generated     | Count | Scope                          | Expiry  |
| ----------- | ------------- | ----- | ------------------------------ | ------- |
| **Daily**   | Midnight      | 2–3   | Completable in a single day    | Daily   |
| **Weekly**  | Monday        | 2–3   | Cumulative progress over week  | Weekly  |
| **Monthly** | First of month| 1     | Sustained effort over weeks    | Monthly |

#### 4.1.2 Quest Types

Quests are divided into two tracks:

**Community Quests:** The same quest assigned to all players simultaneously. Designed to be activity-agnostic and fair across all classes (e.g., time-based, activity count, elevation). Creates shared social context — players can complete these together, compare progress, and discuss them. Community quests appear on leaderboards and social features.

**Personal Quests:** Tailored to the individual player's class, tier, and activity history. RPG-themed with narrative flavor. These drive individual progression and class identity.

Both tracks follow the daily/weekly/monthly cadence. A player might see 2 personal daily quests and 1 community daily quest, for example. Exact split TBD in balancing.

#### 4.1.3 Personal Quest Assignment Logic

- **Novice players (pre-class):** Generic quests applicable to any activity type
- **Classed players:** Quests favor the player's class activity, with occasional variety quests mixed in
- Quest difficulty scales with the player's tier
- Rewards: XP and/or Gold (amounts TBD in balancing)

#### 4.1.4 Quest Template Design (to be expanded)

- Templates combine an RPG-flavored title, a short narrative description, and a mechanical condition
- Example: *"Flee the Shadow Wolf"* — "The beast is on your trail. Only speed will save you." — Run 5 km
- Template pool, class-specific variants, and creative quests to be designed in a dedicated quest design pass

### 4.2 Achievements

Permanent badges earned by reaching milestones. Checked automatically after every activity. Achievements come in two types:

#### 4.2.1 Single-Effort Achievements

One-time feats accomplished in a single activity:

- Run a marathon (42.2 km)
- Swim 5 km in a single session
- Gain 1,000m elevation in a single activity
- Set a new personal record

#### 4.2.2 Cumulative Achievements

Long-term milestones tracked across all activities:

- Distance: Run 1,000 km total, Cycle 5,000 km total, etc.
- Elevation: Gain 10,000m total, 100,000m total, etc.
- Consistency: 7-day streak, 30-day streak, 100-day streak, etc.
- Activity count: 10, 50, 100, 500 total activities
- Variety: Log 3, 6 different activity types

#### 4.2.3 Achievement Rewards

- Permanent badge visible on the character page
- One-time XP and/or Gold bonus (scaling with difficulty — TBD in balancing)
- Some achievements unlock exclusive cosmetic items
- Collection progress visible on a dedicated achievements page

Specific achievements, thresholds, and rewards to be defined in balancing.

---

## 5. Loot, Shop & Inventory

### 5.1 Bonus Drops

After each activity, there is a chance of a bonus drop. Drops are revealed with a chest-opening animation, creating a moment of surprise.

#### 5.1.1 Drop Types

- **XP Shards:** Small bonus XP
- **Gold Pouches:** Bonus Gold
- **Consumable Items:** Random consumable item (see 5.3)
- **Cosmetic Items:** Rare visual gear drops
- **Pet Eggs:** Very rare — see Pet System

- Drop chance, rarity tiers, and loot tables TBD in balancing
- Maximum drop rolls per day may be capped to prevent farming (limit to first activity per day)
- Drop chance can be influenced by consumables or pet buffs

### 5.2 Item Shop

A static shop where players spend Gold. All items are always available.

#### 5.2.1 Consumables

Temporary buff items purchased with Gold. Each type serves a distinct gameplay purpose:

| Type                | Effect                                                              | Category        |
| ------------------- | ------------------------------------------------------------------- | --------------- |
| **Streak Shield**   | Prevents one streak reset on a missed day (auto-consumed)           | Streak protection |
| **XP Boost**        | Multiplied XP on next activity                                      | XP enhancement  |
| **Gold Boost**      | Multiplied Gold earned on next activity                             | Gold enhancement |
| **Lucky Charm**     | Increased bonus drop chance on next activity                        | Loot enhancement |
| **Endurance Elixir**| Bonus XP for activities over a duration threshold (e.g., >60 min)   | Attribute-adjacent |
| **Trailblazer Map** | Bonus XP for elevation gain on next activity                        | Attribute-adjacent |

- These are the functional categories — RPG-flavored names are final
- Some consumables are also obtainable through drops, providing alternative acquisition
- Prices and exact effects TBD in balancing

#### 5.2.2 Cosmetics

Visual gear with no gameplay effect:

- Equipment slots: Helmet, Armor, Boots, Weapon, Accessory
- All cosmetics always available in the shop — no rotation
- Additional acquisition sources: achievement rewards, seasonal events, boss defeats, rare drops
- Exclusive cosmetics tied to achievements or events are never sold in the shop
- Prices TBD in balancing

#### 5.2.3 Future Design Space

- **Premium Currency:** Real-money currency for cosmetic-only purchases — never affects gameplay
- **Shop Rotation:** Featured or discounted items on a weekly cycle to drive engagement

### 5.3 Inventory

Displayed on the character page. Holds all player-owned items with limited capacity.

#### 5.3.1 Consumables

- Each consumable type has a max stack limit (TBD in balancing)
- Items can be activated manually before an activity
- Streak Shields auto-consume when needed
- Inventory limit encourages spending rather than hoarding

#### 5.3.2 Cosmetics

- All owned cosmetic gear organized by equipment slot
- Equip/unequip to customize avatar appearance
- Indicates acquisition source (shop, achievement, event, drop)
- No limit on cosmetic storage — collections should feel rewarding to grow

---

## 6. Rest & Recovery

Players can designate rest days in their settings to align the game with healthy training habits.

- Players choose 1–2 fixed rest days per week (e.g., Sunday) — default: none
- On a designated rest day, if no activity is logged, the streak is maintained — no grace day consumed, no decay
- Rest days reframe recovery as part of the game, not a failure state
- If the player does log an activity on a rest day, it counts as a normal active day with full rewards

---

## 7. Social Features

### 7.1 Leaderboards

A global leaderboard ranked by total XP. All players compete on the same board.

- Shows top players and the current player's own rank
- Tapping a player opens their public profile

#### 7.1.1 Future Design Space

- Filterable by: time period (weekly, monthly, all-time), class, tier
- Additional boards ranked by other metrics (distance, streak, level)
- Friends leaderboard

### 7.2 Public Profiles

Each player has a public profile visible to other players through the leaderboard. Profiles showcase the player's character identity and progression at a glance.

#### 7.2.1 Profile Contents

- Player name and tier badge with tier color border
- Character class and specialization (or "Novice" if pre-class)
- Level
- Avatar with equipped cosmetic gear
- Attributes radar chart
- Achievement showcase (selected highlights or total count)
- Current streak length

- Profiles are read-only
- Players cannot hide their profile from the leaderboard

#### 7.2.2 Future Design Space: Friend System
Add friends, friends leaderboard, compare profiles side by side

---

## 8. Visual Customization

Players build a unique avatar identity by equipping cosmetic gear across five equipment slots. The avatar is visible on the character page, leaderboard, and public profile.

### 8.1 Equipment Slots

- Helmet
- Armor / Chest
- Boots
- Weapon (cosmetic only)
- Accessory (cape, aura, etc.)

### 8.2 Customization Rules

- Gear is purely cosmetic — no gameplay stats
- Players can equip/unequip freely from owned items
- Default appearance for each slot when nothing is equipped
- Class and specialization determine the base avatar silhouette; cosmetics layer on top
- Tier color border (see Section 1.2) frames the avatar

---

## 9. Pet System

A companion system inspired by virtual pets and creature collection. Pets are rare, collectible companions that provide passive buffs and evolve visually over time.

### 9.1 Acquiring a Pet

1. **Egg Drop:** Mystery Eggs are a rare bonus drop after activities
2. **Incubation:** Walk/run a required distance to hatch the egg (distance TBD in balancing)
3. **Hatching:** The species that hatches is random, with rarity tiers affecting probability

### 9.2 Pet Traits

- Each pet species has a unique passive buff (e.g., Gold find, elevation XP, streak protection)
- Pets come in rarity tiers: Common, Uncommon, Rare, Legendary
- Rarer pets have stronger or more unique buffs
- Specific species, buffs, and rarity rates TBD in balancing

### 9.3 Pet Progression

- Pets gain XP passively from the player's activities
- At milestones, pets evolve visually through 3 stages
- Evolution is purely cosmetic progression — the buff stays the same, the pet just looks cooler
- A fully evolved Legendary pet is a major status symbol on the public profile

### 9.4 Pet Management

- Maximum 3 pets owned, 1 active at a time
- Active pet's buff applies to all activities
- Active pet is displayed on the character page and public profile
- Inactive pets retain their XP and evolution stage

---

## 10. Future Design Space: Weekly Recap

### 10.1 Summary Content

Generated weekly (Sunday evening) via scheduled function. Delivered in-app and optionally via email (Resend).

**Includes:**

- Total XP earned this week
- Level progress (X% toward next level)
- Activities completed (count + breakdown by type)
- Distance traveled ("leagues" in RPG language)
- Elevation gained ("mountains conquered")
- Streak status
- Quests completed
- Achievements unlocked
- Comparison to previous week (up/down arrows)
- Motivational RPG-flavored message

---

## 11. Data Model

This section defines the persistent shape of a player's game state. It reflects only systems specified in sections 1–10; future design space features are intentionally excluded until promoted to core design.

### 11.1 GameProfile

```typescript
interface GameProfile {
  // Core progression (Section 3)
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  tier: CharacterTier;

  // Economy (Section 2)
  gold: number;

  // Identity (Section 1.1)
  characterClass: CharacterClass | null; // null = Novice (pre-1st evolution)
  specialization: Specialization | null; // null until 2nd evolution at Level 30

  // Streak (Section 3.3)
  streakCount: number;
  streakActive: boolean;
  streakGraceDays: number;
  longestStreak: number;
  lastActivityDate?: Timestamp; // source activity date, not sync date

  // Attributes (Section 1.3) — automatic, never manually allocated
  attributes: {
    endurance: { level: number; xp: number };
    speed: { level: number; xp: number };
    strength: { level: number; xp: number };
    vitality: { level: number; xp: number };
  };

  // Personal records (tracked for achievement triggers — Section 4.2.1)
  personalRecords: Record<
    string,
    {
      value: number;
      activityId: number;
      date: Timestamp;
    }
  >;

  // Inventory — Consumables (Section 5.2.1 / 5.3.1)
  inventory: {
    streakShields: number;
    xpBoosts: number;
    goldBoosts: number;
    luckyCharms: number;
    enduranceElixirs: number;
    trailblazerMaps: number;
  };

  // Visual Customization (Section 8)
  equippedGear: {
    helmet: string | null;
    armor: string | null;
    boots: string | null;
    weapon: string | null;
    accessory: string | null;
  };
  unlockedCosmetics: string[]; // cosmetic item IDs

  // Pet System (Section 9)
  activePetId: string | null;
  incubatingEgg: {
    distanceRequired: number;
    distanceProgress: number;
  } | null;

  // Rest & Recovery (Section 6)
  restDays: Weekday[]; // 0–2 days chosen by player

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 11.2 Subtypes

```typescript
type CharacterTier =
  | "wanderer" | "scout" | "ranger" | "warrior"
  | "champion" | "hero"  | "legend" | "mythic";

type CharacterClass =
  | "strider" | "voyager" | "mountaineer" | "aquanaut" | "titan";

type Specialization =
  | "marathoner" | "sprinter"
  | "roadRacer"  | "trailblazer"
  | "summitChaser" | "trekker"
  | "openWater" | "poolmaster"
  | "powerlifter" | "crossfitter";

type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
```

### 11.3 Firestore Collections

| Collection                 | Purpose                                                       |
| -------------------------- | ------------------------------------------------------------- |
| `users/{uid}`              | Root user document containing `GameProfile`                   |
| `users/{uid}/quests`       | Active and recently completed quests (daily, weekly, monthly) |
| `users/{uid}/achievements` | Earned achievements with unlock timestamps                    |
| `users/{uid}/pets`         | Owned pets (species, XP, stage, rarity)                       |
| `shopItems`                | Item Shop catalog — consumables and cosmetics (admin-managed) |
| `questTemplates`           | Quest template pool (personal + community) for generation    |
| `achievementDefinitions`   | Achievement definitions with thresholds and rewards           |
| `petSpecies`               | Pet species catalog (buffs, rarity, evolution visuals)        |
| `communityQuests`          | Currently active community quests shared across all players   |
| `leaderboards/global`      | Precomputed global leaderboard snapshot (Section 7.1)         |

---

## 12. Implementation Priority

Phases are ordered to build the game from the core loop outward: establish the XP/level foundation first, then layer consistency, identity, goals, economy, depth, and finally social and personalization on top. Each phase delivers a coherent slice that is playable and testable on its own. Future design space items (Sections 1.1.4, 1.3.1, 3.1.3, 5.2.3, 7.1.1, 7.2.2, 10) are explicitly deferred — they slot in after Phase 8 as opportunistic expansions.

### Phase 1 — Foundation (MVP)

**Goal:** The core activity → XP → level loop works end-to-end. A player can connect Strava, see their activities converted to XP, level up, and view their character.

- Strava sync integration (webhook + activity processing pipeline)
- XP calculation engine: base rates (distance + time), elevation bonus, daily login bonus
- Anti-cheat speed thresholds with flagging
- Leveling formula (`100 * L^2 + 300 * L`)
- Tier system with tier assignment based on level
- Novice state for all new players (no class yet)
- Character page: level, XP bar, tier badge with color, basic activity history
- GameProfile data model (Firestore)

**Testable outcome:** Player connects Strava → activities sync → XP is calculated → level increases → tier badge updates.

### Phase 2 — Consistency

**Goal:** Reward players for returning daily and protect against real life getting in the way.

- Streak system: increment, grace day earning, grace day consumption, streak reset
- Late sync / offline activity handling: retroactive streak recalculation based on activity dates
- Rest day selection in settings (1–2 days per week, streak-protected)
- Streak display on character page

**Testable outcome:** Player maintains a streak across days, grace days absorb a missed day, rest days don't break the streak, late-synced activities restore a streak that appeared broken.

### Phase 3 — Identity & Celebration

**Goal:** Players commit to a character class, feel progression through celebration moments, and start earning Gold.

- Class evolution at Level 10: auto-suggestion from activity history + manual choice
- Class passive XP bonus applied to matching activities
- Class-specific avatar/icon on character page
- Level-up celebration modal with animation
- Tier-up celebration modal with color transition and new badge
- Level-up reward chest: Gold payout (introduces Gold currency)

**Testable outcome:** Player reaches Level 10 → class selection screen → chooses a class → avatar changes → future activities show class bonus → level-ups feel rewarding.

### Phase 4 — Goals

**Goal:** Long-term milestones give players direction beyond leveling and a collection to chase.

- Achievement system: definitions stored in Firestore, checked after every activity
- Single-effort achievements (e.g., run a marathon, gain 1,000m elevation in one activity)
- Cumulative achievements (e.g., run 1,000 km total, 30-day streak)
- Personal record tracking (fastest 5K, longest run, etc.) as achievement triggers
- Achievement badges displayed on character page
- Achievements page showing earned and locked badges with progress indicators
- One-time XP and Gold rewards on achievement unlock

**Testable outcome:** Player completes an activity → achievement check runs → badge unlocks with reward → visible on character page and achievements page.

### Phase 5 — Engagement Loop

**Goal:** Give players a daily reason to open the app beyond checking stats.

- Quest template system: template pool stored in Firestore
- Personal quest assignment: filtered by class and tier, RPG-themed names and flavor text
- Community quests: same quest for all players, activity-agnostic conditions
- Daily / weekly / monthly cadence with automatic generation and expiry
- Quest UI: active quests with progress bars, completion rewards
- Quest rewards: XP and Gold payouts

**Testable outcome:** Player opens app → sees today's quests → completes an activity → quest progress updates → quest completes with reward → next day brings new quests.

### Phase 6 — Variable Rewards & Economy

**Goal:** Introduce surprise mechanics, give Gold a purpose, and add player agency through consumables.

- Bonus drop system: chance-based roll after each activity, chest-opening animation
- Drop types: XP shards, Gold pouches, consumable items
- Gold economy fully wired: earning (activities, quests, achievements, drops) and spending
- Item Shop: consumables only (Streak Shield, XP Boost, Gold Boost, Lucky Charm, Endurance Elixir, Trailblazer Map)
- Inventory system with stack limits per consumable type
- Consumable activation flow: manual activation before activity, Streak Shield auto-consume
- Shop UI on character page

**Testable outcome:** Player completes activity → bonus drop rolls → chest animation reveals reward → player visits shop → buys a consumable with Gold → activates it → next activity applies the buff.

### Phase 7 — Depth & Uniqueness

**Goal:** Each player's character diverges based on how they actually train, adding a second dimension beyond level.

- Attribute system: four independent XP pools (Endurance, Speed, Strength, Vitality)
- Attribute XP calculation from activity characteristics (duration, pace, elevation, consistency)
- Radar/spider chart on character page
- Attribute levels (1–100) displayed per stat
- Specialization at Level 30: choice within class, specialization-specific XP sub-bonus
- Specialization avatars/icons

**Testable outcome:** Player's activities feed different attributes → radar chart reflects their training style → player reaches Level 30 → specialization choice screen → sub-bonus applies to matching activities.

### Phase 8 — Social & Personalization

**Goal:** A character worth showing off and a community to show off to.

- Global leaderboard: ranked by total XP, shows top players + own rank
- Public profiles: viewable by tapping a leaderboard entry
- Profile contents: tier badge, class, level, avatar, radar chart, achievement showcase, streak
- Visual customization: 5 equipment slots, equip/unequip from owned cosmetics
- Cosmetic items in Item Shop (purchased with Gold)
- Cosmetic drops from bonus chests (rare)
- Pet system: egg drops, incubation (distance-based), hatching (random species + rarity)
- Pet progression: XP gain, 3-stage visual evolution
- Pet management: max 3 owned, 1 active, passive buff applied
- Pet display on character page and public profile

**Testable outcome:** Player equips cosmetics → avatar updates on profile and leaderboard → other players can view the profile → player hatches a pet → pet evolves over time → pet buff applies to activities.

### Future Phases (post-MVP)

Features from the Future Design Space sections, prioritized by estimated impact:

1. **Attribute milestones** (Section 1.3.1) — rewards at attribute thresholds
2. **Well Rested Bonus** (Section 3.1.3) — small comeback XP bonus
3. **Weekly Recap** (Section 10) — in-app and email summary
4. **Leaderboard filters** (Section 7.1.1) — time period, class, tier filtering
5. **Friend system** (Section 7.2.2) — add friends, compare profiles side by side
6. **3rd Evolution / Mastery** (Section 1.1.4) — prestige-tier identity at Level 50+
7. **Secondary Class** (Section 1.1.4) — unlock a second class passive
8. **Seasonal & mini events** — time-limited quests, bonuses, exclusive cosmetics
9. **Premium currency** (Section 5.2.3) — cosmetic-only monetization
10. **Guilds** — guild creation, guild quests, guild raids, guild leaderboard

---

## 13. Next Steps

Before implementation begins, the following work needs to be completed to turn this design document into a buildable specification.

### 13.1 Balancing Pass

Define all numeric values that were deferred during design. This should be done as a dedicated session with a spreadsheet model to simulate player progression at different activity levels (casual: 3x/week, regular: 5x/week, hardcore: 7x/week+).

**XP & Progression:**

- Validate base XP rates per activity type by modeling typical sessions (e.g., a 5K run, a 50km ride, a 1km swim, a 45min gym session) — ensure XP outputs feel proportionally fair across sport types
- Set class bonus %, specialization bonus %, streak multiplier values, elevation rate — model the maximum possible multiplier stack to ensure it doesn't break progression
- Validate the leveling formula against modeled XP rates — check that level-up frequency feels right at each tier (fast early, gradual later)

**Economy:**

- Model Gold income (per activity, per quest, per achievement, per drop) against Gold costs (shop items) — ensure a casual player can buy something meaningful within 2–4 weeks, and there's always something worth saving for
- Set consumable prices, effects (multiplier values), and stack limits

**Streak:**

- Set grace day earn rate, max grace days, streak reward type and values

**Quests & Achievements:**

- XP and Gold reward amounts per quest cadence (daily small, weekly medium, monthly large)
- Achievement reward scaling by difficulty tier

**Loot & Drops:**

- Base drop chance per activity, rarity distribution across tiers, daily drop cap

**Attributes:**

- Define how activity characteristics map to attribute XP gains — what qualifies as "long duration," "high pace," etc. relative to the player's own history

**Pets:**

- Egg drop rate, incubation distances, evolution XP thresholds, buff values per rarity tier

**Deliverable:** A balancing constants file (JSON or config) externalized from code for easy iteration without redeployment.

### 13.2 Content Design

Create the actual content that populates the game systems.

- **Quest template pool:** 20–30 personal quest templates per class + 10–15 community quest templates, each with RPG-flavored title, narrative description, and mechanical condition, scaled per tier
- **Achievement catalog:** Full list of all achievements (single-effort + cumulative), organized by category, with thresholds, badge names, and reward tiers
- **Shop item catalog:** All consumable items with names, descriptions, prices, effects; all cosmetic items with names, descriptions, prices, per equipment slot
- **Pet species catalog:** Species names, rarity tiers, passive buffs, visual descriptions for each of the 3 evolution stages

**Deliverable:** Content spreadsheet or structured data files ready to be loaded into Firestore collections (`questTemplates`, `achievementDefinitions`, `shopItems`, `petSpecies`).

### 13.3 Visual & UX Design

Design the key screens and celebration moments that make the game feel alive.

**Core screens:**

- Character page layout: level, XP bar, tier badge, class/specialization, avatar with cosmetic slots, radar chart, streak, inventory, active pet
- Quest UI: active quests list with progress bars, completion animation, RPG flavor text
- Achievement page: grid/list of badges, earned vs locked states, progress indicators
- Shop UI: consumable and cosmetic tabs, item cards with prices, purchase confirmation
- Leaderboard UI: ranked list with tier badges, tap-to-profile interaction
- Public profile layout: read-only view with all profile contents

**Celebration moments:**

- Level-up modal: animation, reward chest reveal, tier-up variant
- Class evolution screen: class selection at Level 10, specialization at Level 30, with descriptions and avatar previews
- Chest-opening animation: bonus drop reveal sequence
- Achievement unlock notification

**Visual assets:**

- Tier badge designs for all 8 tiers + color palette + Mythic animated treatment
- Class and specialization avatars: base silhouettes for 5 classes, variants for 10 specializations
- Pet visuals: species designs across 3 evolution stages per species
- Cosmetic item designs per equipment slot
- Notification / toast designs: quest completion, achievement unlock, streak warnings, Well Rested

**Deliverable:** Wireframes or mockups for all key screens and moments, plus an asset list for illustrations and animations.

### 13.4 Technical Architecture

Plan the backend systems before writing code.

- **Strava integration:** Webhook setup, activity sync pipeline, data mapping from Strava activity types to game activity types, rate limiting and error handling
- **XP calculation service:** Activity → XP pipeline with bonus stacking logic, anti-cheat validation
- **Streak engine:** Daily evaluation logic, grace day management, retroactive recalculation on late sync — define whether this runs on activity webhook, scheduled function, or both
- **Quest generation service:** Template selection logic, class/tier filtering, community quest scheduling, progress tracking, expiry handling
- **Achievement checker:** Post-activity evaluation, personal record comparison, cumulative stat tracking
- **Leaderboard computation:** Scheduled function for global ranking, snapshot storage
- **Drop/loot system:** Probability engine, rarity rolls, inventory management
- **Data model validation:** Review GameProfile schema (Section 11) against all systems, ensure Firestore collection structure supports all required queries efficiently
- **Constants externalization:** Design the config system so all balancing values are adjustable without code changes

**Deliverable:** Technical design document covering service architecture, data flow diagrams, and Firestore query patterns.
