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
}

export interface XPCalculationResult {
  baseXP: number; // XP before any bonuses
  streakBonus: number; // XP from streak multiplier
  totalXP: number; // Final XP awarded
  capped: boolean; // Whether daily cap was applied
}
