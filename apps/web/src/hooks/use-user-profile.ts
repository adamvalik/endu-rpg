'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/use-auth';
import { queryKeys } from '@/lib/api/query-keys';
import { getUserProfile } from '@/lib/firebase/functions';

export function useUserProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.userProfile,
    queryFn: getUserProfile,
    enabled: isAuthenticated,
  });
}
