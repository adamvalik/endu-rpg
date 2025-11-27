import { Timestamp } from "firebase-admin/firestore";

// Strava OAuth types
export interface StravaAthlete {
  id: number;
  firstname: string;
  lastname: string;
  profile?: string;
  city?: string;
  state?: string;
  country?: string;
  sex?: string;
  summit?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StravaTokenExchangeResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: StravaAthlete;
}

export interface StravaRefreshTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
}

export interface StravaTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  lastUpdated: Timestamp;
}

export interface ExchangeCodeData {
  code: string;
}

export interface ExchangeCodeResponse {
  status: "success";
  data: {
    athlete: {
      id: number;
      firstname: string;
      lastname: string;
    };
    access_token: string; // For backward compatibility
  };
}

// Strava Activity types
export interface StravaActivityMap {
  id: string;
  summary_polyline: string;
}

export interface StravaActivity {
  id: number;
  name: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  total_elevation_gain: number; // meters
  type: string; // e.g., "Ride", "Run", "Swim"
  sport_type: string; // e.g., "MountainBikeRide", "TrailRun"
  start_date: string; // ISO 8601 format
  start_date_local: string; // ISO 8601 format
  timezone: string;
  average_speed: number; // meters per second
  max_speed: number; // meters per second
  average_cadence?: number;
  average_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  device_watts?: boolean;
  has_heartrate: boolean;
  average_heartrate?: number;
  max_heartrate?: number;
  max_watts?: number;
  athlete_count: number;
  commute: boolean;
  manual: boolean;
  private: boolean;
  map?: StravaActivityMap;
  xpEarned?: number; // Custom field for XP earned
}

export interface StoredActivity extends StravaActivity {
  userId: string;
  fetchedAt: Timestamp;
  updatedAt: Timestamp;
}

export interface GetActivitiesData {
  page?: number;
  perPage?: number;
}

export interface GetActivitiesResponse {
  status: "success";
  activities: StravaActivity[];
}

export interface GetActivityByIdData {
  activityId: number;
}

export interface GetActivityByIdResponse {
  status: "success";
  activity: StravaActivity;
  isNew: boolean; // Whether this was a new activity or already existed
}

// Strava Webhook types
export interface StravaWebhookEvent {
  object_id: number; // activity ID OR athlete ID
  object_type: string; // "activity" OR "athlete"
  aspect_type: string; // "create", "update" OR "delete"
  owner_id: number; // Strava athlete ID
  event_time: number; // Unix timestamp
  subscription_id: number;
  updates?: StravaWebhookUpdates;
}

export interface StravaWebhookUpdates {
  title?: string;
  type?: string;
  private?: boolean;
}
