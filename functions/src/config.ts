export const STRAVA_CONFIG = {
  TOKEN_URL: "https://www.strava.com/oauth/token",
  API_BASE_URL: "https://www.strava.com/api/v3",
  DEAUTHORIZE_URL: "https://www.strava.com/oauth/deauthorize",
  PUSH_SUBSCRIPTION_URL: "https://www.strava.com/api/v3/push_subscriptions",
};

export const FIRESTORE_COLLECTIONS = {
  USERS: "users",
  STRAVA_TOKENS: "stravaTokens",
  STRAVA_ACTIVITIES: "stravaActivities",
};

export const getStravaCredentials = () => {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Strava credentials not configured in environment");
  }

  return { clientId, clientSecret };
};
