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

const TIER_LABELS: Record<CharacterTier, { name: string; blurb: string }> = {
  wanderer: { name: 'Wanderer', blurb: 'A traveler setting out on their first journey.' },
  scout: { name: 'Scout', blurb: 'Learning the ways of the wild.' },
  ranger: { name: 'Ranger', blurb: 'A seasoned explorer of trails and roads.' },
  warrior: { name: 'Warrior', blurb: 'Proven through sweat and endurance.' },
  champion: { name: 'Champion', blurb: 'Known throughout the realm for their feats.' },
  hero: { name: 'Hero', blurb: 'Inspires others to take up the path.' },
  legend: { name: 'Legend', blurb: 'Their name echoes across the land.' },
  mythic: { name: 'Mythic', blurb: 'Transcended mortal limits.' },
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
            {tierUp ? `${TIER_LABELS[tierUp].name} Unlocked!` : `Level ${levelUp}!`}
          </DialogTitle>
          <DialogDescription className="text-base">
            {tierUp ? TIER_LABELS[tierUp].blurb : 'You leveled up! Keep going.'}
          </DialogDescription>
        </DialogHeader>
        <div className="text-muted-foreground text-sm">
          {game.totalXP.toLocaleString()} total XP
        </div>
      </DialogContent>
    </Dialog>
  );
}
