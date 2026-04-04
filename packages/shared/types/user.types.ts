import type { GameProfile } from './game.types';
import type { UserStats } from './stats.types';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string | null;
  stravaId?: number;
  stravaConnected: boolean;
  stravaFirstname?: string;
  stravaLastname?: string;
  stats?: UserStats;
  game?: GameProfile;
  createdAt: any;
  updatedAt: any;
}

export interface ProfileResponse {
  status: 'success';
  profile: UserProfile;
}
