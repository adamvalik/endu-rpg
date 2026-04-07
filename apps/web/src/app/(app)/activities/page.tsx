'use client';

import type { StravaActivity } from '@endu/shared/types';
import { RefreshCw } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { ActivityCard } from '@/components/activities/activity-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useActivities } from '@/hooks/use-activities';
import { useSyncActivities } from '@/hooks/use-mutations';

function ActivitySkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Skeleton className="h-16 w-16 shrink-0 rounded" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-16" />
          <div className="flex gap-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 shrink-0 rounded-full" />
      </CardContent>
    </Card>
  );
}

export default function ActivitiesPage() {
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useActivities();
  const sync = useSyncActivities();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const activities: StravaActivity[] = data?.pages.flatMap((p) => p.activities) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Activities</h1>
        <Button variant="outline" size="sm" onClick={() => sync.mutate()} disabled={sync.isPending}>
          <RefreshCw className={`mr-1.5 h-4 w-4 ${sync.isPending ? 'animate-spin' : ''}`} />
          Sync
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ActivitySkeleton key={i} />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20">
          <p className="text-muted-foreground">No activities yet</p>
          <p className="text-muted-foreground text-sm">
            Connect Strava and sync to see your activities here
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}

          <div ref={sentinelRef} className="h-1" />

          {isFetchingNextPage && (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <ActivitySkeleton key={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
