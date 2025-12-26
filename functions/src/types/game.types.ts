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
  tier: CharacterTier; // Character tier based on level
}

export interface XPCalculationResult {
  baseXP: number; // XP before any bonuses
  streakBonus: number; // XP from streak multiplier
  totalXP: number; // Final XP awarded
}

export interface CalculatedLevel {
  level: number; // Current level
  currentLevelXP: number; // XP accumulated in current level
  nextLevelXP: number; // XP required for next level
}

export interface StreakCalculationResult {
  streakCount: number; // Updated streak count
  streakActive: boolean; // Whether streak bonus is active
}

export interface GameProfileResponse {
  status: string;
  game: GameProfile;
}

