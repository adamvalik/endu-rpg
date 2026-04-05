'use client';

import type { StravaActivity } from '@endu/shared/types';

import { RoutePreview } from '@/components/activities/route-preview';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

function formatDistance(meters: number): string {
  return (meters / 1000).toFixed(2) + ' km';
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ActivityCard({ activity }: { activity: StravaActivity }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        {activity.map?.summary_polyline && (
          <RoutePreview encodedPolyline={activity.map.summary_polyline} />
        )}
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{activity.name}</h3>
            <span className="text-muted-foreground text-sm">
              {formatDate(activity.start_date_local)}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">{activity.type}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span>{formatDistance(activity.distance)}</span>
            <span>{formatDuration(activity.moving_time)}</span>
            {activity.total_elevation_gain > 0 && (
              <span>{Math.round(activity.total_elevation_gain)} m elev.</span>
            )}
          </div>
        </div>
        {activity.xpEarned != null && activity.xpEarned > 0 && (
          <Badge variant="secondary" className="shrink-0">
            +{activity.xpEarned} XP
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
