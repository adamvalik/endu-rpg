import { onCall, HttpsError } from "firebase-functions/v2/https";
import { db } from "../admin";
import * as logger from "firebase-functions/logger";
import axios from "axios";
import {
  STRAVA_CONFIG,
  FIRESTORE_COLLECTIONS,
  getStravaCredentials,
} from "../config";
import {
  ExchangeCodeData,
  ExchangeCodeResponse,
  GetActivitiesData,
  GetActivitiesResponse,
  GetActivityByIdData,
  GetActivityByIdResponse,
  StravaActivity,
  StravaRefreshTokenResponse,
  StravaTokenExchangeResponse,
  StravaTokens,
  StoredActivity,
  SuccessResponse,
  UserStats
} from "../types";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { handleError } from "../handleError";
import { calculateXP, updateGameProfile } from "../game/game";

/**
 * Gets valid Strava access token for user, automatically refreshing if expired
 * @param userId - Firebase user ID
 * @returns Valid access token
 * @throws HttpsError if tokens not found or refresh fails
 */
export async function getValidStravaToken(userId: string): Promise<string> {
  const tokenDoc = await db
    .collection(FIRESTORE_COLLECTIONS.STRAVA_TOKENS)
    .doc(userId)
    .get();

  if (!tokenDoc.exists) {
    throw new HttpsError(
      "not-found",
      "Strava not connected. Please connect your Strava account first."
    );
  }

  let tokens = tokenDoc.data() as StravaTokens;
  const nowInSeconds = Math.floor(Date.now() / 1000);

  // Check if token is expired or about to expire (within 5 minutes)
  if (tokens.expiresAt <= nowInSeconds + 300) {
    logger.info(`Token expired for user ${userId}, refreshing...`);

    const { clientId, clientSecret } = getStravaCredentials();

    const params = {
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: tokens.refreshToken,
      grant_type: "refresh_token",
    };

    try {
      const response = await axios.post<StravaRefreshTokenResponse>(
        STRAVA_CONFIG.TOKEN_URL,
        null,
        { params }
      );

      const newTokenData = response.data;
      logger.info(`Token auto-refreshed for user: ${userId}`);

      const updatedTokens: StravaTokens = {
        accessToken: newTokenData.access_token,
        refreshToken: newTokenData.refresh_token,
        expiresAt: newTokenData.expires_at,
        lastUpdated: Timestamp.now(),
      };

      await db
        .collection(FIRESTORE_COLLECTIONS.STRAVA_TOKENS)
        .doc(userId)
        .set(updatedTokens);

      return updatedTokens.accessToken;
    } catch (error) {
      logger.error("Error auto-refreshing token:", error);
      throw new HttpsError(
        "failed-precondition",
        "Failed to refresh expired Strava token. Please reconnect your account."
      );
    }
  }

  return tokens.accessToken;
}

/**
 * Updates user's cumulative statistics based on activity data
 * @param userId - Firebase user ID
 * @param activity - Strava activity to add to stats
 * @param increment - Whether to increment (true) or decrement (false) stats
 */
export async function updateUserStats(
  userId: string,
  activity: StravaActivity,
  increment: boolean = true
): Promise<void> {
  const userRef = db.collection(FIRESTORE_COLLECTIONS.USERS).doc(userId);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new HttpsError("not-found", "User profile not found");
  }

  const currentStats = userDoc.data()?.stats as UserStats | undefined;
  const multiplier = increment ? 1 : -1;

  const updatedStats: UserStats = {
    totalDistance: (currentStats?.totalDistance || 0) + (activity.distance * multiplier),
    totalMovingTime: (currentStats?.totalMovingTime || 0) + (activity.moving_time * multiplier),
    totalElevationGain: (currentStats?.totalElevationGain || 0) + (activity.total_elevation_gain * multiplier),
    activitiesCount: (currentStats?.activitiesCount || 0) + (1 * multiplier),
    lastActivityDate: increment
      ? Timestamp.fromDate(new Date(activity.start_date))
      : currentStats?.lastActivityDate,
  };

  await userRef.update({
    stats: updatedStats,
    updatedAt: Timestamp.now(),
  });

  logger.info(
    `Updated stats for user ${userId}: ${increment ? 'added' : 'removed'} activity ${activity.id}`
  );
}

/**
 * Finds Firebase user ID by Strava athlete ID
 */
export async function getUserIdByStravaId(stravaId: number): Promise<string | null> {
  try {
    const usersSnapshot = await db
      .collection(FIRESTORE_COLLECTIONS.USERS)
      .where("stravaId", "==", stravaId)
      .limit(1)
      .get();

    if (usersSnapshot.empty) {
      return null;
    }

    return usersSnapshot.docs[0].id;
  } catch (error) {
    logger.error("Error finding user by Strava ID:", error);
    return null;
  }
}



/**
 * Processes and stores a Strava activity with game logic
 * Handles storing in Firestore, updating stats, and calculating XP
 * @param userId - Firebase user ID
 * @param activity - Strava activity data
 * @returns Whether the activity was newly stored (false if already exists)
 */
export async function processAndStoreActivity(
  userId: string,
  activity: StravaActivity
): Promise<boolean> {
  const activityRef = db
    .collection(FIRESTORE_COLLECTIONS.STRAVA_ACTIVITIES)
    .doc(`${userId}_${activity.id}`);

  const existingActivity = await activityRef.get();

  if (existingActivity.exists) {
    logger.info(
      `Activity ${activity.id} already exists for user ${userId}, skipping storage`
    );
    return false;
  }

  // Process game logic (XP, quests, streaks)
  const xpResult = await calculateXP(userId, activity);
  await updateGameProfile(userId, activity, xpResult);

  // Store activity in Firestore with XP earned
  const storedActivity: StoredActivity = {
    ...activity,
    xpEarned: xpResult.totalXP,
    userId,
    fetchedAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  await activityRef.set(storedActivity);
  logger.info(`Stored activity ${activity.id} for user ${userId} with ${xpResult.totalXP} XP`);

  // Update user's cumulative statistics
  await updateUserStats(userId, activity, true);

  return true;
}

/**
 * Fetches and stores a single Strava activity
 * Reusable helper function for both webhook and manual fetching
 * @param userId - Firebase user ID
 * @param activityId - Strava activity ID
 * @returns Object with activity data and whether it was newly created
 */
export async function fetchStravaActivity(
  userId: string,
  activityId: number
): Promise<{ activity: StravaActivity; isNew: boolean }> {
  // Check if activity already exists to prevent duplicates
  const activityRef = db
    .collection(FIRESTORE_COLLECTIONS.STRAVA_ACTIVITIES)
    .doc(`${userId}_${activityId}`);

  const existingActivity = await activityRef.get();

  if (existingActivity.exists) {
    logger.info(
      `Activity ${activityId} already exists for user ${userId}, skipping fetch`
    );
    return {
      activity: existingActivity.data() as StravaActivity,
      isNew: false,
    };
  }

  // Get valid access token (auto-refreshes if expired)
  const accessToken = await getValidStravaToken(userId);

  // Fetch activity from Strava API
  const response = await axios.get<StravaActivity>(
    `${STRAVA_CONFIG.API_BASE_URL}/activities/${activityId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        include_all_efforts: false,
      },
    }
  );

  const activity = response.data;
  logger.info(`Fetched activity ${activityId} for user ${userId}`);

  // Process and store the activity
  const isNew = await processAndStoreActivity(userId, activity);

  return {
    activity,
    isNew,
  };
}

/**
 * Exchanges Strava authorization code for access token
 */
export const exchangeCodeForToken = onCall(
  async (request): Promise<ExchangeCodeResponse> => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated to connect Strava."
      );
    }

    const userId = request.auth.uid;
    const { code } = request.data as ExchangeCodeData;

    if (!code || typeof code !== "string") {
      logger.error("Invalid code passed to function");
      throw new HttpsError(
        "invalid-argument",
        "A valid 'code' must be provided."
      );
    }

    logger.info(
      `User ${userId} exchanging code for token: ${code.substring(0, 5)}...`
    );

    try {
      const { clientId, clientSecret } = getStravaCredentials();

      // Exchange code for tokens
      const params = {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: "authorization_code",
      };

      const response = await axios.post<StravaTokenExchangeResponse>(
        STRAVA_CONFIG.TOKEN_URL,
        null,
        { params }
      );

      const tokenData = response.data;
      logger.info("Successfully exchanged code for token!");

      // Store tokens securely in Firestore
      const stravaTokens: StravaTokens = {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: tokenData.expires_at, // Unix timestamp (seconds since epoch)
        lastUpdated: Timestamp.now(),
      };

      await db.runTransaction(async (transaction) => {
        const tokenRef = db
          .collection(FIRESTORE_COLLECTIONS.STRAVA_TOKENS)
          .doc(userId);
        const userRef = db
          .collection(FIRESTORE_COLLECTIONS.USERS)
          .doc(userId);

        // Store tokens
        transaction.set(tokenRef, stravaTokens);

        // Update user profile with Strava info
        transaction.update(userRef, {
          stravaId: tokenData.athlete.id,
          stravaConnected: true,
          stravaFirstname: tokenData.athlete.firstname,
          stravaLastname: tokenData.athlete.lastname,
          updatedAt: Timestamp.now(),
        });
      });

      logger.info(`Strava tokens stored for user: ${userId}`);

      // Return athlete info
      return {
        status: "success",
        data: {
          athlete: {
            id: tokenData.athlete.id,
            firstname: tokenData.athlete.firstname,
            lastname: tokenData.athlete.lastname,
          },
          access_token: tokenData.access_token,
        },
      };
    } catch (error) {
      handleError(
        error,
        "Error exchanging code:",
        "Failed to exchange Strava code."
      );
    }
  }
);

/**
 * Disconnects Strava account from user profile
 * Revokes access tokens with Strava and removes tokens from Firestore
 * Can be triggered by user action or webhook (when user revokes via Strava settings)
 */
export const disconnectStrava = onCall(
  async (request): Promise<SuccessResponse> => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated."
      );
    }

    const userId = request.auth.uid;

    try {
      const accessToken = await getValidStravaToken(userId);

      // Revoke access with Strava API
      try {
        await axios.post(
          STRAVA_CONFIG.DEAUTHORIZE_URL,
          null,
          {
            params: {
              access_token: accessToken,
            },
          }
        );
        logger.info(`Strava access revoked via API for user: ${userId}`);
      } catch (error) {
        // Log but don't fail if revocation fails (token might already be invalid)
        logger.warn(
          `Failed to revoke Strava token via API for user ${userId}:`,
          error
        );
      }

      // Delete tokens from Firestore
      await db
        .collection(FIRESTORE_COLLECTIONS.STRAVA_TOKENS)
        .doc(userId)
        .delete();

      // Update user profile
      await db
        .collection(FIRESTORE_COLLECTIONS.USERS)
        .doc(userId)
        .update({
          stravaConnected: false,
          stravaFirstname: FieldValue.delete(),
          stravaLastname: FieldValue.delete(),
          stravaId: FieldValue.delete(),
          updatedAt: Timestamp.now(),
        });

      logger.info(`Strava disconnected for user: ${userId}`);

      return {
        status: "success",
        message: "Strava account disconnected",
      };
    } catch (error) {
      handleError(
        error,
        "Error disconnecting Strava:",
        "Failed to disconnect Strava account."
      );
    }
  }
);

/**
 * Gets user's Strava activities, stores them in Firestore, and updates user stats
 * Checks for duplicates to avoid storing the same activity multiple times
 * Used for development/testing - production will use webhooks with fetchActivityById
 */
export const fetchStravaActivities = onCall(
  async (request): Promise<GetActivitiesResponse> => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated."
      );
    }

    const userId = request.auth.uid;
    const { page = 1, perPage = 30 } = request.data as GetActivitiesData;

    try {
      // Get valid access token (auto-refreshes if expired)
      const accessToken = await getValidStravaToken(userId);

      // Make API request to Strava
      const response = await axios.get<StravaActivity[]>(
        `${STRAVA_CONFIG.API_BASE_URL}/athlete/activities`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            page,
            per_page: perPage,
          },
        }
      );

      const activities = response.data;
      logger.info(
        `Retrieved ${activities.length} activities for user: ${userId}`
      );

      // Process and store each activity (with duplicate checking)
      let newActivitiesCount = 0;
      for (const activity of activities) {
        const wasStored = await processAndStoreActivity(userId, activity);
        if (wasStored) {
          newActivitiesCount++;
        }
      }

      logger.info(
        `Processed and stored ${newActivitiesCount} new activities for user: ${userId}`
      );

      return {
        status: "success",
        activities: activities,
      };
    } catch (error) {
      // Custom Error Handling for this function
      if (axios.isAxiosError(error)) {
        logger.error(
          "Error getting activities:",
          error.response?.data || error.message
        );

        // Handle specific 401 (Unauthorized) from Strava
        if (error.response?.status === 401) {
          throw new HttpsError(
            "unauthenticated",
            "Strava token invalid. Please refresh or reconnect.",
            error.response?.data
          );
        }
      }

      // Use the generic handler for all other errors
      handleError(
        error,
        "Error getting Strava activities:",
        "Failed to get Strava activities."
      );
    }
  }
);

/**
 * Gets user's stored activities from Firestore
 * Returns activities sorted by start date (most recent first)
 */
export const getUserActivities = onCall(
  async (request): Promise<GetActivitiesResponse> => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated."
      );
    }

    const userId = request.auth.uid;
    const { page = 1, perPage = 30 } = request.data as GetActivitiesData;

    try {
      // Calculate offset for pagination
      const offset = (page - 1) * perPage;

      // Query Firestore for user's activities
      const activitiesSnapshot = await db
        .collection(FIRESTORE_COLLECTIONS.STRAVA_ACTIVITIES)
        .where("userId", "==", userId)
        .orderBy("start_date", "desc")
        .limit(perPage)
        .offset(offset)
        .get();

      const activities: StravaActivity[] = [];
      activitiesSnapshot.forEach((doc) => {
        const data = doc.data() as StoredActivity;
        // Remove userId and Firestore-specific fields
        const { userId: _userId, fetchedAt: _fetchedAt, updatedAt: _updatedAt, ...activity } = data;
        activities.push(activity);
      });

      logger.info(
        `Retrieved ${activities.length} activities from Firestore for user: ${userId}`
      );

      return {
        status: "success",
        activities: activities,
      };
    } catch (error) {
      handleError(
        error,
        "Error getting user activities from Firestore:",
        "Failed to get activities."
      );
    }
  }
);
