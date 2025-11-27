export type CharacterTier = 'Novice' | 'Apprentice' | 'Expert' | 'Master';

export type DailyQuestType = 'DISTANCE_RUNNER' | 'HILL_CLIMBER' | 'WEEKEND_WARRIOR';

export interface DailyQuest {
  id: DailyQuestType;
  name: string;
  description: string;
  requirement: {
    distance?: number;
    elevation?: number;
  };
  reward: number;
  activeDays: number[];
}

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
  completedQuestsToday: string[];
  questResetDate?: any;
}

export interface GameProfileResponse {
  status: string;
  game: GameProfile;
  activeQuests: DailyQuest[];
}
