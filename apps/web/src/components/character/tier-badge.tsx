'use client';

import type { CharacterTier } from '@endu/shared/types';

import { Badge } from '@/components/ui/badge';

const tierVariant: Record<CharacterTier, 'default' | 'secondary' | 'outline'> = {
  wanderer: 'outline',
  scout: 'outline',
  ranger: 'secondary',
  warrior: 'secondary',
  champion: 'default',
  hero: 'default',
  legend: 'default',
  mythic: 'default',
};

const tierLabel: Record<CharacterTier, string> = {
  wanderer: 'Wanderer',
  scout: 'Scout',
  ranger: 'Ranger',
  warrior: 'Warrior',
  champion: 'Champion',
  hero: 'Hero',
  legend: 'Legend',
  mythic: 'Mythic',
};

export function TierBadge({ tier }: { tier: CharacterTier }) {
  return <Badge variant={tierVariant[tier]}>{tierLabel[tier]}</Badge>;
}
