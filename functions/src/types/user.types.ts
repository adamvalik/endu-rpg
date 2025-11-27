import { Timestamp } from "firebase-admin/firestore";

// Authentication types
export interface SignUpOrLogInData {
  email: string;
  password: string;
  displayName?: string;
}

// User profile types
export interface UserStats {
  totalDistance: number; // Total distance in meters
  totalMovingTime: number; // Total moving time in seconds
  totalElevationGain: number; // Total elevation gain in meters
  activitiesCount: number; // Total number of activities
  lastActivityDate?: Timestamp; // Date of most recent activity
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string | null;
  stravaId?: number;
  stravaConnected: boolean;
  stravaFirstname?: string;
  stravaLastname?: string;
  stats?: UserStats;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UpdateProfileData {
  displayName?: string;
}
