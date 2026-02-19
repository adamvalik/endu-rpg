const CACHE_KEYS = {
  ACTIVITIES: 'cached_activities',
  GAME_PROFILE: 'cached_game_profile',
  USER_PROFILE: 'cached_user_profile',
}

const CACHE_DURATION = {
  ACTIVITIES: 5 * 60 * 1000, // 5 minutes
  GAME_PROFILE: 2 * 60 * 1000, // 2 minutes
  USER_PROFILE: 5 * 60 * 1000, // 5 minutes
}

interface CachedData<T> {
  data: T
  timestamp: number
}

function isCacheValid(timestamp: number, duration: number): boolean {
  return Date.now() - timestamp < duration
}

export function cacheData<T>(key: string, data: T): void {
  const cacheData: CachedData<T> = { data, timestamp: Date.now() }
  localStorage.setItem(key, JSON.stringify(cacheData))
}

export function getCachedData<T>(key: string, duration: number): T | null {
  const cached = localStorage.getItem(key)
  if (!cached) return null

  const cacheData: CachedData<T> = JSON.parse(cached)
  if (!isCacheValid(cacheData.timestamp, duration)) {
    localStorage.removeItem(key)
    return null
  }

  return cacheData.data
}

export function invalidateCache(key: string): void {
  localStorage.removeItem(key)
}

export function clearAllCaches(): void {
  Object.values(CACHE_KEYS).forEach(key => localStorage.removeItem(key))
}

// Convenience functions
export const cacheActivities = (data: any) => cacheData(CACHE_KEYS.ACTIVITIES, data)
export const getCachedActivities = () => getCachedData<any>(CACHE_KEYS.ACTIVITIES, CACHE_DURATION.ACTIVITIES)
export const invalidateActivitiesCache = () => invalidateCache(CACHE_KEYS.ACTIVITIES)

export const cacheGameProfile = (data: any) => cacheData(CACHE_KEYS.GAME_PROFILE, data)
export const getCachedGameProfile = () => getCachedData<any>(CACHE_KEYS.GAME_PROFILE, CACHE_DURATION.GAME_PROFILE)
export const invalidateGameProfileCache = () => invalidateCache(CACHE_KEYS.GAME_PROFILE)

export const cacheUserProfile = (data: any) => cacheData(CACHE_KEYS.USER_PROFILE, data)
export const getCachedUserProfile = () => getCachedData<any>(CACHE_KEYS.USER_PROFILE, CACHE_DURATION.USER_PROFILE)
export const invalidateUserProfileCache = () => invalidateCache(CACHE_KEYS.USER_PROFILE)
