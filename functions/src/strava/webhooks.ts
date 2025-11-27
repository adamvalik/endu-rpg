import { onRequest } from "firebase-functions/v2/https";
import { db } from "../admin";
import * as logger from "firebase-functions/logger";
import axios, { HttpStatusCode } from "axios";
import {
  STRAVA_CONFIG,
  FIRESTORE_COLLECTIONS,
  getStravaCredentials,
} from "../config";
import { StravaWebhookEvent, StravaActivity, StravaWebhookUpdates } from "../types";
import { handleError } from "../handleError";
import { fetchStravaActivity, getValidStravaToken, updateUserStats, getUserIdByStravaId } from "./strava";

/**
 * Webhook endpoint to handle Strava subscription validation and activity notifications
 *
 * GET: Handles subscription validation challenge from Strava
 * POST: Receives webhook notifications for new/updated/deleted activities
 */
export const stravaWebhook = onRequest(async (request, response) => {
  logger.info("Webhook request received:", {
    method: request.method,
    query: request.query,
    body: request.body,
  });

  // GET: Subscription validation
  if (request.method === "GET") {
    handleSubscriptionValidation(request, response);
    return;
  }

  // POST: Event notification
  if (request.method === "POST") {
    await handleWebhookNotification(request, response);
    return;
  }

  response.status(HttpStatusCode.MethodNotAllowed).send("Method not allowed");
});

/**
 * Handles Strava's subscription validation challenge
 * Strava sends a GET request with hub.mode, hub.challenge, and hub.verify_token
 */
function handleSubscriptionValidation(request: any, response: any) {
  const mode = request.query["hub.mode"];
  const token = request.query["hub.verify_token"];
  const challenge = request.query["hub.challenge"];

  logger.info("Subscription validation request:", { mode, token, challenge });

  if (mode === "subscribe" && token === process.env.STRAVA_VERIFY_TOKEN) {
    logger.info("✅ Webhook validation successful");
    response.json({ "hub.challenge": challenge });
  } else {
    logger.error("❌ Webhook validation failed");
    response.status(HttpStatusCode.Forbidden).send("Forbidden");
  }
}

/**
 * Handles incoming webhook notifications from Strava
 * Processes activity events (create, update, delete)
 */
async function handleWebhookNotification(request: any, response: any) {
  const event: StravaWebhookEvent = request.body;

  logger.info("Received webhook event:", {
    object_type: event.object_type,
    aspect_type: event.aspect_type,
    object_id: event.object_id,
    owner_id: event.owner_id,
  });

  // Respond immediately with 200 OK (within 2 seconds as required by Strava)
  response.status(HttpStatusCode.Ok).send("EVENT_RECEIVED");

  // Process asynchronously
  processWebhookEvent(event).catch((error) => {
    logger.error("Error processing webhook event:", error);
  });
}

/**
 * Asynchronously processes webhook events
 * Separated from handleWebhookNotification to allow immediate 200 OK response
 */
async function processWebhookEvent(event: StravaWebhookEvent) {
  try {
    // Only process activity events
    if (event.object_type !== "activity") {
      logger.info("Ignoring non-activity event");
      return;
    }

    // Find user by Strava athlete ID
    const userId = await getUserIdByStravaId(event.owner_id);
    if (!userId) {
      logger.warn(`No user found for Strava athlete ID: ${event.owner_id}`);
      return;
    }

    // Process based on event type
    switch (event.aspect_type) {
      case "create":
        await handleActivityCreate(userId, event.object_id);
        break;

      case "update":
        await handleActivityUpdate(userId, event.object_id, event.updates);
        break;

      case "delete":
        await handleActivityDelete(userId, event.object_id);
        break;

      default:
        logger.warn(`Unknown aspect_type: ${event.aspect_type}`);
    }

    logger.info(`✅ Successfully processed ${event.aspect_type} event for activity ${event.object_id}`);
  } catch (error) {
    logger.error("Error in processWebhookEvent:", error);
    throw error;
  }
}

/**
 * Handles new activity creation
 * Fetches the activity from Strava and stores it
 */
async function handleActivityCreate(userId: string, activityId: number) {
  logger.info(`Processing new activity ${activityId} for user ${userId}`);

  try {
    await fetchStravaActivity(userId, activityId);
    logger.info(`✅ Successfully stored activity ${activityId}`);
  } catch (error) {
    logger.error(`Error handling activity create:`, error);
  }
}

/**
 * Handles activity updates
 * Fetches updated activity data and updates in Firestore
 */
async function handleActivityUpdate(
  userId: string,
  activityId: number,
  updates?: StravaWebhookUpdates
) {
  logger.info(`Processing activity update ${activityId} for user ${userId}`, {
    updates,
  });

  try {
    const activityRef = db
      .collection(FIRESTORE_COLLECTIONS.STRAVA_ACTIVITIES)
      .doc(`${userId}_${activityId}`);

    const existingActivity = await activityRef.get();

    if (!existingActivity.exists) {
      logger.warn(`Trying to update an activity, that does not exist: ${activityId}`);
      return;
    }

    // Get fresh data from Strava
    const accessToken = await getValidStravaToken(userId);
    const response = await axios.get<StravaActivity>(
      `${STRAVA_CONFIG.API_BASE_URL}/activities/${activityId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const updatedActivity = response.data;
    const oldActivity = existingActivity.data() as StravaActivity;

    // Update stats (remove old, add new)
    await updateUserStats(userId, oldActivity, false);
    await updateUserStats(userId, updatedActivity, true);

    // Update activity in Firestore
    await activityRef.update({
      ...updatedActivity,
      updatedAt: new Date(),
    });

    logger.info(`✅ Successfully updated activity ${activityId}`);
  } catch (error) {
    logger.error(`Error handling activity update:`, error);
  }
}

/**
 * Handles activity deletion
 * Removes activity from Firestore and updates user stats
 */
async function handleActivityDelete(userId: string, activityId: number) {
  logger.info(`Processing activity delete ${activityId} for user ${userId}`);

  try {
    const activityRef = db
      .collection(FIRESTORE_COLLECTIONS.STRAVA_ACTIVITIES)
      .doc(`${userId}_${activityId}`);

    const existingActivity = await activityRef.get();

    if (!existingActivity.exists) {
      logger.warn(`Activity ${activityId} not found for deletion`);
      return;
    }

    const activity = existingActivity.data() as StravaActivity;

    // Update user stats (decrement)
    await updateUserStats(userId, activity, false);

    // Delete activity
    await activityRef.delete();

    logger.info(`✅ Successfully deleted activity ${activityId}`);
  } catch (error) {
    logger.error(`Error handling activity delete:`, error);
  }
}

/**
 * Creates a webhook subscription with Strava
 * Call this function to set up the webhook
 * Use ngrok URL as callback_url for local development
 */
export const createStravaWebhook = async (callbackUrl: string) => {
  const { clientId, clientSecret } = getStravaCredentials();

  try {
    const response = await axios.post(
      STRAVA_CONFIG.PUSH_SUBSCRIPTION_URL,
      null,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          callback_url: callbackUrl,
          verify_token: process.env.STRAVA_VERIFY_TOKEN,
        },
      }
    );

    logger.info("✅ Webhook subscription created:", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "Error creating webhook:", "Failed to create webhook");
  }
};

/**
 * Views current webhook subscriptions
 */
export const viewStravaWebhooks = async () => {
  const { clientId, clientSecret } = getStravaCredentials();

  try {
    const response = await axios.get(
      STRAVA_CONFIG.PUSH_SUBSCRIPTION_URL,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
        },
      }
    );

    logger.info("Current webhook subscriptions:", response.data);
    return response.data;
  } catch (error) {
    handleError(error, "Error viewing webhooks:", "Failed to view webhooks");
  }
};

/**
 * Deletes a webhook subscription
 */
export const deleteStravaWebhook = async (subscriptionId: number) => {
  const { clientId, clientSecret } = getStravaCredentials();

  try {
    await axios.delete(
      `${STRAVA_CONFIG.PUSH_SUBSCRIPTION_URL}/${subscriptionId}`,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
        },
      }
    );

    logger.info(`✅ Webhook subscription ${subscriptionId} deleted`);
    return { success: true };
  } catch (error) {
    handleError(error, "Error deleting webhook:", "Failed to delete webhook");
  }
};
