import axios from 'axios';
import { HttpsError } from 'firebase-functions/https';
import { logger } from 'firebase-functions/logger';

import { StravaRateLimitError } from './strava/http';

/**
 * Handles errors, re-throwing HttpsErrors and wrapping others.
 * @param {unknown} error The error caught.
 * @param {string} logMessage The message to log.
 * @param {string} defaultErrorMessage The default message for the HttpsError.
 */
export function handleError(
  error: unknown,
  logMessage: string,
  defaultErrorMessage: string,
): never {
  if (error instanceof StravaRateLimitError) {
    logger.error(logMessage, error.message, { snapshot: error.snapshot });
    const waitMinutes = Math.max(1, Math.ceil(error.snapshot.retryAfterMs / 60_000));
    const userMessage =
      error.snapshot.scope === 'daily'
        ? 'Strava daily request limit reached. Please try again tomorrow.'
        : `Strava is rate-limiting us. Please try again in about ${waitMinutes} minute${waitMinutes === 1 ? '' : 's'}.`;
    throw new HttpsError('resource-exhausted', userMessage, {
      scope: error.snapshot.scope,
      resetAt: error.snapshot.resetAt.toISOString(),
    });
  }

  if (axios.isAxiosError(error)) {
    logger.error(logMessage, error.response?.data || error.message, error);
  } else {
    logger.error(logMessage, error);
  }

  // Re-throw HttpsErrors directly
  if (error instanceof HttpsError) {
    throw error;
  }

  // Wrap other errors in a new HttpsError, preserving the original message
  const originalMessage = error instanceof Error ? error.message : String(error);
  const detail = axios.isAxiosError(error) ? JSON.stringify(error.response?.data) : originalMessage;

  throw new HttpsError('internal', `${defaultErrorMessage} ${detail}`);
}
