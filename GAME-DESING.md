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

### 4.1 Daily Quests

2–3 quests generated each day at midnight (user-local time), randomly selected from a template pool.

**Example templates:**

| Quest            | Condition                | Reward  |
| ---------------- | ------------------------ | ------- |
| "First Steps"    | Complete any activity    | +25 XP  |
| "Morning Run"    | Run at least 3 km        | +75 XP  |
| "Climb Higher"   | Gain 100m+ elevation     | +60 XP  |
| "Endurance Test" | Activity lasting 45+ min | +80 XP  |
| "Double Down"    | Complete 2 activities    | +100 XP |

### 4.2 Weekly Quests

2–3 quests generated each Monday, tracking cumulative progress across the week.

**Example templates:**

| Quest           | Condition                           | Reward  |
| --------------- | ----------------------------------- | ------- |
| "Road Warrior"  | Run 20 km total                     | +300 XP |
| "Active Week"   | Complete 4 activities               | +200 XP |
| "Mountain Goat" | Gain 500m total elevation           | +250 XP |
| "Variety Pack"  | Complete 3 different activity types | +350 XP |
| "Century Ride"  | Cycle 100 km total                  | +400 XP |

### 4.3 Monthly Challenges

1 challenge generated on the first of each month. Larger-scale goals with premium rewards.

**Example templates:**

| Challenge        | Condition                      | Reward               |
| ---------------- | ------------------------------ | -------------------- |
| "The Centurion"  | Run 100 km total               | +1,000 XP + 200 Gold |
| "Peak Season"    | Gain 2,000m total elevation    | +800 XP + 150 Gold   |
| "Iron Month"     | Complete 20 activities         | +1,200 XP + 250 Gold |
| "Explorer"       | Log 5 different activity types | +600 XP + 100 Gold   |
| "Endurance King" | Log 10 activities over 60 min  | +1,500 XP + 300 Gold |

### 4.4 Achievements

Permanent badges earned by reaching milestones. Checked after every activity.

**Categories:**

**Distance milestones:**

- Run 100 km, 500 km, 1,000 km, 5,000 km
- Cycle 500 km, 2,000 km, 10,000 km
- Swim 10 km, 50 km, 100 km

**Elevation:**

- "Hilltop" — 1,000m total elevation
- "Summit Seeker" — 10,000m total elevation
- "Everest" — 8,849m in cumulative elevation
- "To the Moon" — 100,000m total elevation

**Consistency:**

- "Getting Started" — 7-day streak
- "Committed" — 30-day streak
- "Ironclad" — 100-day streak
- "Year of Legends" — 365-day streak

**Activity count:**

- 10, 50, 100, 500, 1,000 total activities

**Variety:**

- "Jack of All Trades" — 3 different activity types
- "Renaissance Athlete" — 6 different activity types

**Personal bests:**

- "Speed Demon" — set a new fastest 5 km
- "Distance King" — set a new longest single activity
- "Altitude Record" — set a new single-activity elevation record

Each achievement grants a one-time XP bonus (scaling with difficulty) and a permanent badge visible on the character page.

---

## 5. Loot & Inventory

### 5.1 Bonus Drops

After each activity, there is a 10–20% chance of a bonus drop. Drops are revealed with a chest-opening animation.

| Drop                 | Effect                   | Rarity         |
| -------------------- | ------------------------ | -------------- |
| **XP Shard** (small) | +50 bonus XP             | Common (60%)   |
| **XP Shard** (large) | +200 bonus XP            | Uncommon (25%) |
| **Streak Shield**    | Prevents 1 streak decay  | Rare (10%)     |
| **XP Boost**         | 1.5x XP on next activity | Rare (5%)      |

### 5.2 Inventory

Simple consumable inventory displayed on the character page.

```
inventory: {
  streakShields: number     // max 5 stored
  xpBoosts: number          // max 3 stored, 1.5x next activity
}
```

- Streak shields are auto-consumed when a streak would decay
- XP boosts are manually activated before an activity (or auto-applied to next)

---

## 6. Item Shop

The Item Shop is the primary Gold sink. Players spend Gold earned from activities, quests, and drops.

### 6.1 Consumables (Functional)

Temporary buffs purchased with Gold:

| Item                 | Cost     | Effect                                               |
| -------------------- | -------- | ---------------------------------------------------- |
| **Energy Bar**       | 50 Gold  | +20% XP for next activity                            |
| **Trail Mix**        | 30 Gold  | +10% Gold from next activity                         |
| **Lucky Charm**      | 80 Gold  | Bonus drop chance doubled for next activity          |
| **Endurance Elixir** | 100 Gold | No diminishing returns for 24 hours                  |
| **Streak Armor**     | 150 Gold | Prevents 1 streak decay (same as Streak Shield drop) |

- Max 5 of each consumable in inventory
- Some consumables also drop from chests (provides alternative acquisition)

### 6.2 Cosmetics (Visual)

Gear that changes the avatar's appearance but not stats:

| Category        | Examples                                   | Price Range    |
| --------------- | ------------------------------------------ | -------------- |
| **Helmets**     | Iron Helm, Dragon Crown, Frost Hood        | 200–1,000 Gold |
| **Armor**       | Leather Vest, Plate Mail, Shadow Cloak     | 300–1,500 Gold |
| **Boots**       | Trail Runners, Iron Greaves, Cloud Walkers | 200–800 Gold   |
| **Weapons**     | Staff, Sword, Bow (cosmetic only)          | 500–2,000 Gold |
| **Accessories** | Capes, Auras, Shoulder Pets                | 100–500 Gold   |

- New cosmetics rotate into the shop weekly (FOMO mechanic)
- Some cosmetics are exclusive to seasonal events or achievements
- Crucial for future monetization (premium currency option)

---

## 7. Rest & Recovery

### 7.1 Rest Day Mechanic

Players can designate 1–2 rest days per week in settings (default: none).

- On a designated rest day, if no activity is logged, award **+25 Recovery XP**
- This reframes rest as part of the game, not a failure state
- Rest days don't consume grace days and don't trigger streak decay
- Checked via a daily scheduled function

---

## 8. Personal Records

### 8.1 Tracked Records

Automatically tracked per player:

| Record                           | Metric   |
| -------------------------------- | -------- |
| Fastest 5 km                     | Time     |
| Fastest 10 km                    | Time     |
| Longest single run               | Distance |
| Longest single ride              | Distance |
| Most elevation (single activity) | Meters   |
| Longest streak                   | Days     |
| Most XP (single activity)        | XP       |

### 8.2 PR Notifications

When a personal record is broken:

- Special "New Record!" modal (distinct from level-up)
- Record details: old value vs new value
- Stored in `personalRecords` map on user document

---

## 9. Exploration Map

### 9.1 Zone System

A virtual world map where cumulative distance unlocks new zones. Each zone has its own visual theme.

| Zone                  | Distance Threshold | Theme                          |
| --------------------- | ------------------ | ------------------------------ |
| **The Village**       | 0 km               | Starting area, tutorial quests |
| **The Meadows**       | 100 km             | Rolling green hills            |
| **The Forest**        | 300 km             | Dense woodland trails          |
| **The Mountains**     | 750 km             | Rocky peaks and passes         |
| **The Desert**        | 1,500 km           | Vast open expanse              |
| **The Coast**         | 3,000 km           | Ocean cliffs and beaches       |
| **The Frozen North**  | 5,000 km           | Ice and snow                   |
| **The Dragon's Peak** | 10,000 km          | Final legendary zone           |

### 9.2 Zone Bosses

Each zone has a boss challenge — a specific activity goal that "defeats" the zone boss.

| Zone              | Boss           | Challenge                                       |
| ----------------- | -------------- | ----------------------------------------------- |
| The Meadows       | Hill Giant     | Run 5 km with 100m+ elevation                   |
| The Forest        | Shadow Wolf    | Complete 3 activities in one day                |
| The Mountains     | Mountain Troll | Run 10 km with 200m+ elevation                  |
| The Desert        | Sand Wyrm      | Cycle 50 km in a single ride                    |
| The Coast         | Sea Serpent    | Swim 2 km in a single session                   |
| The Frozen North  | Ice Drake      | Complete 5 activities in one week during winter |
| The Dragon's Peak | Elder Dragon   | Run a half marathon (21.1 km)                   |

Defeating a boss grants a unique title, a large XP reward, and a permanent badge.

---

## 10. Seasonal Events

### 10.1 Event Structure

4 seasonal events per year, each lasting ~2 months:

| Season | Event            | Months  | Theme                                                   |
| ------ | ---------------- | ------- | ------------------------------------------------------- |
| Winter | **Frost Trials** | Dec–Jan | Cold-weather activity bonuses, snowsport challenges     |
| Spring | **Awakening**    | Mar–Apr | "Shake off the rust" progressive goals, outdoor variety |
| Summer | **Sun Chase**    | Jun–Jul | Distance-focused competitive challenges                 |
| Autumn | **Harvest Run**  | Sep–Oct | Elevation and trail challenges, gathering theme         |

### 10.2 Event Features

- Exclusive quest chain (5–7 quests) with narrative flavor text
- Seasonal achievements (only earnable during the event)
- Seasonal cosmetic badge/title as final reward
- Bonus XP multiplier for thematic activities (e.g., +10% for skiing during Frost Trials)
- Configured server-side via Firestore `events` collection — no app deploy needed

### 10.3 Mini-Events (FOMO)

Shorter, more frequent events that create urgency:

| Event Type            | Duration | Effect                                |
| --------------------- | -------- | ------------------------------------- |
| **Double XP Weekend** | 2 days   | All XP gains doubled                  |
| **Gold Rush**         | 24 hours | Gold drops tripled                    |
| **Loot Frenzy**       | 48 hours | Bonus drop chance increased to 40%    |
| **Class Day**         | 24 hours | Specific class gets +30% XP (rotates) |

- Announced 24 hours in advance via push notification
- 1–2 mini-events per month between seasonal events
- Creates "play now" urgency without requiring long-term commitment

---

## 11. Social Features

### 11.1 Leaderboards

Weekly and monthly leaderboards with automatic reset:

| Board     | Metric                | Reset                |
| --------- | --------------------- | -------------------- |
| XP Earned | XP gained in period   | Weekly + Monthly     |
| Distance  | Total km in period    | Weekly + Monthly     |
| Streak    | Current streak length | Real-time            |
| Level     | Character level       | Real-time (all-time) |

- Filter by: class, tier, friends (future), global
- Show top 10 + player's own rank
- Computed by a scheduled Cloud Function

### 11.2 Guilds (Future)

- Create or join a guild (5–20 members)
- Guild quests: shared cumulative goals ("Run 500 km as a guild this month")
- Guild level and XP progression
- Guild leaderboard

**Guild Boss Raids:**

- Co-op challenges where the guild must collectively hit a target (e.g., "Run 500 km to defeat the Dragon")
- Boss raids rotate monthly with escalating difficulty
- Rewards: Gold, exclusive guild cosmetics, guild XP

**Guild Identity:**

- Custom guild banner / emblem (created from preset components)
- Guild tag displayed next to player name on leaderboards
- Guild chat for coordination

### 11.3 Prestige System (Endgame)

For players who reach Mythic tier (Level 65+):

- **Prestige** resets level to 1 but grants:
  - Permanent prestige star (visible to others)
  - +5% permanent XP bonus per prestige level
  - Exclusive prestige badge
- Prestige count is displayed prominently on the character page
- Creates infinite replayability for veterans

---

## 12. Personalization

### 12.1 Visual Customization

Players can mix and match unlocked gear to create a unique avatar identity visible on leaderboards, guild pages, and the character page.

**Equipment slots:**

- Helmet
- Armor / Chest
- Boots
- Weapon (cosmetic)
- Accessory (cape, aura, etc.)

**Acquisition sources:**

- Item Shop (Gold)
- Achievement rewards (exclusive items)
- Seasonal event rewards (limited-time items)
- Boss defeat rewards
- Bonus drops (rare)

- "Outfit" presets: save and switch between favorite combinations
- Preview mode before purchase

### 12.2 Pet System

A companion system inspired by virtual pets (Tamagotchi / Pokemon GO).

**Acquiring a Pet:**

1. Rare drop: "Mystery Egg" (5% chance from bonus drops)
2. Incubation: Walk/run a required distance to hatch (e.g., 10 km)
3. What hatches is random — different species with different passive buffs

**Pet Species (examples):**

| Pet               | Passive Buff                       | Rarity    |
| ----------------- | ---------------------------------- | --------- |
| **Trail Fox**     | +5% Gold Find                      | Common    |
| **Mountain Hawk** | +5% Elevation XP                   | Common    |
| **Shadow Wolf**   | +5% XP from night activities       | Uncommon  |
| **Fire Drake**    | +10% XP during events              | Rare      |
| **Phoenix**       | Streak Shield once per week (auto) | Legendary |

**Pet Care:**

- Hunger bar depletes by 1 level each day with no logged activity
- Feeding = logging any activity (resets hunger to full)
- If hunger reaches 0, the pet "sleeps" — passive buff deactivated until next activity
- Creates a daily engagement pull beyond streaks

**Pet Progression:**

- Pets gain their own XP from your activities
- At certain milestones, pets evolve visually (3 stages)
- Max 3 pets owned, 1 active at a time

---

## 13. Weekly Recap

### 13.1 Summary Content

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

## 14. Data Model

### GameProfile (updated)

```typescript
interface GameProfile {
  // Core progression
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  tier: CharacterTier;

  // Economy
  gold: number;

  // Identity
  characterClass: CharacterClass | null; // null = Novice (pre-evolution)
  specialization: string | null; // null until 2nd evolution

  // Streak
  streakCount: number;
  streakActive: boolean;
  streakGraceDays: number;
  longestStreak: number;
  lastActivityDate?: Timestamp;

  // Attributes
  attributes: {
    endurance: number;
    speed: number;
    strength: number;
    vitality: number;
  };
  unspentStatPoints: number;
  unlockedPerks: string[]; // skill tree perk IDs

  // Personal records
  personalRecords: Record<
    string,
    {
      value: number;
      activityId: number;
      date: Timestamp;
    }
  >;

  // Inventory
  inventory: {
    streakShields: number;
    xpBoosts: number;
    energyBars: number;
    luckyCharms: number;
    enduranceElixirs: number;
  };

  // Cosmetics & Customization
  equippedGear: {
    helmet: string | null;
    armor: string | null;
    boots: string | null;
    weapon: string | null;
    accessory: string | null;
  };
  unlockedCosmetics: string[]; // cosmetic item IDs

  // Pet
  activePet: string | null; // pet ID
  pets: Record<
    string,
    {
      species: string;
      xp: number;
      stage: number; // 1–3 evolution stage
      hunger: number; // 0–100
    }
  >;
  incubatingEgg: { distanceRequired: number; distanceWalked: number } | null;

  // Rested XP
  restedXP: number; // accumulated catch-up XP pool

  // Exploration
  currentZone: string;
  defeatedBosses: string[];

  // Endgame
  prestigeCount: number;

  // Daily tracking (for diminishing returns)
  dailyXPEarned: number;
  dailyXPDate: string; // ISO date, resets at midnight
}
```

### New Firestore Collections

| Collection                 | Purpose                                            |
| -------------------------- | -------------------------------------------------- |
| `users/{uid}/achievements` | Earned achievements per user                       |
| `users/{uid}/quests`       | Active and completed quests                        |
| `users/{uid}/pets`         | Pet details (species, XP, hunger, stage)           |
| `users/{uid}/cosmetics`    | Owned cosmetic items and gear                      |
| `events`                   | Seasonal event definitions (admin-managed)         |
| `miniEvents`               | Short-duration event definitions (Double XP, etc.) |
| `shopItems`                | Item Shop catalog (consumables + cosmetics)        |
| `guilds`                   | Guild documents with membership (future)           |
| `guilds/{gid}/raids`       | Active and past guild boss raids                   |
| `leaderboards`             | Precomputed leaderboard snapshots                  |

---

## 15. Implementation Priority

| Phase       | Features                                                                                      | Goal                         |
| ----------- | --------------------------------------------------------------------------------------------- | ---------------------------- |
| **Phase 1** | Streak rework, tier expansion, XP rebalancing, anti-cheat extension, diminishing returns      | Fix the foundation           |
| **Phase 2** | Achievement system, personal records                                                          | Goal structure               |
| **Phase 3** | Class evolution system (Novice → Class → Spec), quest system (daily/weekly/monthly)           | Identity + daily engagement  |
| **Phase 4** | Loot/drops, Gold economy, Item Shop (consumables), rest day mechanic, rested XP, weekly recap | Variable rewards + retention |
| **Phase 5** | Attribute system, stat points, skill trees, exploration map                                   | Depth and uniqueness         |
| **Phase 6** | Seasonal events, mini-events, leaderboards                                                    | Live ops + competition       |
| **Phase 7** | Visual customization, Item Shop (cosmetics), pet system                                       | Personalization + daily pull |
| **Phase 8** | Guilds, guild raids, guild identity, prestige                                                 | Social + endgame             |
