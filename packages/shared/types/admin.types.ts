import type { CharacterTier } from './game.types';

export interface AdminOverview {
  totalUsers: number;
  stravaConnectedCount: number;
  tierDistribution: Record<CharacterTier, number>;
  levelHistogram: Array<{ level: number; count: number }>;
  totalActivities: number;
  totalXP: number;
  totalDistanceMeters: number;
  totalMovingTimeSeconds: number;
  newUsersLast7d: number;
  newUsersLast30d: number;
}

export interface AdminOverviewResponse {
  status: 'success';
  overview: AdminOverview;
}

export type AdminUserSortBy =
  | 'createdAt'
  | 'level'
  | 'totalXP'
  | 'streakCount'
  | 'activitiesCount'
  | 'lastActivityDate'
  | 'email';

export interface ListAdminUsersData {
  page?: number;
  pageSize?: number;
  sortBy?: AdminUserSortBy;
  sortDir?: 'asc' | 'desc';
  search?: string;
}

export interface AdminUserRow {
  uid: string;
  email: string;
  displayName: string | null;
  stravaConnected: boolean;
  level: number;
  tier: CharacterTier | null;
  totalXP: number;
  streakCount: number;
  streakActive: boolean;
  activitiesCount: number;
  totalDistanceMeters: number;
  createdAt: string | null;
  lastActivityDate: string | null;
}

export interface ListAdminUsersResponse {
  status: 'success';
  users: AdminUserRow[];
  total: number;
  page: number;
  pageSize: number;
}

export interface GetAdminActivityAnalyticsData {
  days?: number;
}

export interface AdminActivityTypeBreakdown {
  type: string;
  count: number;
  distanceMeters: number;
  movingTimeSeconds: number;
}

export interface AdminDailyActivityCount {
  date: string;
  count: number;
}

export interface AdminRecentActivity {
  id: number;
  userId: string;
  userEmail: string | null;
  name: string;
  type: string;
  distanceMeters: number;
  movingTimeSeconds: number;
  startDate: string;
  xpEarned: number;
}

export interface AdminActivityAnalytics {
  days: number;
  byType: AdminActivityTypeBreakdown[];
  dailyCounts: AdminDailyActivityCount[];
  recent: AdminRecentActivity[];
}

export interface AdminActivityAnalyticsResponse {
  status: 'success';
  analytics: AdminActivityAnalytics;
}
