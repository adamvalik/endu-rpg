import { UserStats } from './stats.types';
import { GameProfile } from './game.types';

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
