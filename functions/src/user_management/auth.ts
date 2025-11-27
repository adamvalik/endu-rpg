import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import { db, auth } from "../admin";
import { Timestamp } from 'firebase-admin/firestore';
import { UserRecord } from "firebase-admin/auth";
import * as logger from "firebase-functions/logger";
import { FIRESTORE_COLLECTIONS } from "../config";
import { SignUpOrLogInData, UserProfile } from "../types/user.types";
import { handleError } from "../handleError";
import * as functionsV1 from "firebase-functions/v1";

/**
 * Creates or logs in a user with email and password
 * This function handles anonymous user conversion to authenticated users
 */
export const signUpOrLogIn = onCall(async (request: CallableRequest<SignUpOrLogInData>) => {
  logger.info('signUpOrLogIn called');

  const { email, password, displayName } = request.data;

  // Validate input
  if (!email || typeof email !== "string") {
    throw new HttpsError(
      "invalid-argument",
      "A valid email must be provided."
    );
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    throw new HttpsError(
      "invalid-argument",
      "A valid password (min 6 characters) must be provided."
    );
  }

  try {
    let userRecord: UserRecord;
    let isNewUser = false;

    // Try to get existing user
    try {
      userRecord = await auth.getUserByEmail(email);
      logger.info(`Existing user found: ${userRecord.uid}`);
    } catch (error: any) {
      // User doesn't exist, create new one
      if (error.code === "auth/user-not-found") {
        logger.info(`Creating new user for email: ${email}`);
        userRecord = await auth.createUser({
          email,
          password,
          displayName: displayName || undefined,
        });
        isNewUser = true;
      } else {
        throw error;
      }
    }

    // If new user, create their profile in Firestore
    if (isNewUser) {
      const { initializeGameProfile } = await import("../game/game");

      const userProfile : UserProfile = {
        uid: userRecord.uid,
        email: userRecord.email!,
        displayName: displayName || null,
        stravaConnected: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      await db
        .collection(FIRESTORE_COLLECTIONS.USERS)
        .doc(userRecord.uid)
        .set(userProfile);

      // Initialize game profile
      await initializeGameProfile(userRecord.uid);

      logger.info(`User profile created in Firestore: ${userRecord.uid}`);
    }

    // Generate custom token for the client to log in
    const customToken = await auth.createCustomToken(userRecord.uid);

    return {
      status: "success",
      isNewUser,
      customToken,
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
      },
    };
  } catch (error: any) {
    handleError(
      error,
      "Error in signUpOrLogIn:",
      "Failed to sign up or sign in user."
    );
  }
});

/**
 * Handles Firebase Auth user creation events
 * This is triggered automatically when a user is created via Firebase Auth
 */
export const onUserCreate = functionsV1.auth.user().onCreate(async (user) => {
  logger.info(`User created via Auth: ${user.uid}`);

  // Check if profile already exists (might have been created by signUpOrSignIn)
  const userDoc = await db
    .collection(FIRESTORE_COLLECTIONS.USERS)
    .doc(user.uid)
    .get();

  if (!userDoc.exists) {
    // Create user profile in Firestore
    const userProfile = {
      uid: user.uid,
      email: user.email!,
      displayName: user.displayName || null,
      stravaConnected: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await db
      .collection(FIRESTORE_COLLECTIONS.USERS)
      .doc(user.uid)
      .set(userProfile);

    logger.info(`User profile created in Firestore: ${user.uid}`);
  }
});

/**
 * Handles Firebase Auth user deletion events
 * Clean up user data when a user is deleted
 */
export const onUserDelete = functionsV1.auth.user().onDelete(async (user) => {
  logger.info(`User deleted: ${user.uid}`);

  try {
    // Delete user profile
    await db
      .collection(FIRESTORE_COLLECTIONS.USERS)
      .doc(user.uid)
      .delete();

    // Delete Strava tokens
    await db
      .collection(FIRESTORE_COLLECTIONS.STRAVA_TOKENS)
      .doc(user.uid)
      .delete();

    logger.info(`User data cleaned up: ${user.uid}`);
  } catch (error) {
    logger.error(`Error cleaning up user data: ${user.uid}`, error);
  }
});
