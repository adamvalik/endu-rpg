'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/use-auth';
import { queryKeys } from '@/lib/api/query-keys';
import { getUserActivities } from '@/lib/firebase/functions';

export function useActivities(page: number = 1, perPage: number = 20) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.activities(page),
    queryFn: () => getUserActivities({ page, perPage }),
    enabled: isAuthenticated,
    placeholderData: (prev) => prev,
  });
}
