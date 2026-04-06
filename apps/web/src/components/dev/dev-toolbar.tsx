'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bug, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useGameProfile } from '@/hooks/use-game-profile';
import { queryKeys } from '@/lib/api/query-keys';
import { addDebugXP } from '@/lib/firebase/functions';

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

const QUICK_XP = [100, 500, 1000, 5000];

export function DevToolbar() {
  const [customXP, setCustomXP] = useState('');
  const { data: gameData } = useGameProfile();
  const debugXP = useDebugXP();

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
