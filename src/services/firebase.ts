import { functions, auth } from '../../firebaseConfig';
import { httpsCallable } from 'firebase/functions';
import { StravaAuthData, ProfileResponse, UserStats, GameProfileResponse, GetActivitiesResponse } from '../types';
import {
  getCachedActivities,
  cacheActivities,
  getCachedGameProfile,
  cacheGameProfile,
  getCachedUserProfile,
  cacheUserProfile,
  invalidateActivitiesCache,
  invalidateGameProfileCache
} from './cache';

/**
 * Exchanges Strava authorization code for access token via Firebase Function
 * Requires user to be authenticated
 * @param code - The authorization code from Strava OAuth
 * @returns Promise with Strava auth data
 */
export const exchangeStravaCode = async (code: string): Promise<StravaAuthData> => {
  // Check if user is authenticated
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated to connect Strava');
  }

  const callExchangeCodeFunction = httpsCallable(functions, 'exchangeCodeForToken');

  try {
    console.log("📞 Calling Firebase Function with code for user:", currentUser.email);
    const result = await callExchangeCodeFunction({ code });
    console.log("✅ Firebase Function success!");

    return result.data as StravaAuthData;
  } catch (error: any) {
    console.error("❌ Firebase Function error:", error);

    // Handle specific error cases
    if (error.code === 'functions/unauthenticated') {
      throw new Error('Authentication required. Please sign in again.');
    }

    throw error;
  }
};

/**
 * Gets user profile from Firestore with caching
 * Requires user to be authenticated
 */
export const getUserProfile = async (useCache = true): Promise<ProfileResponse> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated');
  }

  // Try cache first if enabled
  if (useCache) {
    const cached = await getCachedUserProfile();
    if (cached) {
      return { status: 'success', profile: cached };
    }
  }

  const getUserProfileFunction = httpsCallable<void, ProfileResponse>(functions, 'getUserProfile');

  try {
    const result = await getUserProfileFunction();
    // Cache the result
    if (result.data.profile) {
      await cacheUserProfile(result.data.profile);
    }
    return result.data;
  } catch (error: any) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

/**
 * Updates user profile
 * Requires user to be authenticated
 */
export const updateUserProfile = async (displayName: string) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated');
  }

  const updateUserProfileFunction = httpsCallable(functions, 'updateUserProfile');

  try {
    const result = await updateUserProfileFunction({ displayName });
    return result.data;
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Gets user's stored activities from Firestore with caching
 * Requires user to be authenticated
 * @param page - Page number for pagination
 * @param perPage - Number of activities per page
 * @param useCache - Whether to use cached data if available (default: true)
 */
export const getUserActivities = async (page = 1, perPage = 30, useCache = true): Promise<GetActivitiesResponse> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated');
  }

  // Only use cache for first page
  if (useCache && page === 1) {
    const cached = await getCachedActivities();
    if (cached) {
      return { status: 'success', activities: cached };
    }
  }

  const getUserActivitiesFunction = httpsCallable<{ page: number; perPage: number }, GetActivitiesResponse>(
    functions,
    'getUserActivities'
  );

  try {
    console.log("📞 Fetching user activities from Firestore...");
    const result = await getUserActivitiesFunction({ page, perPage });
    console.log("✅ Got activities");

    // Cache first page of activities
    if (page === 1 && result.data.activities) {
      await cacheActivities(result.data.activities);
    }

    return result.data;
  } catch (error: any) {
    console.error("❌ Error fetching activities:", error);
    throw error;
  }
};

/**
 * Syncs activities from Strava and stores them in Firestore
 * Invalidates activities cache to force refresh
 * Requires user to be authenticated and connected to Strava
 */
export const syncStravaActivities = async (page = 1, perPage = 30): Promise<GetActivitiesResponse> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated');
  }

  const getActivitiesFunction = httpsCallable<{ page: number; perPage: number }, GetActivitiesResponse>(
    functions,
    'fetchStravaActivities'
  );

  try {
    console.log("📞 Syncing Strava activities...");
    const result = await getActivitiesFunction({ page, perPage });
    console.log("✅ Synced activities");

    // Invalidate caches since we have new data
    await invalidateActivitiesCache();
    await invalidateGameProfileCache();

    return result.data;
  } catch (error: any) {
    console.error("❌ Error syncing activities:", error);
    throw error;
  }
};

/**
 * Gets user stats from Firestore via user profile
 * Requires user to be authenticated
 */
export const getUserStats = async (): Promise<UserStats | null> => {
  const profile = await getUserProfile();
  return profile?.profile?.stats || null;
};

/**
 * Gets user's game profile including level, XP, and tier with caching
 * Requires user to be authenticated
 * @param useCache - Whether to use cached data if available (default: true)
 */
export const getGameProfile = async (useCache = true): Promise<GameProfileResponse> => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User must be authenticated');
  }

  // Try cache first if enabled
  if (useCache) {
    const cached = await getCachedGameProfile();
    if (cached) {
      return { status: "success", game: cached };
    }
  }

  const getGameProfileFunction = httpsCallable<void, GameProfileResponse>(functions, 'getGameProfile');

  try {
    console.log("📞 Fetching game profile...");
    const result = await getGameProfileFunction();
    console.log("✅ Got game profile:", result.data);

    // Cache the game profile
    if (result.data.game) {
      await cacheGameProfile(result.data.game);
    }

    return result.data as GameProfileResponse;
  } catch (error: any) {
    console.error("❌ Error fetching game profile:", error);
    throw error;
  }
};
