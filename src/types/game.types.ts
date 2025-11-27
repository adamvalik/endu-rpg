export type CharacterTier = 'Novice' | 'Apprentice' | 'Expert' | 'Master';

export interface GameProfile {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  streakCount: number;
  streakActive: boolean;
  lastActivityDate?: any;
  dailyXPEarned: number;
  dailyXPResetDate?: any;
  tier: CharacterTier;
}

export interface GameProfileResponse {
  status: 'success';
  game: GameProfile;
}
