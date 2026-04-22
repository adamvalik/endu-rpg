// Static game content types (quest templates, achievements, shop items, pet species).
// These describe authored catalog data that will be seeded into Firestore collections.
// See GAME-DESING.md §4, §5, §9, §13.2 for the design spec.
import type { CharacterClass, CharacterTier } from './game.types';

// ---------- Quest Templates (§4.1) ----------

export type QuestCadence = 'daily' | 'weekly' | 'monthly';

export type QuestTrack = 'personal' | 'community';

// Metrics a quest condition can evaluate. Backend is responsible for computing
// these against the player's activity data over the quest's active window.
export type QuestMetric =
  // Aggregates over the quest window:
  | 'distance_km' //           sum of activity distance
  | 'duration_min' //          sum of activity moving time
  | 'elevation_m' //           sum of activity elevation gain
  | 'activity_count' //        number of activities logged
  | 'activity_variety' //      number of distinct activity types
  | 'xp_earned' //             total XP earned from activities
  // Single-activity triggers (match any one activity in the window):
  | 'single_activity_distance_km' //   a single activity ≥ value
  | 'single_activity_elevation_m' //   a single activity ≥ value
  | 'single_activity_duration_min'; //   a single activity ≥ value

export interface QuestCondition {
  metric: QuestMetric;
  /** Target threshold; condition is met when metric ≥ value. */
  value: number;
  /**
   * Restrict the condition to specific Strava activity types (e.g. ["Run", "TrailRun"]).
   * Omit to accept all activity types. Values must match strings in GAME_CONFIG *_TYPES arrays.
   */
  activityTypes?: string[];
}

export interface QuestReward {
  xp: number;
  gold: number;
}

export interface QuestTemplate {
  /** Stable ID — lower-kebab-case, unique across the catalog. */
  id: string;
  cadence: QuestCadence;
  track: QuestTrack;
  /** Personal quests can be class-locked; omit for class-agnostic personal quests and all community quests. */
  class?: CharacterClass;
  /** Minimum tier for this template to be eligible for assignment. Omit to allow all tiers. */
  minTier?: CharacterTier;
  /** RPG-flavored title shown in UI. */
  title: string;
  /** Short narrative description / flavor text. */
  flavor: string;
  condition: QuestCondition;
  reward: QuestReward;
}

// ---------- Achievements (§4.2) ----------

export type AchievementKind = 'single_effort' | 'cumulative';

export type AchievementCategory =
  | 'distance'
  | 'elevation'
  | 'duration'
  | 'activity_count'
  | 'streak'
  | 'variety'
  | 'personal_record'
  | 'level';

// Rewards are looked up from GAME_CONFIG.ACHIEVEMENT_REWARD_TIERS.
export type AchievementRewardTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export type AchievementMetric =
  // Single-effort (single activity meets ≥ value):
  | 'single_activity_distance_km'
  | 'single_activity_elevation_m'
  | 'single_activity_duration_min'
  // Cumulative (summed across the player's lifetime):
  | 'total_distance_km'
  | 'total_elevation_m'
  | 'total_duration_min'
  | 'total_activity_count'
  | 'activity_type_variety'
  | 'streak_days'
  | 'longest_streak_days'
  | 'level_reached';

// ---------- Shop Items (§5.2) ----------

export type ShopItemKind = 'consumable' | 'cosmetic';

export type ShopItemCategory =
  | 'streak_protection'
  | 'xp_enhancement'
  | 'gold_enhancement'
  | 'loot_enhancement'
  | 'duration_bonus'
  | 'elevation_bonus'
  | 'helmet'
  | 'armor'
  | 'boots'
  | 'weapon'
  | 'accessory';

export interface ShopItem {
  /**
   * Stable ID — for consumables this MUST match the key in
   * GAME_CONFIG.CONSUMABLES (e.g. "xpBoost"). The config is the single
   * source of truth for price / stackMax / effect values.
   */
  id: string;
  kind: ShopItemKind;
  category: ShopItemCategory;
  name: string;
  description: string;
  flavor: string;
}

// ---------- Pet Species (§9) ----------

export type PetRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export type PetBuffType =
  | 'xp_bonus' //                % bonus on all activities
  | 'gold_bonus' //              % bonus to gold earned
  | 'drop_chance_bonus' //       % additive bonus to bonus-drop chance
  | 'elevation_xp_bonus' //      % bonus on XP derived from elevation
  | 'streak_grace_bonus' //      flat +N to max stored grace days
  | 'class_xp_bonus'; //         % bonus on activities matching `class`

export interface PetBuff {
  type: PetBuffType;
  /**
   * Value applied by the backend. For % buffs this is a multiplier delta
   * (0.05 = +5%). For `streak_grace_bonus` it's an integer added to the cap.
   */
  value: number;
  /** Required for `class_xp_bonus`; ignored otherwise. */
  class?: CharacterClass;
}

export interface PetSpecies {
  /** Stable ID — lower-kebab-case. */
  id: string;
  name: string;
  rarity: PetRarity;
  buff: PetBuff;
  /** Three evolution-stage descriptions (visual only — buff does not change). */
  stageDescriptions: [string, string, string];
  /** One-paragraph lore / flavor for the designer and UI. */
  flavor: string;
}

export interface AchievementDefinition {
  /** Stable ID — lower-kebab-case, unique across the catalog. */
  id: string;
  kind: AchievementKind;
  category: AchievementCategory;
  name: string;
  description: string;
  metric: AchievementMetric;
  /** Threshold for the metric; achievement unlocks when metric ≥ value. */
  value: number;
  /**
   * Restrict the metric to specific Strava activity types (e.g. ["Run"]).
   * Omit for a metric that spans all activity types.
   */
  activityTypes?: string[];
  rewardTier: AchievementRewardTier;
}
