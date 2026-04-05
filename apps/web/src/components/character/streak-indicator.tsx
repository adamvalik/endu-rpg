'use client';

import { Flame } from 'lucide-react';

import { Badge } from '@/components/ui/badge';

interface StreakIndicatorProps {
  count: number;
  active: boolean;
}

export function StreakIndicator({ count, active }: StreakIndicatorProps) {
  if (count === 0) return null;

  return (
    <Badge variant={active ? 'default' : 'outline'} className="gap-1">
      <Flame className="h-3.5 w-3.5" />
      {count}d streak
    </Badge>
  );
}
