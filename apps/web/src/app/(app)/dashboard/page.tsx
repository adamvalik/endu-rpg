'use client';

import type { StravaActivity } from '@endu/shared/types';
import { ArrowRight, RefreshCw } from 'lucide-react';
import Link from 'next/link';

import { ActivityCard } from '@/components/activities/activity-card';
import { StatsGrid } from '@/components/character/stats-grid';
import { StreakIndicator } from '@/components/character/streak-indicator';
import { TierBadge } from '@/components/character/tier-badge';
import { XPBar } from '@/components/character/xp-bar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useRecentActivities } from '@/hooks/use-activities';
import { useGameProfile } from '@/hooks/use-game-profile';
import { useSyncActivities } from '@/hooks/use-mutations';
import { useUserProfile } from '@/hooks/use-user-profile';

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-40" />
      <Card>
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex flex-col items-center gap-1 p-4">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: profileData, isLoading: profileLoading } = useUserProfile();
  const { data: gameData, isLoading: gameLoading } = useGameProfile();
  const { data: recentData, isLoading: recentLoading } = useRecentActivities(3);
  const sync = useSyncActivities();

  const profile = profileData?.profile;
  const game = gameData?.game;
  const recentActivities: StravaActivity[] = recentData?.activities ?? [];

  if (profileLoading || gameLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {profile?.stravaConnected && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => sync.mutate()}
            disabled={sync.isPending}
          >
            <RefreshCw className={`mr-1.5 h-4 w-4 ${sync.isPending ? 'animate-spin' : ''}`} />
            Sync
          </Button>
        )}
      </div>

      {/* Character summary */}
      {game && (
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold">Level {game.level}</h2>
              <TierBadge tier={game.tier} />
              <StreakIndicator count={game.streakCount} active={game.streakActive} />
              <span className="text-muted-foreground ml-auto text-sm">
                {game.totalXP.toLocaleString()} total XP
              </span>
            </div>
            <XPBar currentXP={game.currentLevelXP} nextLevelXP={game.nextLevelXP} />
          </CardContent>
        </Card>
      )}

      {/* Stats grid */}
      <StatsGrid stats={profile?.stats} />

      {/* Strava connection prompt */}
      {!profile?.stravaConnected && (
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">Connect Strava</p>
              <p className="text-muted-foreground text-sm">Sync your activities to earn XP</p>
            </div>
            <Button asChild>
              <Link href="/strava/connect">Connect</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent activities */}
      {profile?.stravaConnected && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Activities</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/activities">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {recentLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="flex items-center gap-4 p-4">
                  <Skeleton className="h-16 w-16 shrink-0 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : recentActivities.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              No activities yet — sync from Strava to get started
            </p>
          ) : (
            recentActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
