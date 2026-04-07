'use client';

import type { CharacterTier, GameProfile } from '@endu/shared/types';
import { useEffect, useRef, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const TIER_LABELS: Record<CharacterTier, string> = {
  Novice: 'You take your first steps on the path.',
  Apprentice: 'Your dedication is paying off. Keep pushing.',
  Expert: 'Few have reached this far. You are among the elite.',
  Master: 'You have conquered the summit. Legendary.',
};

interface LevelUpModalProps {
  game: GameProfile | undefined;
}

export function LevelUpModal({ game }: LevelUpModalProps) {
  const [open, setOpen] = useState(false);
  const [levelUp, setLevelUp] = useState<number | null>(null);
  const [tierUp, setTierUp] = useState<CharacterTier | null>(null);
  const prevRef = useRef<{ level: number; tier: CharacterTier } | null>(null);

  useEffect(() => {
    if (!game) return;

    const prev = prevRef.current;
    if (prev && (game.level > prev.level || game.tier !== prev.tier)) {
      setLevelUp(game.level);
      setTierUp(game.tier !== prev.tier ? game.tier : null);
      setOpen(true);
    }
    prevRef.current = { level: game.level, tier: game.tier };
  }, [game?.level, game?.tier]);

  if (!game) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="text-center sm:max-w-sm">
        <DialogHeader className="items-center">
          <div className="mb-2 text-5xl">{tierUp ? '⚔️' : '🎉'}</div>
          <DialogTitle className="text-2xl">
            {tierUp ? `${tierUp} Unlocked!` : `Level ${levelUp}!`}
          </DialogTitle>
          <DialogDescription className="text-base">
            {tierUp ? TIER_LABELS[tierUp] : 'You leveled up! Keep going.'}
          </DialogDescription>
        </DialogHeader>
        <div className="text-muted-foreground text-sm">
          {game.totalXP.toLocaleString()} total XP
        </div>
      </DialogContent>
    </Dialog>
  );
}
