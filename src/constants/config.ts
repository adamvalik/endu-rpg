// Strava configuration constants
export const STRAVA_CONFIG = {
  CLIENT_ID: "183955",
  REDIRECT_SCHEME: "endurpg",
  REDIRECT_PATH: "auth",
  SCOPES: ['activity:read_all'],
};

// Strava discovery endpoints
export const STRAVA_DISCOVERY = {
  authorizationEndpoint: 'https://www.strava.com/oauth/mobile/authorize',
  tokenEndpoint: 'https://www.strava.com/oauth/token',
};
