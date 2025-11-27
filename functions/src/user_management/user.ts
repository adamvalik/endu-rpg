import { onCall, HttpsError } from "firebase-functions/v2/https";
import { db, auth } from "../admin";
import * as logger from "firebase-functions/logger";
import { FIRESTORE_COLLECTIONS } from "../config";
import { Timestamp, DocumentData } from "firebase-admin/firestore";
import { handleError } from "../handleError";
import { ProfileResponse, SuccessResponse, UpdateProfileData } from "../types";

/**
 * Gets the current user's profile
 */
export const getUserProfile = onCall(
  async (request): Promise<ProfileResponse> => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated."
      );
    }

    const userId = request.auth.uid;

    try {
      const userDoc = await db
        .collection(FIRESTORE_COLLECTIONS.USERS)
        .doc(userId)
        .get();

      if (!userDoc.exists) {
        throw new HttpsError("not-found", "User profile not found.");
      }

      return {
        status: "success",
        profile: userDoc.data() as DocumentData,
      };
    } catch (error) {
      handleError(
        error,
        "Error getting user profile:",
        "Failed to get user profile."
      );
    }
  }
);

/**
 * Updates the current user's profile
 */
export const updateUserProfile = onCall(
  async (request): Promise<SuccessResponse> => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated."
      );
    }

    const userId = request.auth.uid;
    const { displayName } = request.data as UpdateProfileData;

    try {
      const updates: {updatedAt: Timestamp; displayName?: string } = {
        updatedAt: Timestamp.now(),
      };

      if (displayName !== undefined) {
        updates.displayName = displayName;

        // Also update Firebase Auth
        await auth.updateUser(userId, {
          displayName: displayName,
        });
      }

      await db
        .collection(FIRESTORE_COLLECTIONS.USERS)
        .doc(userId)
        .update(updates);

      logger.info(`User profile updated: ${userId}`);

      return {
        status: "success",
        message: "Profile updated successfully",
      };
    } catch (error) {
      handleError(
        error,
        "Error updating user profile:",
        "Failed to update user profile."
      );
    }
  }
);

/**
 * Deletes the current user's account and all associated data
 */
export const deleteUserAccount = onCall(
  async (request): Promise<SuccessResponse> => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "User must be authenticated."
      );
    }

    const userId = request.auth.uid;

    try {
      // This will trigger any onUserDelete auth trigger
      await auth.deleteUser(userId);

      logger.info(`User account deleted: ${userId}`);

      return {
        status: "success",
        message: "Account deleted successfully",
      };
    } catch (error) {
      handleError(
        error,
        "Error deleting user account:",
        "Failed to delete user account."
      );
    }
  }
);
