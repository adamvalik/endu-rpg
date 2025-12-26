import * as logger from 'firebase-functions/logger';
import { db } from '../admin';
import { FIRESTORE_COLLECTIONS } from '../config';
import { Timestamp } from 'firebase-admin/firestore';
import {
  StravaActivity,
  GameProfile,
  CharacterTier,
  XPCalculationResult,
  CalculatedLevel,
  StreakCalculationResult,
  GameProfileResponse,
} from '../types';
import { GAME_CONFIG } from './game.config';

// ============================================================================
// LEVEL CALCULATION
// ============================================================================

/**
 * Calculates XP required for a given level
 * Formula: A × L^2 + B × L (where L = level, A = steepness, B = linearity)
 */
export function getXPRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  const {A, B} = GAME_CONFIG.LEVELING;
  return Math.floor(A * Math.pow(level, 2) + B * level);
}

/**
 * Calculates current level and XP progress based on total XP
 */
export function calculateLevel(totalXP: number): CalculatedLevel {
  let level = 1;
  let xpForCurrentLevel = 0;

  // Find the current level
  while (true) {
    const xpForNextLevel = getXPRequiredForLevel(level + 1);
    if (totalXP < xpForNextLevel) {
      break;
    }
    xpForCurrentLevel = xpForNextLevel;
    level++;
  }

  const nextLevelXP = getXPRequiredForLevel(level + 1);
  const currentLevelXP = totalXP - xpForCurrentLevel;

  return {
    level,
    currentLevelXP,
    nextLevelXP: nextLevelXP - xpForCurrentLevel,
  };
}

/**
 * Determines character tier based on level
 */
export function getCharacterTier(level: number): CharacterTier {
  if (level >= 50) return 'Master';
  if (level >= 25) return 'Expert';
  if (level >= 10) return 'Apprentice';
  return 'Novice';
}

// ============================================================================
// STREAK SYSTEM
// ============================================================================

/**
 * Updates user's activity streak
 * Returns updated streak count and whether bonus is active
 */
export function updateStreak(
  lastActivityDate: Timestamp | undefined,
  currentStreakCount: number,
  currentActivityDate: Date,
): StreakCalculationResult {
  if (!lastActivityDate) {
    // First activity
    return { streakCount: 1, streakActive: false };
  }

  const lastDate = lastActivityDate.toDate();

  // getTime() returns milliseconds since epoch
  const daysDiff = Math.floor(
    (currentActivityDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysDiff === 0) {
    // Same day - maintain current streak
    return {
      streakCount: currentStreakCount,
      streakActive: currentStreakCount >= GAME_CONFIG.STREAK_THRESHOLD,
    };
  } else if (daysDiff === 1) {
    // Consecutive day - increment streak
    const newStreak = currentStreakCount + 1;
    return {
      streakCount: newStreak,
      streakActive: newStreak >= GAME_CONFIG.STREAK_THRESHOLD,
    };
  } else {
    // Streak broken
    return { streakCount: 1, streakActive: false };
  }
}

// ============================================================================
// XP CALCULATION
// ============================================================================

/**
 * Detects if activity speed is suspicious (anti-cheat)
 */
function isSuspiciousSpeed(activity: StravaActivity): boolean {
  if (activity.distance === 0 || activity.moving_time === 0) {
    return false; // Can't calculate speed
  }

  // Calculate speed in km/h
  const speedKmH = activity.distance / 1000 / (activity.moving_time / 3600);

  // Only check running activities
  if (GAME_CONFIG.RUNNING_TYPES.includes(activity.type)) {
    return speedKmH > GAME_CONFIG.MAX_SPEED_KMH;
  }

  return false;
}

/**
 * Calculates base XP from activity based on type and distance
 */
function calculateBaseXP(activity: StravaActivity): number {
  let activityXP = 0;

  // Distance-based activities
  if (activity.distance > 0) {
    const distanceKm = activity.distance / 1000;
    let xpPerKm: number;

    if (GAME_CONFIG.RUNNING_TYPES.includes(activity.type)) {
      xpPerKm = GAME_CONFIG.XP_PER_KM_RUN;
    } else if (GAME_CONFIG.WALKING_TYPES.includes(activity.type)) {
      xpPerKm = GAME_CONFIG.XP_PER_KM_WALK;
    } else if (GAME_CONFIG.XC_SKI_TYPES.includes(activity.type)) {
      xpPerKm = GAME_CONFIG.XP_PER_KM_XC_SKI;
    } else if (GAME_CONFIG.SKI_TYPES.includes(activity.type)) {
      xpPerKm = GAME_CONFIG.XP_PER_KM_SKI;
    } else if (GAME_CONFIG.CYCLING_TYPES.includes(activity.type)) {
      xpPerKm = GAME_CONFIG.XP_PER_KM_RIDE;
    } else if (GAME_CONFIG.SWIM_TYPES.includes(activity.type)) {
      xpPerKm = GAME_CONFIG.XP_PER_KM_SWIM;
    } else {
      // Default to yoga/other time-based
      xpPerKm = 0;
    }

    if (xpPerKm > 0) {
      activityXP = distanceKm * xpPerKm;
    }
  }

  // Time-based activities (if no distance or specific types)
  if (activityXP === 0 && activity.moving_time > 0) {
    const movingTimeMin = activity.moving_time / 60;

    if (GAME_CONFIG.WORKOUT_TYPES.includes(activity.type)) {
      activityXP = movingTimeMin * GAME_CONFIG.XP_PER_MIN_WORKOUT;
    } else if (GAME_CONFIG.YOGA_TYPES.includes(activity.type)) {
      activityXP = movingTimeMin * GAME_CONFIG.XP_PER_MIN_YOGA;
    }
  }

  // Add elevation bonus (applies to all activities)
  const elevationXP = activity.total_elevation_gain * GAME_CONFIG.XP_PER_M_ELEVATION;

  return Math.floor(activityXP + elevationXP);
}

/**
 * Main XP calculation with all bonuses and caps
 */
export async function calculateXP(
  userId: string,
  activity: StravaActivity,
): Promise<XPCalculationResult> {
  // Anti-cheat: Check for suspicious speed
  if (isSuspiciousSpeed(activity)) {
    logger.warn(`Suspicious speed detected for activity ${activity.id}, awarding 0 XP`);
    return {
      baseXP: 0,
      streakBonus: 0,
      totalXP: 0,
    };
  }

  // Get user's game profile
  const userRef = db.collection(FIRESTORE_COLLECTIONS.USERS).doc(userId);
  const userDoc = await userRef.get();
  const gameProfile = userDoc.data()?.game as GameProfile | undefined;

  // Calculate base XP
  let baseXP = calculateBaseXP(activity);

  // Apply streak bonus
  let streakBonus = 0;
  if (gameProfile?.streakActive) {
    streakBonus = Math.floor(baseXP * (GAME_CONFIG.STREAK_BONUS_MULTIPLIER - 1));
    logger.info(`Streak bonus applied: +${streakBonus} XP`);
  }

  // Calculate total XP
  let totalXP = baseXP + streakBonus;

  return {
    baseXP,
    streakBonus,
    totalXP
  };
}

// ============================================================================
// GAME PROFILE UPDATE
// ============================================================================

/**
 * Updates user's game profile with XP and progression
 */
export async function updateGameProfile(
  userId: string,
  activity: StravaActivity,
  xpResult: XPCalculationResult,
): Promise<void> {
  const userRef = db.collection(FIRESTORE_COLLECTIONS.USERS).doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    logger.error(`User ${userId} not found`);
    return;
  }

  const userData = userDoc.data();
  const currentGame = userData?.game as GameProfile | undefined;

  // Calculate new total XP
  const newTotalXP = (currentGame?.totalXP || 0) + xpResult.totalXP;

  // Calculate new level
  const { level, currentLevelXP, nextLevelXP } = calculateLevel(newTotalXP);

  // Update streak
  const activityDate = new Date(activity.start_date);
  const { streakCount, streakActive } = updateStreak(
    currentGame?.lastActivityDate,
    currentGame?.streakCount || 0,
    activityDate,
  );

  // Update game profile
  const updatedGame: GameProfile = {
    totalXP: newTotalXP,
    level,
    currentLevelXP,
    nextLevelXP,
    streakCount,
    streakActive,
    lastActivityDate: Timestamp.fromDate(activityDate),
    tier: getCharacterTier(level),
  };

  await userRef.update({
    game: updatedGame,
    updatedAt: Timestamp.now(),
  });

  logger.info(
    `Game profile updated for user ${userId}: ` +
      `+${xpResult.totalXP} XP (Total: ${newTotalXP}), ` +
      `Level ${level}, Streak: ${streakCount} days`,
  );
}

/**
 * Initializes game profile for new users
 */
export async function initializeGameProfile(userId: string): Promise<void> {
  const userRef = db.collection(FIRESTORE_COLLECTIONS.USERS).doc(userId);

  const initialGame: GameProfile = {
    totalXP: 0,
    level: 1,
    currentLevelXP: 0,
    nextLevelXP: getXPRequiredForLevel(2),
    streakCount: 0,
    streakActive: false,
    tier: 'Novice',
  };

  await userRef.update({
    game: initialGame,
    updatedAt: Timestamp.now(),
  });

  logger.info(`Initialized game profile for user ${userId}`);
}

// ============================================================================
// EXPORTED CLOUD FUNCTIONS
// ============================================================================

import { onCall, HttpsError } from 'firebase-functions/v2/https';

/**
 * Gets user's game profile
 */
export const getGameProfile = onCall(
  async (
    request,
  ): Promise<GameProfileResponse> => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated.');
    }

    const userId = request.auth.uid;

    try {
      const userDoc = await db.collection(FIRESTORE_COLLECTIONS.USERS).doc(userId).get();

      if (!userDoc.exists) {
        throw new HttpsError('not-found', 'User profile not found');
      }

      const game = userDoc.data()?.game as GameProfile;

      if (!game) {
        // Initialize game profile if it doesn't exist
        await initializeGameProfile(userId);
        const updatedDoc = await db.collection(FIRESTORE_COLLECTIONS.USERS).doc(userId).get();
        const initializedGame = updatedDoc.data()?.game as GameProfile;

        return {
          status: 'success',
          game: initializedGame,
        };
      }

      return {
        status: 'success',
        game,
      };
    } catch (error) {
      logger.error('Error getting game profile:', error);
      throw new HttpsError(
        'internal',
        'Failed to get game profile',
        error instanceof Error ? error.message : undefined,
      );
    }
  },
);
