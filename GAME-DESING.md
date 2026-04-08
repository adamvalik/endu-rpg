# Endu RPG — Game Design Document

## Vision

Endu RPG transforms real-world fitness into an RPG adventure. Every run, ride, swim, and workout earns experience, advances your character, and progresses a story. The goal is to make exercise intrinsically rewarding through RPG mechanics — not just tracking numbers, but building a character, completing quests, and earning loot.

The design draws heavily from classic RPG loops: **identity** (character class), **goals** (quests and achievements), **surprise** (loot drops), **progression** (levels, tiers, attributes), and **community** (guilds and leaderboards).

---

## 1. Character System

### 1.1 Character Classes

Five classes define a player's identity and passive bonuses. Players start as a **Novice** and choose a class at Level 10 (see 1.2 Class Evolution).

| Class           | Focus               | Passive Bonus                                 |
| --------------- | ------------------- | --------------------------------------------- |
| **Strider**     | Running             | +15% XP from running activities               |
| **Voyager**     | Cycling             | +15% XP from cycling activities               |
| **Mountaineer** | Hiking / Elevation  | +15% XP from walking + double elevation bonus |
| **Aquanaut**    | Swimming            | +15% XP from swimming activities              |
| **Titan**       | Strength / Workouts | +15% XP from workout and strength activities  |

- Auto-suggested based on activity history at Level 10, or manually chosen
- Can be changed once per month (to avoid lock-in regret)
- Each class has a distinct avatar/icon used across the app

### 1.2 Class Evolution

Every player starts as a **Novice** with no class bonus. Classes are earned through progression, not chosen at onboarding.

| Evolution         | Trigger  | What Happens                                                                  |
| ----------------- | -------- | ----------------------------------------------------------------------------- |
| **1st Evolution** | Level 10 | Choose a Base Class (Strider, Voyager, etc.) — unlocks the +15% passive bonus |
| **2nd Evolution** | Level 30 | Choose a Specialization within the class                                      |

**Specializations (examples):**

| Base Class      | Specialization A                                    | Specialization B                        |
| --------------- | --------------------------------------------------- | --------------------------------------- |
| **Strider**     | Marathoner (bonus for long runs)                    | Sprinter (bonus for high pace)          |
| **Voyager**     | Road Racer (bonus for flat speed)                   | Trailblazer (bonus for MTB elevation)   |
| **Mountaineer** | Summit Chaser (bonus for single-activity elevation) | Trekker (bonus for long hikes)          |
| **Aquanaut**    | Open Water (bonus for distance swims)               | Poolmaster (bonus for swim frequency)   |
| **Titan**       | Powerlifter (bonus for strength sessions)           | Crossfitter (bonus for varied workouts) |

- Specialization grants an additional +10% XP bonus for the sub-type
- Evolution moments are major celebration events with unique visuals

### 1.3 Tiers

Tiers represent major character milestones. Each tier-up is a celebration moment with unique visuals.

| Tier         | Level Range | Fantasy Flavor                                |
| ------------ | ----------- | --------------------------------------------- |
| **Wanderer** | 1–4         | A traveler setting out on their first journey |
| **Scout**    | 5–9         | Learning the ways of the wild                 |
| **Ranger**   | 10–19       | A seasoned explorer of trails and roads       |
| **Warrior**  | 20–29       | Proven through sweat and endurance            |
| **Champion** | 30–39       | Known throughout the realm for their feats    |
| **Hero**     | 40–49       | Inspires others to take up the path           |
| **Legend**   | 50–64       | Their name echoes across the land             |
| **Mythic**   | 65+         | Transcended mortal limits                     |

Each tier-up unlocks a visual badge, a new title, and access to tier-specific quests.

### 1.4 Attributes

Four core stats that grow based on _how_ you exercise, creating a unique build per player.

| Attribute     | Grows From                                    | What It Represents             |
| ------------- | --------------------------------------------- | ------------------------------ |
| **Endurance** | Long-duration activities (>45 min)            | Stamina and staying power      |
| **Speed**     | High-pace activities (above personal average) | Quickness and agility          |
| **Strength**  | Elevation gain + strength workouts            | Raw power and climbing ability |
| **Vitality**  | Consistency (streaks, weekly activity count)  | Health and resilience          |

- Each attribute has its own level (1–100) with a separate XP pool
- Displayed as a radar/spider chart on the character page
- Attribute milestones (e.g., Endurance 25) unlock passive bonuses or cosmetic rewards
- Creates visual "character builds" unique to each player

#### Stat Points

In addition to automatic growth, players earn **Stat Points** on each level-up (2 points per level). These can be manually allocated to any attribute, allowing players to customize their build beyond what their activity mix naturally produces.

- Stat points are spent on the character page via a simple +/- interface
- Unspent points are banked (no expiration)
- Creates meaningful level-up decisions

### 1.5 Skill Trees

Each attribute has an associated skill tree with passive perks unlocked by reaching attribute milestones and spending stat points.

**Examples:**

| Tree          | Perk (Tier 1)                 | Perk (Tier 2)                            | Perk (Tier 3)                  |
| ------------- | ----------------------------- | ---------------------------------------- | ------------------------------ |
| **Endurance** | +5% XP for activities >30 min | Grace day capacity +1                    | +10% XP for activities >60 min |
| **Speed**     | +5% XP when above avg pace    | Streak multiplier kicks in 1 day earlier | +10% XP for sprint activities  |
| **Strength**  | +1 XP per meter elevation     | +10% elevation XP                        | Double boss challenge rewards  |
| **Vitality**  | +1 grace day max              | Rest day XP doubled                      | Streak never decays below 3    |

- Each tree has 3 tiers, unlocked at attribute levels 10, 25, and 50
- Perks are passive — no activation needed
- Adds long-term build planning and replayability

---

## 2. Economy & Currencies

### 2.1 XP (Experience)

Used for leveling up. Infinite — never spent, only accumulated.

### 2.2 Gold

Earned currency spent in the Item Shop.

**Earning Gold:**

| Source                  | Amount                                 |
| ----------------------- | -------------------------------------- |
| Per activity completed  | 10–50 Gold (scales with distance/time) |
| Daily quest completion  | +25 Gold                               |
| Weekly quest completion | +100 Gold                              |
| Achievement unlocked    | +50–500 Gold (scales with rarity)      |
| Boss defeated           | +200 Gold                              |
| Bonus drop (chest)      | 20–100 Gold (random)                   |

---

## 3. Progression

### 3.1 Experience Points (XP)

XP is the core currency of progression. Every activity earns XP based on type, distance/time, and bonuses.

#### Base XP Rates

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

#### XP Caps & Anti-Cheat

| Rule                   | Value   | Purpose                       |
| ---------------------- | ------- | ----------------------------- |
| Max single-activity XP | 5,000   | Prevents outlier exploitation |
| Max running speed      | 25 km/h | Anti-cheat                    |
| Max cycling speed      | 80 km/h | Anti-cheat                    |
| Max swimming speed     | 8 km/h  | Anti-cheat                    |
| Max walking speed      | 12 km/h | Anti-cheat                    |
| Max XC ski speed       | 35 km/h | Anti-cheat                    |

| Activity type mismatch | Flag | E-bike logged as run, etc. |

Suspicious activities earn 0 XP with a logged warning.

#### Diminishing Returns

To balance casual vs. hardcore players, XP gain tapers after a daily threshold:

| Daily XP Earned | Rate             |
| --------------- | ---------------- |
| First 2,000 XP  | 100% (full rate) |
| 2,001–4,000 XP  | 50%              |
| 4,001+ XP       | 25%              |

- Resets at midnight (user-local time)
- Encourages consistent daily activity over marathon grinding sessions
- The single-activity cap (5,000 XP) still applies independently

#### Rested XP (Catch-Up Mechanic)

If a player logs no activity for 2+ consecutive days, they accumulate **Rested XP**:

- Gain rate: 500 Rested XP per inactive day (max 2,000 stored)
- Effect: Next activity earns 2x XP until the Rested XP pool is depleted
- Prevents casual players from falling hopelessly behind hardcore daily runners
- Does not stack with XP Boost consumables (higher multiplier wins)

### 3.2 Leveling

**Formula:** `XP_required(L) = 100 * L^2 + 300 * L`

| Level | Total XP Required | Approx. Time (active user) |
| ----- | ----------------- | -------------------------- |
| 2     | 700               | ~1 week                    |
| 5     | 4,000             | ~3 weeks                   |
| 10    | 13,000            | ~2 months                  |
| 25    | 70,000            | ~6 months                  |
| 50    | 265,000           | ~2 years                   |

Level-ups trigger a celebration modal with:

- New level number with animation
- Tier-up announcement (if applicable)
- XP breakdown of the triggering activity

### 3.3 Streak System

Streaks reward consistency without punishing life.

**Core rules:**

- Activity on consecutive days increments the streak
- Same-day activities maintain (don't increment) the streak
- Missing a day consumes a **grace day** if available; otherwise streak decays by 3 (floor of 0)

**Grace days:**

- Earn 1 grace day per 7 consecutive active days
- Max 3 grace days stored at once
- Grace days are consumed automatically on missed days

**Streak multiplier (tiered):**

| Streak Length | XP Multiplier |
| ------------- | ------------- |
| 3–6 days      | 1.1x (+10%)   |
| 7–13 days     | 1.2x (+20%)   |
| 14–29 days    | 1.3x (+30%)   |
| 30+ days      | 1.5x (+50%)   |

**Streak milestones (one-time rewards):**

| Milestone | Reward                                   |
| --------- | ---------------------------------------- |
| 7 days    | +200 XP + "Week Warrior" badge           |
| 14 days   | +500 XP + "Fortnight Fighter" badge      |
| 30 days   | +1,000 XP + "Iron Will" badge            |
| 60 days   | +2,000 XP + "Unbreakable" badge          |
| 100 days  | +5,000 XP + "Legendary Discipline" badge |

**Tracked fields:** `streakCount`, `streakActive`, `streakGraceDays`, `longestStreak`

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
