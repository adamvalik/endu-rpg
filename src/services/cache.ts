import AsyncStorage from '@react-native-async-storage/async-storage';
import { StravaActivity, GameProfile, UserProfile } from '../types';

const CACHE_KEYS = {
  ACTIVITIES: 'cached_activities',
  GAME_PROFILE: 'cached_game_profile',
  USER_PROFILE: 'cached_user_profile',
  ACTIVITIES_TIMESTAMP: 'cached_activities_timestamp',
  GAME_PROFILE_TIMESTAMP: 'cached_game_profile_timestamp',
  USER_PROFILE_TIMESTAMP: 'cached_user_profile_timestamp',
};

const CACHE_DURATION = {
  ACTIVITIES: 5 * 60 * 1000, // 5 minutes
  GAME_PROFILE: 2 * 60 * 1000, // 2 minutes
  USER_PROFILE: 5 * 60 * 1000, // 5 minutes
};

interface CachedData<T> {
  data: T;
  timestamp: number;
}

/**
 * Check if cached data is still valid
 */
const isCacheValid = (timestamp: number, duration: number): boolean => {
  return Date.now() - timestamp < duration;
};

/**
 * Cache activities
 */
export const cacheActivities = async (activities: StravaActivity[]): Promise<void> => {
  try {
    const cacheData: CachedData<StravaActivity[]> = {
      data: activities,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEYS.ACTIVITIES, JSON.stringify(cacheData));
    console.log('✅ Cached activities:', activities.length);
  } catch (error) {
    console.error('Error caching activities:', error);
  }
};

/**
 * Get cached activities if valid
 */
export const getCachedActivities = async (): Promise<StravaActivity[] | null> => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.ACTIVITIES);
    if (!cached) {
      console.log('No cached activities found');
      return null;
    }

    const cacheData: CachedData<StravaActivity[]> = JSON.parse(cached);

    if (isCacheValid(cacheData.timestamp, CACHE_DURATION.ACTIVITIES)) {
      console.log('✅ Using cached activities:', cacheData.data.length);
      return cacheData.data;
    }

    console.log('❌ Cached activities expired');
    return null;
  } catch (error) {
    console.error('Error reading cached activities:', error);
    return null;
  }
};

/**
 * Cache game profile
 */
export const cacheGameProfile = async (profile: GameProfile): Promise<void> => {
  try {
    const cacheData: CachedData<GameProfile> = {
      data: profile,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEYS.GAME_PROFILE, JSON.stringify(cacheData));
    console.log('✅ Cached game profile');
  } catch (error) {
    console.error('Error caching game profile:', error);
  }
};

/**
 * Get cached game profile if valid
 */
export const getCachedGameProfile = async (): Promise<GameProfile | null> => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.GAME_PROFILE);
    if (!cached) {
      return null;
    }

    const cacheData: CachedData<GameProfile> = JSON.parse(cached);

    if (isCacheValid(cacheData.timestamp, CACHE_DURATION.GAME_PROFILE)) {
      console.log('✅ Using cached game profile');
      return cacheData.data;
    }

    return null;
  } catch (error) {
    console.error('Error reading cached game profile:', error);
    return null;
  }
};

/**
 * Cache user profile
 */
export const cacheUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    const cacheData: CachedData<UserProfile> = {
      data: profile,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEYS.USER_PROFILE, JSON.stringify(cacheData));
    console.log('✅ Cached user profile');
  } catch (error) {
    console.error('Error caching user profile:', error);
  }
};

/**
 * Get cached user profile if valid
 */
export const getCachedUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEYS.USER_PROFILE);
    if (!cached) {
      return null;
    }

    const cacheData: CachedData<UserProfile> = JSON.parse(cached);

    if (isCacheValid(cacheData.timestamp, CACHE_DURATION.USER_PROFILE)) {
      console.log('✅ Using cached user profile');
      return cacheData.data;
    }

    return null;
  } catch (error) {
    console.error('Error reading cached user profile:', error);
    return null;
  }
};

/**
 * Invalidate activities cache (force refresh on next load)
 */
export const invalidateActivitiesCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CACHE_KEYS.ACTIVITIES);
    console.log('✅ Invalidated activities cache');
  } catch (error) {
    console.error('Error invalidating activities cache:', error);
  }
};

/**
 * Invalidate game profile cache (force refresh on next load)
 */
export const invalidateGameProfileCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CACHE_KEYS.GAME_PROFILE);
    console.log('✅ Invalidated game profile cache');
  } catch (error) {
    console.error('Error invalidating game profile cache:', error);
  }
};

/**
 * Clear all caches
 */
export const clearAllCaches = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      CACHE_KEYS.ACTIVITIES,
      CACHE_KEYS.GAME_PROFILE,
      CACHE_KEYS.USER_PROFILE,
    ]);
    console.log('✅ Cleared all caches');
  } catch (error) {
    console.error('Error clearing caches:', error);
  }
};
