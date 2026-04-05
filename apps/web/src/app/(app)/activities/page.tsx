'use client';

import type { StravaActivity } from '@endu/shared/types';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useState } from 'react';

import { ActivityCard } from '@/components/activities/activity-card';
import { Button } from '@/components/ui/button';
import { useActivities } from '@/hooks/use-activities';
import { useSyncActivities } from '@/hooks/use-mutations';

const PAGE_SIZE = 20;

export default function ActivitiesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useActivities(page, PAGE_SIZE);
  const sync = useSyncActivities();

  const activities: StravaActivity[] = data?.activities ?? [];

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
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading activities...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-20">
          <p className="text-muted-foreground">No activities yet</p>
          <p className="text-muted-foreground text-sm">
            Connect Strava and sync to see your activities here
          </p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <span className="text-muted-foreground text-sm">Page {page}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={activities.length < PAGE_SIZE}
            >
              Next
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
