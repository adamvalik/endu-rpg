'use client';

import type { UserStats } from '@endu/shared/types';
import { Mountain, Route, Timer, Trophy } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';

function formatDistance(meters: number): string {
  return (meters / 1000).toFixed(1) + ' km';
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  return hours + 'h';
}

interface StatsGridProps {
  stats: UserStats | undefined;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    {
      label: 'Activities',
      value: stats?.activitiesCount ?? 0,
      icon: Trophy,
    },
    {
      label: 'Distance',
      value: formatDistance(stats?.totalDistance ?? 0),
      icon: Route,
    },
    {
      label: 'Time',
      value: formatTime(stats?.totalMovingTime ?? 0),
      icon: Timer,
    },
    {
      label: 'Elevation',
      value: Math.round(stats?.totalElevationGain ?? 0) + ' m',
      icon: Mountain,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex flex-col items-center gap-1 p-4">
            <item.icon className="text-muted-foreground h-5 w-5" />
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-muted-foreground text-sm">{item.label}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
