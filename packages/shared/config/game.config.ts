// Canonical balancing config for Endu RPG.
// Mirror any change in packages/functions/src/game/game.config.ts so
// backend calculations and client displays stay aligned.
//
// Sections correspond to GAME-DESING.md. Values marked "placeholder" are
// starting points — tune them in the web simulator at /dev/simulator, then
// paste the result back here.

export const GAME_CONFIG = {
  // --- Leveling (§3.2) ---
  // XP_required(L) = A * L^2 + B * L
  LEVELING: {
    A: 100,
    B: 300,
  },

  // --- Tiers (§1.2) — minimum level required ---
  TIER_THRESHOLDS: {
    wanderer: 1,
    scout: 5,
    ranger: 10,
    warrior: 20,
    champion: 30,
    hero: 40,
    legend: 50,
    mythic: 65,
  },

  // --- XP rates (§3.1.1) ---
  XP_PER_M_ELEVATION: 2,
  XP_PER_KM_RUN: 100,
  XP_PER_KM_WALK: 50,
  XP_PER_KM_XC_SKI: 50,
  XP_PER_KM_SKI: 25,
  XP_PER_KM_RIDE: 25,
  XP_PER_KM_SWIM: 500,
  XP_PER_MIN_WORKOUT: 10,
  XP_PER_MIN_YOGA: 5,

  // --- Universal bonuses (§3.1.1) ---
  BONUSES: {
    DAILY_LOGIN_XP: 50, // first activity of the day
    CLASS_BONUS_MULTIPLIER: 1.15, // +15% when activity matches class
    SPECIALIZATION_BONUS_MULTIPLIER: 1.1, // placeholder — +10% for matching spec sub-condition
    STREAK_BONUS_MULTIPLIER: 1.2, // +20% while streak is active
  },

  // --- Classes (§1.1.2) — which activity-type groups each class gets the bonus on ---
  // Keys use the canonical lowercase ids from GAME-DESING.md §11.2.
  CLASS_ACTIVITY_GROUPS: {
    strider: ['RUNNING_TYPES'],
    voyager: ['CYCLING_TYPES'],
    mountaineer: ['WALKING_TYPES'], // elevation bonus also applies generically
    aquanaut: ['SWIM_TYPES'],
    titan: ['WORKOUT_TYPES'],
  },

  // --- Specializations (§1.1.3) — reserved; actual condition logic lands with Phase 7 ---
  SPECIALIZATIONS: {
    marathoner: { class: 'strider' },
    sprinter: { class: 'strider' },
    roadRacer: { class: 'voyager' },
    trailblazer: { class: 'voyager' },
    summitChaser: { class: 'mountaineer' },
    trekker: { class: 'mountaineer' },
    openWater: { class: 'aquanaut' },
    poolmaster: { class: 'aquanaut' },
    powerlifter: { class: 'titan' },
    crossfitter: { class: 'titan' },
  },

  // --- Streak (§3.3) ---
  STREAK: {
    THRESHOLD: 3, // days needed for bonus to activate
    GRACE_DAYS_EARN_EVERY: 7, // 1 grace day per N consecutive active days (placeholder)
    MAX_GRACE_DAYS: 3, // cap (placeholder)
    DECAY_PER_MISSED_DAY: 1, // streak decrement when no grace day absorbs the miss (placeholder)
  },

  // --- Rest & recovery (§6) ---
  REST_DAYS_MAX: 2,

  // --- Anti-cheat per-sport max avg speed in km/h (§3.1.2) ---
  ANTI_CHEAT: {
    running: 25,
    cycling: 80,
    swimming: 8,
    walking: 12,
    xcSki: 35,
  },

  // --- Quests (§4.1) — placeholders, to be tuned ---
  QUEST_COUNTS: {
    daily: 3,
    weekly: 3,
    monthly: 1,
    communityShare: 0.34, // fraction of slots reserved for community quests
  },
  QUEST_REWARDS: {
    daily: { xp: 50, gold: 10 },
    weekly: { xp: 300, gold: 50 },
    monthly: { xp: 1500, gold: 250 },
  },

  // --- Achievements (§4.2.3) — reward tiers by difficulty ---
  ACHIEVEMENT_REWARD_TIERS: {
    bronze: { xp: 100, gold: 20 },
    silver: { xp: 500, gold: 100 },
    gold: { xp: 2000, gold: 500 },
    platinum: { xp: 10000, gold: 2000 },
  },

  // --- Level-up gold reward (§3.2.1) — reward = base + perLevel * level ---
  LEVEL_UP_GOLD: {
    base: 20,
    perLevel: 5,
  },

  // --- Drops (§5.1) — rarity distribution sums to 1.0 when a drop rolls ---
  DROP_RATES: {
    PER_ACTIVITY_ROLL_CHANCE: 0.25, // P(any drop) per eligible activity
    DAILY_ROLL_CAP: 1, // max drop rolls per day (first activity only)
    RARITY: {
      common: 0.7,
      rare: 0.22,
      epic: 0.07,
      legendary: 0.01,
    },
  },

  // --- Consumables (§5.2.1 / §5.3.1) — price in gold, effect is a multiplier, stackMax limits inventory ---
  CONSUMABLES: {
    streakShield: { price: 200, effect: 1, stackMax: 3 }, // effect unused (prevents 1 reset)
    xpBoost: { price: 150, effect: 1.5, stackMax: 5 },
    goldBoost: { price: 150, effect: 1.5, stackMax: 5 },
    luckyCharm: { price: 250, effect: 2.0, stackMax: 3 }, // 2x drop chance on next activity
    enduranceElixir: { price: 200, effect: 1.3, stackMax: 3 }, // +30% XP if duration > threshold
    trailblazerMap: { price: 200, effect: 1.3, stackMax: 3 }, // +30% XP on elevation portion
  },

  // --- Attributes (§1.3) — activity-characteristic thresholds feeding attribute XP (Phase 7) ---
  ATTRIBUTES: {
    LONG_DURATION_MIN: 45, // minutes threshold for Endurance XP
    HIGH_PACE_PERCENTILE: 0.8, // pace must be in top 20% of player history for Speed XP
    ELEVATION_XP_RATIO: 0.5, // fraction of elevation XP that feeds Strength
    VITALITY_PER_STREAK_DAY: 10,
    LEVEL_CAP: 100,
  },

  // --- Pets (§9) — placeholders ---
  PETS: {
    EGG_DROP_RATE: 0.01, // 1% on eligible drops
    INCUBATION_KM: 25, // walk/run to hatch
    EVOLUTION_XP_THRESHOLDS: [5000, 25000] as [number, number], // stage 2, stage 3
    RARITY_WEIGHTS: {
      common: 0.6,
      uncommon: 0.28,
      rare: 0.1,
      legendary: 0.02,
    },
    MAX_OWNED: 3,
  },

  // --- Activity type mappings (data, not balancing) ---
  RUNNING_TYPES: ['Run', 'VirtualRun', 'TrailRun'],
  WALKING_TYPES: ['Walk', 'Hike'],
  CYCLING_TYPES: ['Ride', 'VirtualRide', 'EBikeRide', 'MountainBikeRide'],
  XC_SKI_TYPES: ['NordicSki', 'BackcountrySki'],
  SKI_TYPES: ['AlpineSki', 'Snowboard'],
  WORKOUT_TYPES: ['Workout', 'WeightTraining', 'Crossfit'],
  SWIM_TYPES: ['Swim'],
  YOGA_TYPES: ['Yoga', 'Elliptical', 'StairStepper', 'RockClimbing'],
};

export type GameConfig = typeof GAME_CONFIG;
