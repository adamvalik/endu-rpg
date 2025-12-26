export const GAME_CONFIG = {
  // Leveling formula: XP_required = A × L^2 + B × L
  LEVELING: {
    A: 100, // steepness coefficient
    B: 300, // linearity coefficient
  },

  // XP Multipliers per activity type
  XP_PER_M_ELEVATION: 2, // Elevation: 1m = 2 XP
  XP_PER_KM_RUN: 100, // Running: 1 km = 100 XP
  XP_PER_KM_WALK: 50, // Walk/Hike: 1 km = 50 XP
  XP_PER_KM_XC_SKI: 50, // XC Ski: 1 km = 50 XP
  XP_PER_KM_SKI: 10, // Downhill Ski: 1 km = 10 XP
  XP_PER_KM_RIDE: 25, // Cycling: 1 km = 25 XP
  XP_PER_KM_SWIM: 500, // Swimming: 1 km = 500 XP
  XP_PER_MIN_WORKOUT: 10, // Workout/Strength: 1 min = 10 XP
  XP_PER_MIN_YOGA: 5, // Yoga/Other: 1 min = 5 XP

  // Streak system
  STREAK_THRESHOLD: 3, // Days needed to activate streak
  STREAK_BONUS_MULTIPLIER: 1.2, // +20% XP bonus

  // Anti-cheat
  MAX_SPEED_KMH: 25, // Max realistic running speed (km/h)

  // Activity type mappings
  RUNNING_TYPES: ['Run', 'VirtualRun', 'TrailRun'],
  WALKING_TYPES: ['Walk', 'Hike'],
  CYCLING_TYPES: ['Ride', 'VirtualRide', 'EBikeRide', 'MountainBikeRide'],
  XC_SKI_TYPES: ['NordicSki', 'BackcountrySki'],
  SKI_TYPES: ['AlpineSki', 'Snowboard'],
  WORKOUT_TYPES: ['Workout', 'WeightTraining', 'Crossfit'],
  SWIM_TYPES: ['Swim'],
  YOGA_TYPES: ['Yoga', 'Elliptical', 'StairStepper', 'RockClimbing'],
};
