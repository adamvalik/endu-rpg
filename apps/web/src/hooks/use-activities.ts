'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/use-auth';
import { queryKeys } from '@/lib/api/query-keys';
import { getUserActivities } from '@/lib/firebase/functions';

const PAGE_SIZE = 20;

export function useActivities() {
  const { isAuthenticated } = useAuth();

  return useInfiniteQuery({
    queryKey: queryKeys.activities,
    queryFn: ({ pageParam }) => getUserActivities({ page: pageParam, perPage: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (lastPage.activities.length < PAGE_SIZE) return undefined;
      return lastPageParam + 1;
    },
    enabled: isAuthenticated,
  });
}

export function useRecentActivities(count: number = 3) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: [...queryKeys.activities, 'recent', count],
    queryFn: () => getUserActivities({ page: 1, perPage: count }),
    enabled: isAuthenticated,
  });
}
