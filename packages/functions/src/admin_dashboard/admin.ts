import { Timestamp } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import { onCall } from 'firebase-functions/v2/https';

import { db } from '../admin';
import { FIRESTORE_COLLECTIONS } from '../config';
import { handleError } from '../handleError';
import {
  AdminActivityAnalyticsResponse,
  AdminOverview,
  AdminOverviewResponse,
  AdminRecentActivity,
  AdminUserRow,
  CharacterTier,
  GameProfile,
  GetAdminActivityAnalyticsData,
  ListAdminUsersData,
  ListAdminUsersResponse,
  StoredActivity,
  UserProfile,
  UserStats,
} from '../types';
import { assertAdmin } from '../user_management/auth';

const TIERS: CharacterTier[] = [
  'wanderer',
  'scout',
  'ranger',
  'warrior',
  'champion',
  'hero',
  'legend',
  'mythic',
];

function emptyTierDistribution(): Record<CharacterTier, number> {
  return TIERS.reduce(
    (acc, tier) => {
      acc[tier] = 0;
      return acc;
    },
    {} as Record<CharacterTier, number>,
  );
}

function tsToIso(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate().toISOString();
  // Fallback for emulated/plain objects
  const anyVal = value as { toDate?: () => Date };
  if (typeof anyVal.toDate === 'function') return anyVal.toDate().toISOString();
  return null;
}

function userDocToRow(
  uid: string,
  data: Partial<UserProfile> & { game?: GameProfile },
): AdminUserRow {
  const game = data.game;
  const stats = data.stats as UserStats | undefined;
  return {
    uid,
    email: data.email ?? '',
    displayName: data.displayName ?? null,
    stravaConnected: data.stravaConnected ?? false,
    level: game?.level ?? 1,
    tier: game?.tier ?? null,
    totalXP: game?.totalXP ?? 0,
    streakCount: game?.streakCount ?? 0,
    streakActive: game?.streakActive ?? false,
    activitiesCount: stats?.activitiesCount ?? 0,
    totalDistanceMeters: stats?.totalDistance ?? 0,
    createdAt: tsToIso(data.createdAt),
    lastActivityDate: tsToIso(game?.lastActivityDate) ?? tsToIso(stats?.lastActivityDate),
  };
}

/**
 * Aggregated stats across all users. Iterates the users collection — fine at
 * current scale; revisit with counters if user count grows large.
 */
export const getAdminOverview = onCall(async (request): Promise<AdminOverviewResponse> => {
  assertAdmin(request);

  try {
    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.USERS).get();

    const overview: AdminOverview = {
      totalUsers: 0,
      stravaConnectedCount: 0,
      tierDistribution: emptyTierDistribution(),
      levelHistogram: [],
      totalActivities: 0,
      totalXP: 0,
      totalDistanceMeters: 0,
      totalMovingTimeSeconds: 0,
      newUsersLast7d: 0,
      newUsersLast30d: 0,
    };

    const levelCounts = new Map<number, number>();
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    snapshot.forEach((doc) => {
      const data = doc.data() as Partial<UserProfile> & { game?: GameProfile };
      overview.totalUsers += 1;
      if (data.stravaConnected) overview.stravaConnectedCount += 1;

      const game = data.game;
      if (game?.tier && overview.tierDistribution[game.tier] !== undefined) {
        overview.tierDistribution[game.tier] += 1;
      }
      if (typeof game?.level === 'number') {
        levelCounts.set(game.level, (levelCounts.get(game.level) ?? 0) + 1);
      }
      overview.totalXP += game?.totalXP ?? 0;

      const stats = data.stats as UserStats | undefined;
      overview.totalActivities += stats?.activitiesCount ?? 0;
      overview.totalDistanceMeters += stats?.totalDistance ?? 0;
      overview.totalMovingTimeSeconds += stats?.totalMovingTime ?? 0;

      const createdAt = data.createdAt;
      if (createdAt instanceof Timestamp) {
        const ageMs = now - createdAt.toMillis();
        if (ageMs <= sevenDays) overview.newUsersLast7d += 1;
        if (ageMs <= thirtyDays) overview.newUsersLast30d += 1;
      }
    });

    overview.levelHistogram = Array.from(levelCounts.entries())
      .map(([level, count]) => ({ level, count }))
      .sort((a, b) => a.level - b.level);

    return { status: 'success', overview };
  } catch (error) {
    handleError(error, 'Error in getAdminOverview:', 'Failed to load admin overview.');
  }
});

/**
 * Paginated list of users for the admin dashboard. Sort/search happen
 * in-memory — acceptable at MVP scale; revisit with Firestore-indexed
 * queries if the collection grows significantly.
 */
export const listAdminUsers = onCall(async (request): Promise<ListAdminUsersResponse> => {
  assertAdmin(request);

  const data = (request.data ?? {}) as ListAdminUsersData;
  const page = Math.max(1, Math.floor(data.page ?? 1));
  const pageSize = Math.min(200, Math.max(1, Math.floor(data.pageSize ?? 25)));
  const sortBy = data.sortBy ?? 'createdAt';
  const sortDir = data.sortDir ?? 'desc';
  const search = (data.search ?? '').trim().toLowerCase();

  try {
    const snapshot = await db.collection(FIRESTORE_COLLECTIONS.USERS).get();

    let rows: AdminUserRow[] = snapshot.docs.map((doc) =>
      userDocToRow(doc.id, doc.data() as Partial<UserProfile> & { game?: GameProfile }),
    );

    if (search) {
      rows = rows.filter(
        (r) =>
          r.email.toLowerCase().includes(search) ||
          (r.displayName ?? '').toLowerCase().includes(search) ||
          r.uid.toLowerCase().includes(search),
      );
    }

    const dir = sortDir === 'asc' ? 1 : -1;
    rows.sort((a, b) => {
      const av = sortValue(a, sortBy);
      const bv = sortValue(b, sortBy);
      if (av === bv) return 0;
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      return av < bv ? -1 * dir : 1 * dir;
    });

    const total = rows.length;
    const start = (page - 1) * pageSize;
    const paged = rows.slice(start, start + pageSize);

    return { status: 'success', users: paged, total, page, pageSize };
  } catch (error) {
    handleError(error, 'Error in listAdminUsers:', 'Failed to list users.');
  }
});

function sortValue(row: AdminUserRow, key: ListAdminUsersData['sortBy']): string | number | null {
  switch (key) {
    case 'email':
      return row.email.toLowerCase();
    case 'level':
      return row.level;
    case 'totalXP':
      return row.totalXP;
    case 'streakCount':
      return row.streakCount;
    case 'activitiesCount':
      return row.activitiesCount;
    case 'lastActivityDate':
      return row.lastActivityDate ?? null;
    case 'createdAt':
    default:
      return row.createdAt ?? null;
  }
}

/**
 * Activity analytics over a recent window (default 30 days): type breakdown,
 * daily activity counts, and a recent-activities feed.
 */
export const getAdminActivityAnalytics = onCall(
  async (request): Promise<AdminActivityAnalyticsResponse> => {
    assertAdmin(request);

    const data = (request.data ?? {}) as GetAdminActivityAnalyticsData;
    const days = Math.min(180, Math.max(1, Math.floor(data.days ?? 30)));
    const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const cutoffIso = cutoff.toISOString();

    try {
      const snapshot = await db
        .collection(FIRESTORE_COLLECTIONS.STRAVA_ACTIVITIES)
        .where('start_date', '>=', cutoffIso)
        .get();

      const byTypeMap = new Map<
        string,
        { count: number; distanceMeters: number; movingTimeSeconds: number }
      >();
      const dailyMap = new Map<string, number>();
      const userEmailCache = new Map<string, string | null>();
      const activities: StoredActivity[] = [];

      snapshot.forEach((doc) => {
        const a = doc.data() as StoredActivity;
        activities.push(a);

        const typeKey = a.type || 'Unknown';
        const bucket = byTypeMap.get(typeKey) ?? {
          count: 0,
          distanceMeters: 0,
          movingTimeSeconds: 0,
        };
        bucket.count += 1;
        bucket.distanceMeters += a.distance ?? 0;
        bucket.movingTimeSeconds += a.moving_time ?? 0;
        byTypeMap.set(typeKey, bucket);

        const dateKey = (a.start_date ?? '').slice(0, 10);
        if (dateKey) dailyMap.set(dateKey, (dailyMap.get(dateKey) ?? 0) + 1);
      });

      // Fill missing daily buckets with 0 for continuity
      const dailyCounts: Array<{ date: string; count: number }> = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        const key = d.toISOString().slice(0, 10);
        dailyCounts.push({ date: key, count: dailyMap.get(key) ?? 0 });
      }

      activities.sort((a, b) => (a.start_date < b.start_date ? 1 : -1));
      const recentSlice = activities.slice(0, 25);

      const uniqueUserIds = Array.from(new Set(recentSlice.map((a) => a.userId)));
      await Promise.all(
        uniqueUserIds.map(async (uid) => {
          if (userEmailCache.has(uid)) return;
          const u = await db.collection(FIRESTORE_COLLECTIONS.USERS).doc(uid).get();
          userEmailCache.set(uid, (u.data()?.email as string | undefined) ?? null);
        }),
      );

      const recent: AdminRecentActivity[] = recentSlice.map((a) => ({
        id: a.id,
        userId: a.userId,
        userEmail: userEmailCache.get(a.userId) ?? null,
        name: a.name,
        type: a.type,
        distanceMeters: a.distance ?? 0,
        movingTimeSeconds: a.moving_time ?? 0,
        startDate: a.start_date,
        xpEarned: a.xpEarned ?? 0,
      }));

      const byType = Array.from(byTypeMap.entries())
        .map(([type, v]) => ({ type, ...v }))
        .sort((a, b) => b.count - a.count);

      return {
        status: 'success',
        analytics: { days, byType, dailyCounts, recent },
      };
    } catch (error) {
      logger.error('getAdminActivityAnalytics failed', error);
      handleError(
        error,
        'Error in getAdminActivityAnalytics:',
        'Failed to load activity analytics.',
      );
    }
  },
);
