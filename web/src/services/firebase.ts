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
    invalidateUserProfileCache,
} from './cache'

// Define callable functions
const getUserProfileFunction = httpsCallable(functions, 'getUserProfile')
const getGameProfileFunction = httpsCallable(functions, 'getGameProfile')
const getUserActivitiesFunction = httpsCallable(functions, 'getUserActivities')
const fetchStravaActivitiesFunction = httpsCallable(functions, 'fetchStravaActivities')
const exchangeCodeForTokenFunction = httpsCallable(functions, 'exchangeCodeForToken')
const addDebugXPFunction = httpsCallable(functions, 'addDebugXP')

// User Profile
export async function getUserProfile(useCache = true): Promise<UserProfile> {
    try {
        if (useCache) {
            const cached = getCachedUserProfile()
            if (cached) return cached
        }

        const result = await getUserProfileFunction()
        const profile = (result.data as any).profile
        cacheUserProfile(profile)
        return profile
    } catch (error) {
        console.error('Error fetching user profile:', error)
        throw error instanceof Error ? error : new Error(String(error))
    }
}

// Game Profile
export async function getGameProfile(useCache = true): Promise<GameProfile> {
    try {
        if (useCache) {
            const cached = getCachedGameProfile()
            if (cached) return cached
        }

        const result = await getGameProfileFunction()
        const game = (result.data as any).game
        cacheGameProfile(game)
        return game
    } catch (error) {
        console.error('Error fetching game profile:', error)
        throw error instanceof Error ? error : new Error(String(error))
    }
}

// Activities
export async function getUserActivities(
    page = 1,
    perPage = 10,
    useCache = true
): Promise<StravaActivity[]> {
    try {
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
    } catch (error) {
        console.error('Error fetching activities:', error)
        throw error instanceof Error ? error : new Error(String(error))
    }
}

// Sync Strava Activities
export async function syncStravaActivities(page = 1, perPage = 3): Promise<StravaActivity[]> {
    try {
        const result = await fetchStravaActivitiesFunction({ page, perPage })
        const activities = (result.data as any).activities

        // Invalidate caches after sync
        invalidateActivitiesCache()
        invalidateGameProfileCache()
        invalidateUserProfileCache()

        return activities
    } catch (error) {
        console.error('Error syncing Strava activities:', error)
        throw error instanceof Error ? error : new Error(String(error))
    }
}

// Exchange Strava Code
export async function exchangeStravaCode(code: string): Promise<void> {
    await exchangeCodeForTokenFunction({ code })

    // Invalidate cache after connecting Strava
    invalidateUserProfileCache()
}

// Debug Methods
export async function addDebugXP(xpToAdd: number): Promise<void> {
    try {
        await addDebugXPFunction({ xpToAdd })

        // Invalidate cache so the UI fetches fresh data
        invalidateGameProfileCache()
        invalidateUserProfileCache()
    } catch (error) {
        console.error('Error adding debug XP:', error)
        throw error instanceof Error ? error : new Error(String(error))
    }
}
