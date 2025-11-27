export interface StravaAthlete {
  id: number;
  firstname: string;
  lastname: string;
}

export interface StravaAuthData {
  status: string;
  data: {
    athlete: StravaAthlete;
    access_token: string;
  };
}

export interface MockStravaOAuthResponse {
  type: 'success',
  params: {
    code: string
  }
}

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
  xpEarned?: number; // XP earned from this activity
}

export interface GetActivitiesResponse {
  status: 'success';
  activities: StravaActivity[];
}
