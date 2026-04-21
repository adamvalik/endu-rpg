// Backend mirror of @endu/shared/config. Keep values in sync with
// packages/shared/config/game.config.ts — that file is the canonical spec
// consumed by web/mobile clients.

export const GAME_CONFIG = {
  LEVELING: {
    A: 100,
    B: 300,
  },

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

  XP_PER_M_ELEVATION: 2,
  XP_PER_KM_RUN: 100,
  XP_PER_KM_WALK: 50,
  XP_PER_KM_XC_SKI: 50,
  XP_PER_KM_SKI: 25,
  XP_PER_KM_RIDE: 25,
  XP_PER_KM_SWIM: 500,
  XP_PER_MIN_WORKOUT: 10,
  XP_PER_MIN_YOGA: 5,

  BONUSES: {
    DAILY_LOGIN_XP: 50,
    CLASS_BONUS_MULTIPLIER: 1.15,
    SPECIALIZATION_BONUS_MULTIPLIER: 1.1,
    STREAK_BONUS_MULTIPLIER: 1.2,
  },

  CLASS_ACTIVITY_GROUPS: {
    strider: ['RUNNING_TYPES'],
    voyager: ['CYCLING_TYPES'],
    mountaineer: ['WALKING_TYPES'],
    aquanaut: ['SWIM_TYPES'],
    titan: ['WORKOUT_TYPES'],
  },

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

  STREAK: {
    THRESHOLD: 3,
    GRACE_DAYS_EARN_EVERY: 7,
    MAX_GRACE_DAYS: 3,
    DECAY_PER_MISSED_DAY: 1,
  },

  REST_DAYS_MAX: 2,

  ANTI_CHEAT: {
    running: 25,
    cycling: 80,
    swimming: 8,
    walking: 12,
    xcSki: 35,
  },

  QUEST_COUNTS: {
    daily: 3,
    weekly: 3,
    monthly: 1,
    communityShare: 0.34,
  },
  QUEST_REWARDS: {
    daily: { xp: 50, gold: 10 },
    weekly: { xp: 300, gold: 50 },
    monthly: { xp: 1500, gold: 250 },
  },

  ACHIEVEMENT_REWARD_TIERS: {
    bronze: { xp: 100, gold: 20 },
    silver: { xp: 500, gold: 100 },
    gold: { xp: 2000, gold: 500 },
    platinum: { xp: 10000, gold: 2000 },
  },

  LEVEL_UP_GOLD: {
    base: 20,
    perLevel: 5,
  },

  DROP_RATES: {
    PER_ACTIVITY_ROLL_CHANCE: 0.25,
    DAILY_ROLL_CAP: 1,
    RARITY: {
      common: 0.7,
      rare: 0.22,
      epic: 0.07,
      legendary: 0.01,
    },
  },

  CONSUMABLES: {
    streakShield: { price: 200, effect: 1, stackMax: 3 },
    xpBoost: { price: 150, effect: 1.5, stackMax: 5 },
    goldBoost: { price: 150, effect: 1.5, stackMax: 5 },
    luckyCharm: { price: 250, effect: 2.0, stackMax: 3 },
    enduranceElixir: { price: 200, effect: 1.3, stackMax: 3 },
    trailblazerMap: { price: 200, effect: 1.3, stackMax: 3 },
  },

  ATTRIBUTES: {
    LONG_DURATION_MIN: 45,
    HIGH_PACE_PERCENTILE: 0.8,
    ELEVATION_XP_RATIO: 0.5,
    VITALITY_PER_STREAK_DAY: 10,
    LEVEL_CAP: 100,
  },

  PETS: {
    EGG_DROP_RATE: 0.01,
    INCUBATION_KM: 25,
    EVOLUTION_XP_THRESHOLDS: [5000, 25000] as [number, number],
    RARITY_WEIGHTS: {
      common: 0.6,
      uncommon: 0.28,
      rare: 0.1,
      legendary: 0.02,
    },
    MAX_OWNED: 3,
  },

  RUNNING_TYPES: ['Run', 'VirtualRun', 'TrailRun'],
  WALKING_TYPES: ['Walk', 'Hike'],
  CYCLING_TYPES: ['Ride', 'VirtualRide', 'EBikeRide', 'MountainBikeRide'],
  XC_SKI_TYPES: ['NordicSki', 'BackcountrySki'],
  SKI_TYPES: ['AlpineSki', 'Snowboard'],
  WORKOUT_TYPES: ['Workout', 'WeightTraining', 'Crossfit'],
  SWIM_TYPES: ['Swim'],
  YOGA_TYPES: ['Yoga', 'Elliptical', 'StairStepper', 'RockClimbing'],
};
