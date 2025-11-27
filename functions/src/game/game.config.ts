import { DailyQuest } from '../types';

export const GAME_CONFIG = {
  // XP Multipliers per activity type
  XP_PER_KM_RUN: 10, // Running/Walking: 1 km = 10 XP
  XP_PER_KM_RIDE: 3, // Cycling: 1 km = 3 XP
  XP_PER_10M_ELEVATION: 1, // Elevation: 10m = 1 XP

  // Leveling formula: Base × (Level)^1.5
  LEVEL_BASE_XP: 500,
  LEVEL_EXPONENT: 1.5,

  // Streak system
  STREAK_THRESHOLD: 3, // Days needed to activate streak
  STREAK_BONUS_MULTIPLIER: 1.2, // +20% XP bonus

  // Anti-cheat
  MAX_SPEED_KMH: 25, // Max realistic running speed (km/h)
  DAILY_XP_CAP: 500, // Max XP per day

  // Activity type mappings
  RUNNING_TYPES: ['Run', 'VirtualRun', 'TrailRun'],
  CYCLING_TYPES: ['Ride', 'VirtualRide', 'EBikeRide', 'MountainBikeRide'],
};

export const DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'DISTANCE_RUNNER',
    name: 'Distance Runner',
    description: 'Log at least 5km',
    requirement: { distance: 5000 }, // 5km in meters
    reward: 50,
    activeDays: [1, 3, 5], // Mon, Wed, Fri
  },
  {
    id: 'HILL_CLIMBER',
    name: 'Hill Climber',
    description: 'Gain 50m elevation',
    requirement: { elevation: 50 }, // 50m elevation
    reward: 50,
    activeDays: [2, 4], // Tue, Thu
  },
  {
    id: 'WEEKEND_WARRIOR',
    name: 'Weekend Warrior',
    description: 'Log a 10km+ activity',
    requirement: { distance: 10000 }, // 10km in meters
    reward: 100,
    activeDays: [0, 6], // Sat, Sun
  },
];
