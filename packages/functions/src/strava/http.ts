import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as logger from 'firebase-functions/logger';

// Strava rate-limit semantics:
// - X-Ratelimit-Limit / X-Ratelimit-Usage: "short,daily" (15-min + daily)
// - X-ReadRateLimit-Limit / X-ReadRateLimit-Usage: same split, read-only endpoints
// - 15-min window resets at :00 :15 :30 :45; daily resets at UTC midnight.
// See: https://developers.strava.com/docs/rate-limits/

const MAX_TRANSIENT_RETRIES = 3;
const BASE_BACKOFF_MS = 500;
// Only wait-and-retry on 429 when the short-window reset is this soon, to stay
// well under Cloud Functions request timeouts.
const SHORT_WINDOW_WAIT_CAP_MS = 45_000;

export type RateLimitScope = 'short' | 'daily';

export interface RateLimitSnapshot {
  scope: RateLimitScope;
  usage: number;
  limit: number;
  readOnly: boolean;
  resetAt: Date;
  retryAfterMs: number;
}

export class StravaRateLimitError extends Error {
  readonly snapshot: RateLimitSnapshot;

  constructor(snapshot: RateLimitSnapshot) {
    super(
      `Strava rate limit exceeded (${snapshot.scope}, ${snapshot.readOnly ? 'read' : 'overall'}): ` +
        `${snapshot.usage}/${snapshot.limit}, resets at ${snapshot.resetAt.toISOString()}`,
    );
    this.name = 'StravaRateLimitError';
    this.snapshot = snapshot;
  }
}

function parsePair(header: string | undefined): [number, number] | null {
  if (!header) return null;
  const parts = header.split(',').map((x) => Number(x.trim()));
  if (parts.length !== 2 || parts.some(Number.isNaN)) return null;
  return [parts[0], parts[1]];
}

function nextQuarterHour(from: Date): Date {
  const next = new Date(from);
  next.setUTCMilliseconds(0);
  next.setUTCSeconds(0);
  const minutes = next.getUTCMinutes();
  const nextQuarter = Math.ceil((minutes + 1) / 15) * 15;
  next.setUTCMinutes(nextQuarter);
  return next;
}

function nextUtcMidnight(from: Date): Date {
  const next = new Date(from);
  next.setUTCHours(24, 0, 0, 0);
  return next;
}

/**
 * Parses Strava rate-limit headers and returns the breach details, if any.
 * When both short and daily are breached the daily breach is returned (more severe).
 */
export function classifyRateLimit(
  headers: Record<string, string | string[] | undefined>,
): RateLimitSnapshot | null {
  const now = new Date();

  const sources: Array<{ limit?: string; usage?: string; readOnly: boolean }> = [
    {
      limit: headers['x-ratelimit-limit'] as string | undefined,
      usage: headers['x-ratelimit-usage'] as string | undefined,
      readOnly: false,
    },
    {
      limit: headers['x-readratelimit-limit'] as string | undefined,
      usage: headers['x-readratelimit-usage'] as string | undefined,
      readOnly: true,
    },
  ];

  let worst: RateLimitSnapshot | null = null;

  for (const src of sources) {
    const limit = parsePair(src.limit);
    const usage = parsePair(src.usage);
    if (!limit || !usage) continue;

    const [shortLimit, dailyLimit] = limit;
    const [shortUsage, dailyUsage] = usage;

    if (dailyUsage >= dailyLimit) {
      const resetAt = nextUtcMidnight(now);
      const snapshot: RateLimitSnapshot = {
        scope: 'daily',
        usage: dailyUsage,
        limit: dailyLimit,
        readOnly: src.readOnly,
        resetAt,
        retryAfterMs: resetAt.getTime() - now.getTime(),
      };
      // Daily is always the most severe.
      return snapshot;
    }

    if (shortUsage >= shortLimit) {
      const resetAt = nextQuarterHour(now);
      const snapshot: RateLimitSnapshot = {
        scope: 'short',
        usage: shortUsage,
        limit: shortLimit,
        readOnly: src.readOnly,
        resetAt,
        retryAfterMs: resetAt.getTime() - now.getTime(),
      };
      if (!worst) worst = snapshot;
    }
  }

  return worst;
}

function isTransientAxiosError(error: AxiosError): boolean {
  if (!error.response) return true; // network / timeout
  const status = error.response.status;
  return status >= 500 && status < 600;
}

function backoffDelay(attempt: number): number {
  const exp = BASE_BACKOFF_MS * 2 ** attempt;
  const jitter = Math.random() * BASE_BACKOFF_MS;
  return exp + jitter;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wraps axios for Strava API calls. Classifies 429 responses, retries
 * transient failures with exponential backoff, and throws StravaRateLimitError
 * when a rate limit can't be recovered within a safe wait window.
 */
export async function stravaRequest<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  let lastError: unknown;
  let shortWindowRetried = false;

  for (let attempt = 0; attempt <= MAX_TRANSIENT_RETRIES; attempt++) {
    try {
      return await axios.request<T>(config);
    } catch (error) {
      lastError = error;

      if (!axios.isAxiosError(error)) throw error;

      if (error.response?.status === 429) {
        const snapshot = classifyRateLimit(error.response.headers as Record<string, string>) ?? {
          scope: 'short',
          usage: 0,
          limit: 0,
          readOnly: false,
          resetAt: nextQuarterHour(new Date()),
          retryAfterMs: nextQuarterHour(new Date()).getTime() - Date.now(),
        };

        if (
          snapshot.scope === 'short' &&
          !shortWindowRetried &&
          snapshot.retryAfterMs <= SHORT_WINDOW_WAIT_CAP_MS
        ) {
          shortWindowRetried = true;
          logger.warn(
            `Strava short-window limit hit; waiting ${snapshot.retryAfterMs}ms until reset`,
            { snapshot },
          );
          await sleep(snapshot.retryAfterMs + 500);
          continue;
        }

        throw new StravaRateLimitError(snapshot);
      }

      if (isTransientAxiosError(error) && attempt < MAX_TRANSIENT_RETRIES) {
        const delay = backoffDelay(attempt);
        logger.warn(`Transient Strava error (attempt ${attempt + 1}), retrying in ${delay}ms`, {
          status: error.response?.status,
          message: error.message,
        });
        await sleep(delay);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}
