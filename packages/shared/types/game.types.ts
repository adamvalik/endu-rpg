export type CharacterTier =
  | 'wanderer'
  | 'scout'
  | 'ranger'
  | 'warrior'
  | 'champion'
  | 'hero'
  | 'legend'
  | 'mythic';

export interface GameProfile {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  streakCount: number;
  streakActive: boolean;
  lastActivityDate?: any;
  tier: CharacterTier;
}

export interface GameProfileResponse {
  status: 'success';
  game: GameProfile;
}
