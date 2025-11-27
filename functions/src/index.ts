// Export authentication functions
export { signUpOrLogIn } from "./user_management/auth";

// Export Strava functions
export {
  exchangeCodeForToken,
  fetchStravaActivities,
  getUserActivities,
  disconnectStrava,
} from "./strava/strava";

// Export user management functions
export { getUserProfile, updateUserProfile, deleteUserAccount } from "./user_management/user";

// Export webhook functions
export { stravaWebhook } from "./strava/webhooks";

// Export game functions
export { getGameProfile } from "./game/game";
