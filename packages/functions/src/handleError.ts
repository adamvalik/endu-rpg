import axios from 'axios';
import { HttpsError } from 'firebase-functions/https';
import { logger } from 'firebase-functions/logger';

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
