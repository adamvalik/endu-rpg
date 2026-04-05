'use client';

import { useQuery } from '@tanstack/react-query';

import { useAuth } from '@/hooks/use-auth';
import { queryKeys } from '@/lib/api/query-keys';
import { getGameProfile } from '@/lib/firebase/functions';

export function useGameProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.gameProfile,
    queryFn: getGameProfile,
    enabled: isAuthenticated,
  });
}
