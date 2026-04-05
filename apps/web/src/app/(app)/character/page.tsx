'use client';

import type { CharacterTier } from '@endu/shared/types';

import { StatsGrid } from '@/components/character/stats-grid';
import { StreakIndicator } from '@/components/character/streak-indicator';
import { TierBadge } from '@/components/character/tier-badge';
import { XPBar } from '@/components/character/xp-bar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGameProfile } from '@/hooks/use-game-profile';
import { useUserProfile } from '@/hooks/use-user-profile';

const TIERS: CharacterTier[] = ['Novice', 'Apprentice', 'Expert', 'Master'];

export default function CharacterPage() {
  const { data: profileData, isLoading: profileLoading } = useUserProfile();
  const { data: gameData, isLoading: gameLoading } = useGameProfile();

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
      <h1 className="text-2xl font-bold">Character</h1>

      {game && (
        <>
          {/* Character header */}
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-6">
              <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold">
                {game.level}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold">{profile?.displayName || 'Adventurer'}</h2>
                <div className="mt-2 flex items-center justify-center gap-2">
                  <TierBadge tier={game.tier} />
                  <Badge variant="outline">Level {game.level}</Badge>
                  <StreakIndicator count={game.streakCount} active={game.streakActive} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* XP Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <XPBar currentXP={game.currentLevelXP} nextLevelXP={game.nextLevelXP} />
              <p className="text-muted-foreground text-sm">
                {game.totalXP.toLocaleString()} total XP earned
              </p>
            </CardContent>
          </Card>

          {/* Tier progress */}
          <Card>
            <CardHeader>
              <CardTitle>Tier Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {TIERS.map((tier, i) => (
                  <div key={tier} className="flex items-center gap-2">
                    <Badge
                      variant={
                        tier === game.tier
                          ? 'default'
                          : TIERS.indexOf(tier) < TIERS.indexOf(game.tier)
                            ? 'secondary'
                            : 'outline'
                      }
                    >
                      {tier}
                    </Badge>
                    {i < TIERS.length - 1 && <Separator className="w-4" orientation="horizontal" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Streak */}
          {game.streakCount > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold">{game.streakCount}</div>
                  <div>
                    <p className="font-medium">consecutive days</p>
                    <p className="text-muted-foreground text-sm">
                      {game.streakActive
                        ? 'Streak active — +20% XP bonus!'
                        : `${3 - game.streakCount} more days to activate bonus`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Stats */}
      <h2 className="text-lg font-semibold">Statistics</h2>
      <StatsGrid stats={profile?.stats} />
    </div>
  );
}
