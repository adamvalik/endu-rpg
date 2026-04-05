'use client';

import type { CharacterTier } from '@endu/shared/types';

import { Badge } from '@/components/ui/badge';

const tierVariant: Record<CharacterTier, 'default' | 'secondary' | 'outline'> = {
  Novice: 'outline',
  Apprentice: 'secondary',
  Expert: 'default',
  Master: 'default',
};

export function TierBadge({ tier }: { tier: CharacterTier }) {
  return <Badge variant={tierVariant[tier]}>{tier}</Badge>;
}
