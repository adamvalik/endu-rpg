'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bug, Mail, Minus, Plus, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useGameProfile } from '@/hooks/use-game-profile';
import { queryKeys } from '@/lib/api/query-keys';
import { addDebugXP, sendTestActivityEmail } from '@/lib/firebase/functions';

function useDebugXP() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (xpToAdd: number) => addDebugXP({ xpToAdd }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.gameProfile });
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
      toast.success(`XP updated → ${data.newTotalXP} XP, Level ${data.newLevel}`);
    },
    onError: () => toast.error('Failed to update XP'),
  });
}

function useTestEmail() {
  return useMutation({
    mutationFn: (data: { activityId: number; leveledUp?: boolean; oldLevel?: number }) =>
      sendTestActivityEmail(data),
    onSuccess: (data) => toast.success(data.message),
    onError: () => toast.error('Failed to send test email'),
  });
}

const QUICK_XP = [100, 500, 1000, 5000];

export function DevToolbar() {
  const [customXP, setCustomXP] = useState('');
  const [activityId, setActivityId] = useState('');
  const [simulateLevelUp, setSimulateLevelUp] = useState(false);
  const { data: gameData } = useGameProfile();
  const debugXP = useDebugXP();
  const testEmail = useTestEmail();

  const game = gameData?.game;

  const applyXP = (amount: number) => {
    debugXP.mutate(amount);
    setCustomXP('');
  };

  const resetXP = () => {
    if (!game) return;
    debugXP.mutate(-game.totalXP);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="fixed right-4 bottom-4 z-50 h-10 w-10 rounded-full border-orange-500/50 bg-orange-500/10 text-orange-600 shadow-lg hover:bg-orange-500/20 dark:text-orange-400"
        >
          <Bug className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-72">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">Dev Tools</h4>
            {game && (
              <span className="text-muted-foreground text-xs">
                Lv.{game.level} · {game.totalXP.toLocaleString()} XP
              </span>
            )}
          </div>

          <Separator />

          {/* Quick XP buttons */}
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-xs font-medium">Quick XP</span>
            <div className="grid grid-cols-4 gap-1.5">
              {QUICK_XP.map((xp) => (
                <Button
                  key={xp}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => applyXP(xp)}
                  disabled={debugXP.isPending}
                >
                  +{xp >= 1000 ? `${xp / 1000}k` : xp}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom XP input */}
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-xs font-medium">Custom XP</span>
            <div className="flex gap-1.5">
              <Input
                type="number"
                placeholder="Amount"
                value={customXP}
                onChange={(e) => setCustomXP(e.target.value)}
                className="h-8 text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => customXP && applyXP(Number(customXP))}
                disabled={!customXP || debugXP.isPending}
              >
                <Plus className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => customXP && applyXP(-Number(customXP))}
                disabled={!customXP || debugXP.isPending}
              >
                <Minus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Test Email */}
          <div className="flex flex-col gap-1.5">
            <span className="text-muted-foreground text-xs font-medium">Test Email</span>
            <div className="flex gap-1.5">
              <Input
                type="number"
                placeholder="Activity ID"
                value={activityId}
                onChange={(e) => setActivityId(e.target.value)}
                className="h-8 text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() =>
                  activityId &&
                  testEmail.mutate({
                    activityId: Number(activityId),
                    leveledUp: simulateLevelUp,
                    oldLevel: simulateLevelUp ? (game?.level ?? 1) - 1 : undefined,
                  })
                }
                disabled={!activityId || testEmail.isPending}
              >
                <Mail className="h-3.5 w-3.5" />
              </Button>
            </div>
            <label className="flex items-center gap-2">
              <Checkbox
                checked={simulateLevelUp}
                onCheckedChange={(v) => setSimulateLevelUp(v === true)}
              />
              <span className="text-muted-foreground text-xs">Simulate level-up</span>
            </label>
          </div>

          <Separator />

          {/* Reset */}
          <Button
            variant="destructive"
            size="sm"
            className="h-8 text-xs"
            onClick={resetXP}
            disabled={debugXP.isPending || !game?.totalXP}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset XP to 0
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
