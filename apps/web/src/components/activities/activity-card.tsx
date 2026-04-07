'use client';

import type { StravaActivity } from '@endu/shared/types';
import { ChevronDown, Clock, Mountain, Route, Zap } from 'lucide-react';
import { useState } from 'react';

import { RoutePreview } from '@/components/activities/route-preview';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPace(meters: number, seconds: number): string {
  if (meters === 0) return '—';
  const paceSeconds = seconds / (meters / 1000);
  const m = Math.floor(paceSeconds / 60);
  const s = Math.round(paceSeconds % 60);
  return `${m}:${String(s).padStart(2, '0')} /km`;
}

function formatSpeed(meters: number, seconds: number): string {
  if (seconds === 0) return '—';
  return (meters / 1000 / (seconds / 3600)).toFixed(1) + ' km/h';
}

function isRunOrWalk(type: string): boolean {
  return ['Run', 'Walk', 'Hike', 'Trail Run', 'VirtualRun'].includes(type);
}

export function ActivityCard({ activity }: { activity: StravaActivity }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      className="hover:bg-accent/50 cursor-pointer transition-colors"
      onClick={() => setExpanded(!expanded)}
    >
      <CardContent className="p-0">
        {/* Compact row */}
        <div className="flex items-center gap-4 p-4">
          {activity.map?.summary_polyline && (
            <RoutePreview encodedPolyline={activity.map.summary_polyline} width={64} height={64} />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-medium">{activity.name}</h3>
              <span className="text-muted-foreground shrink-0 text-xs">
                {formatDate(activity.start_date_local)}
              </span>
            </div>
            <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm">
              <span className="text-foreground font-medium">{activity.type}</span>
              <span>{formatDistance(activity.distance)}</span>
              <span>{formatDuration(activity.moving_time)}</span>
              {activity.total_elevation_gain > 0 && (
                <span>{Math.round(activity.total_elevation_gain)} m</span>
              )}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {activity.xpEarned != null && activity.xpEarned > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Zap className="h-3 w-3" />
                {activity.xpEarned}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                'text-muted-foreground h-4 w-4 transition-transform duration-200',
                expanded && 'rotate-180',
              )}
            />
          </div>
        </div>

        {/* Expanded detail */}
        {expanded && (
          <div className="border-t px-4 pt-3 pb-4">
            <div className="flex gap-6">
              {/* Stats */}
              <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                <DetailStat
                  icon={Route}
                  label="Distance"
                  value={formatDistance(activity.distance)}
                />
                <DetailStat
                  icon={Clock}
                  label="Moving Time"
                  value={formatDuration(activity.moving_time)}
                />
                <DetailStat
                  icon={Mountain}
                  label="Elevation"
                  value={`${Math.round(activity.total_elevation_gain)} m`}
                />
                <DetailStat
                  icon={Zap}
                  label={isRunOrWalk(activity.type) ? 'Pace' : 'Speed'}
                  value={
                    isRunOrWalk(activity.type)
                      ? formatPace(activity.distance, activity.moving_time)
                      : formatSpeed(activity.distance, activity.moving_time)
                  }
                />
              </div>

              {/* Larger route preview */}
              {activity.map?.summary_polyline && (
                <div className="hidden shrink-0 sm:block">
                  <RoutePreview
                    encodedPolyline={activity.map.summary_polyline}
                    width={160}
                    height={120}
                  />
                </div>
              )}
            </div>

            {/* Meta row */}
            <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span>
                {formatDate(activity.start_date_local)} at {formatTime(activity.start_date_local)}
              </span>
              {activity.elapsed_time && activity.elapsed_time !== activity.moving_time && (
                <span>Elapsed: {formatDuration(activity.elapsed_time)}</span>
              )}
              {activity.xpEarned != null && activity.xpEarned > 0 && (
                <span className="text-foreground font-medium">+{activity.xpEarned} XP earned</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DetailStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="text-muted-foreground flex items-center gap-1 text-xs">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
