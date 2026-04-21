import type { GetAdminActivityAnalyticsData, ListAdminUsersData } from '@endu/shared/types';

export const queryKeys = {
  userProfile: ['userProfile'] as const,
  gameProfile: ['gameProfile'] as const,
  activities: ['activities'] as const,
  admin: {
    overview: ['admin', 'overview'] as const,
    users: (params: ListAdminUsersData) => ['admin', 'users', params] as const,
    analytics: (params: GetAdminActivityAnalyticsData) => ['admin', 'analytics', params] as const,
  },
};
