// Strava configuration constants
export const STRAVA_CONFIG = {
  CLIENT_ID: "183955",
  REDIRECT_SCHEME: "endurancerpg",
  REDIRECT_PATH: "auth",
  SCOPES: ['activity:read_all'],
};

// Strava discovery endpoints
export const STRAVA_DISCOVERY = {
  authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
  tokenEndpoint: 'https://www.strava.com/oauth/token',
};

// Google Maps API configuration
export const GOOGLE_MAPS_CONFIG = {
  API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
};
