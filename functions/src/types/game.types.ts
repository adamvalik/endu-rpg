import { Timestamp } from "firebase-admin/firestore";

// Character progression types
export type CharacterTier = "Novice" | "Apprentice" | "Expert" | "Master";

export interface GameProfile {
  totalXP: number; // Total XP earned
  level: number; // Current character level
  currentLevelXP: number; // XP in current level
  nextLevelXP: number; // XP required for next level
  streakCount: number; // Consecutive days with activity
  streakActive: boolean; // Whether streak bonus is active (3+ days)
  lastActivityDate?: Timestamp; // Last activity date for streak tracking
  dailyXPEarned: number; // XP earned today (for daily cap)
  dailyXPResetDate?: Timestamp; // Date when daily XP counter was last reset
  tier: CharacterTier; // Character tier based on level
  completedQuestsToday: string[]; // Quest IDs completed today
  questResetDate?: Timestamp; // Date when quest list was last reset
}

// Daily quest types
export type DailyQuestType =
  | "DISTANCE_RUNNER"
  | "HILL_CLIMBER"
  | "WEEKEND_WARRIOR";

export interface DailyQuest {
  id: DailyQuestType;
  name: string;
  description: string;
  requirement: {
    distance?: number; // In meters
    elevation?: number; // In meters
  };
  reward: number; // Bonus XP
  activeDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
}

export interface XPCalculationResult {
  baseXP: number; // XP before any bonuses
  streakBonus: number; // XP from streak multiplier
  questBonus: number; // XP from completed quests
  totalXP: number; // Final XP awarded
  completedQuests: DailyQuestType[]; // Quests completed by this activity
  capped: boolean; // Whether daily cap was applied
}
