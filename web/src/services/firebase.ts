import { functions } from '@/lib/firebaseConfig'
import { httpsCallable } from 'firebase/functions'
import type { GameProfile, UserProfile, StravaActivity } from '@shared/types'
import {
  cacheActivities,
  getCachedActivities,
  invalidateActivitiesCache,
  cacheGameProfile,
  getCachedGameProfile,
  invalidateGameProfileCache,
  cacheUserProfile,
  getCachedUserProfile,
} from './cache'

// Define callable functions
const getUserProfileFunction = httpsCallable(functions, 'getUserProfile')
const getGameProfileFunction = httpsCallable(functions, 'getGameProfile')
const getUserActivitiesFunction = httpsCallable(functions, 'getUserActivities')
const fetchStravaActivitiesFunction = httpsCallable(functions, 'fetchStravaActivities')
const exchangeCodeForTokenFunction = httpsCallable(functions, 'exchangeCodeForToken')

// User Profile
export async function getUserProfile(useCache = true): Promise<UserProfile> {
  if (useCache) {
    const cached = getCachedUserProfile()
    if (cached) return cached
  }

  const result = await getUserProfileFunction()
  const profile = (result.data as any).profile
  cacheUserProfile(profile)
  return profile
}

// Game Profile
export async function getGameProfile(useCache = true): Promise<GameProfile> {
  if (useCache) {
    const cached = getCachedGameProfile()
    if (cached) return cached
  }

  const result = await getGameProfileFunction()
  const game = (result.data as any).game
  cacheGameProfile(game)
  return game
}

// Activities
export async function getUserActivities(
  page = 1,
  perPage = 10,
  useCache = true
): Promise<StravaActivity[]> {
  if (useCache && page === 1) {
    const cached = getCachedActivities()
    if (cached) return cached
  }

  const result = await getUserActivitiesFunction({ page, perPage })
  const activities = (result.data as any).activities

  if (page === 1) {
    cacheActivities(activities)
  }

  return activities
}

// Sync Strava Activities
export async function syncStravaActivities(page = 1, perPage = 3): Promise<StravaActivity[]> {
  const result = await fetchStravaActivitiesFunction({ page, perPage })
  const activities = (result.data as any).activities

  // Invalidate caches after sync
  invalidateActivitiesCache()
  invalidateGameProfileCache()

  return activities
}

// Exchange Strava Code
export async function exchangeStravaCode(code: string): Promise<void> {
  await exchangeCodeForTokenFunction({ code })
}
