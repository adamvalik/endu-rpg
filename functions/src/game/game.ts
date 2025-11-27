import * as logger from 'firebase-functions/logger';
import { db } from '../admin';
import { FIRESTORE_COLLECTIONS } from '../config';
import { Timestamp } from 'firebase-admin/firestore';
import {
  StravaActivity,
  GameProfile,
  CharacterTier,
  DailyQuest,
  DailyQuestType,
  XPCalculationResult,
} from '../types';
import { GAME_CONFIG, DAILY_QUESTS } from './game.config';

// ============================================================================
// LEVEL CALCULATION
// ============================================================================

/**
 * Calculates XP required for a given level
 * Formula: Base × (Level)^1.5
 */
export function getXPRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(GAME_CONFIG.LEVEL_BASE_XP * Math.pow(level, GAME_CONFIG.LEVEL_EXPONENT));
}

/**
 * Calculates current level and XP progress based on total XP
 */
export function calculateLevel(totalXP: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
} {
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
  if (level >= 20) return 'Master';
  if (level >= 10) return 'Expert';
  if (level >= 5) return 'Apprentice';
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
): { streakCount: number; streakActive: boolean } {
  if (!lastActivityDate) {
    // First activity
    return { streakCount: 1, streakActive: false };
  }

  const lastDate = lastActivityDate.toDate();
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
// DAILY QUESTS
// ============================================================================

/**
 * Gets active daily quests for a given day
 */
export function getActiveDailyQuests(date: Date): DailyQuest[] {
  const dayOfWeek = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  return DAILY_QUESTS.filter((quest) => quest.activeDays.includes(dayOfWeek));
}

/**
 * Checks which daily quests are completed by an activity
 */
export function checkDailyQuests(
  activity: StravaActivity,
  activityDate: Date,
  completedQuestsToday: string[],
): { completedQuests: DailyQuestType[]; bonusXP: number } {
  const activeQuests = getActiveDailyQuests(activityDate);
  const newlyCompleted: DailyQuestType[] = [];
  let bonusXP = 0;

  for (const quest of activeQuests) {
    // Skip if already completed today
    if (completedQuestsToday.includes(quest.id)) {
      continue;
    }

    // Check if activity meets requirements
    let completed = true;

    if (quest.requirement.distance) {
      completed = completed && activity.distance >= quest.requirement.distance;
    }

    if (quest.requirement.elevation) {
      completed = completed && activity.total_elevation_gain >= quest.requirement.elevation;
    }

    if (completed) {
      newlyCompleted.push(quest.id);
      bonusXP += quest.reward;
      logger.info(`Quest completed: ${quest.name} (+${quest.reward} XP)`);
    }
  }

  return { completedQuests: newlyCompleted, bonusXP };
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
  const distanceKm = activity.distance / 1000;

  // Determine XP multiplier based on activity type
  let xpPerKm: number;

  if (GAME_CONFIG.RUNNING_TYPES.includes(activity.type)) {
    xpPerKm = GAME_CONFIG.XP_PER_KM_RUN;
  } else if (GAME_CONFIG.CYCLING_TYPES.includes(activity.type)) {
    xpPerKm = GAME_CONFIG.XP_PER_KM_RIDE;
  } else {
    // Default to walking pace for other activities
    xpPerKm = GAME_CONFIG.XP_PER_KM_RUN;
  }

  // Calculate distance XP
  const distanceXP = distanceKm * xpPerKm;

  // Add elevation bonus
  const elevationXP = (activity.total_elevation_gain / 10) * GAME_CONFIG.XP_PER_10M_ELEVATION;

  return Math.floor(distanceXP + elevationXP);
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
      questBonus: 0,
      totalXP: 0,
      completedQuests: [],
      capped: false,
    };
  }

  // Get user's game profile
  const userRef = db.collection(FIRESTORE_COLLECTIONS.USERS).doc(userId);
  const userDoc = await userRef.get();
  const gameProfile = userDoc.data()?.game as GameProfile | undefined;

  // Calculate base XP
  let baseXP = calculateBaseXP(activity);

  // Check daily XP cap
  const activityDate = new Date(activity.start_date);
  const today = new Date();
  const isToday =
    activityDate.getDate() === today.getDate() &&
    activityDate.getMonth() === today.getMonth() &&
    activityDate.getFullYear() === today.getFullYear();

  let dailyXPEarned = gameProfile?.dailyXPEarned || 0;

  // Reset daily XP if it's a new day
  const lastResetDate = gameProfile?.dailyXPResetDate?.toDate();
  if (
    !lastResetDate ||
    lastResetDate.getDate() !== today.getDate() ||
    lastResetDate.getMonth() !== today.getMonth() ||
    lastResetDate.getFullYear() !== today.getFullYear()
  ) {
    dailyXPEarned = 0;
  }

  // Apply streak bonus
  let streakBonus = 0;
  if (gameProfile?.streakActive) {
    streakBonus = Math.floor(baseXP * (GAME_CONFIG.STREAK_BONUS_MULTIPLIER - 1));
    logger.info(`Streak bonus applied: +${streakBonus} XP`);
  }

  // Check daily quests
  const completedQuestsToday = gameProfile?.completedQuestsToday || [];
  const { completedQuests, bonusXP: questBonus } = checkDailyQuests(
    activity,
    activityDate,
    completedQuestsToday,
  );

  // Calculate total XP
  let totalXP = baseXP + streakBonus + questBonus;

  // Apply daily cap
  let capped = false;
  if (isToday && dailyXPEarned + totalXP > GAME_CONFIG.DAILY_XP_CAP) {
    const xpBeforeCap = totalXP;
    totalXP = Math.max(0, GAME_CONFIG.DAILY_XP_CAP - dailyXPEarned);
    capped = true;
    logger.warn(`Daily XP cap applied: ${xpBeforeCap} XP reduced to ${totalXP} XP`);
  }

  return {
    baseXP,
    streakBonus,
    questBonus,
    totalXP,
    completedQuests,
    capped,
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

  // Update completed quests
  const today = new Date();
  const questResetDate = currentGame?.questResetDate?.toDate();
  const isNewDay =
    !questResetDate ||
    questResetDate.getDate() !== today.getDate() ||
    questResetDate.getMonth() !== today.getMonth() ||
    questResetDate.getFullYear() !== today.getFullYear();

  const completedQuestsToday = isNewDay
    ? xpResult.completedQuests
    : [...(currentGame?.completedQuestsToday || []), ...xpResult.completedQuests];

  // Calculate daily XP
  const dailyXPResetDate = currentGame?.dailyXPResetDate?.toDate();
  const isDailyReset =
    !dailyXPResetDate ||
    dailyXPResetDate.getDate() !== today.getDate() ||
    dailyXPResetDate.getMonth() !== today.getMonth() ||
    dailyXPResetDate.getFullYear() !== today.getFullYear();

  const dailyXPEarned = isDailyReset
    ? xpResult.totalXP
    : (currentGame?.dailyXPEarned || 0) + xpResult.totalXP;

  // Check for level up
  const oldLevel = currentGame?.level || 1;
  if (level > oldLevel) {
    logger.info(`🎉 User ${userId} leveled up! ${oldLevel} → ${level}`);
  }

  // Update game profile
  const updatedGame: GameProfile = {
    totalXP: newTotalXP,
    level,
    currentLevelXP,
    nextLevelXP,
    streakCount,
    streakActive,
    lastActivityDate: Timestamp.fromDate(activityDate),
    dailyXPEarned,
    dailyXPResetDate: Timestamp.now(),
    tier: getCharacterTier(level),
    completedQuestsToday,
    questResetDate: isNewDay ? Timestamp.now() : currentGame?.questResetDate || Timestamp.now(),
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
    dailyXPEarned: 0,
    tier: 'Novice',
    completedQuestsToday: [],
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
 * Gets user's game profile and active daily quests
 */
export const getGameProfile = onCall(
  async (
    request,
  ): Promise<{
    status: string;
    game: GameProfile;
    activeQuests: DailyQuest[];
  }> => {
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
          activeQuests: getActiveDailyQuests(new Date()),
        };
      }

      return {
        status: 'success',
        game,
        activeQuests: getActiveDailyQuests(new Date()),
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
