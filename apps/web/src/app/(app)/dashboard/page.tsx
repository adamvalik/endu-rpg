'use client';

import { RefreshCw } from 'lucide-react';
import Link from 'next/link';

import { StatsGrid } from '@/components/character/stats-grid';
import { StreakIndicator } from '@/components/character/streak-indicator';
import { TierBadge } from '@/components/character/tier-badge';
import { XPBar } from '@/components/character/xp-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameProfile } from '@/hooks/use-game-profile';
import { useSyncActivities } from '@/hooks/use-mutations';
import { useUserProfile } from '@/hooks/use-user-profile';

export default function DashboardPage() {
  const { data: profileData, isLoading: profileLoading } = useUserProfile();
  const { data: gameData, isLoading: gameLoading } = useGameProfile();
  const sync = useSyncActivities();

  const profile = profileData?.profile;
  const game = gameData?.game;

  if (profileLoading || gameLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
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

      {/* Game profile card */}
      {game && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle>Level {game.level}</CardTitle>
              <TierBadge tier={game.tier} />
              <StreakIndicator count={game.streakCount} active={game.streakActive} />
            </div>
            <CardDescription>{game.totalXP.toLocaleString()} total XP</CardDescription>
          </CardHeader>
          <CardContent>
            <XPBar currentXP={game.currentLevelXP} nextLevelXP={game.nextLevelXP} />
          </CardContent>
        </Card>
      )}

      {/* Stats grid */}
      <StatsGrid stats={profile?.stats} />

      {/* Strava connection status */}
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
    </div>
  );
}
