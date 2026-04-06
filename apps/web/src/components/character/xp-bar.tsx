'use client';

import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  className?: string;
}

export function XPBar({ currentXP, nextLevelXP, className }: XPBarProps) {
  const target = nextLevelXP > 0 ? (currentXP / nextLevelXP) * 100 : 0;
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setPercent(target), 50);
    return () => clearTimeout(timeout);
  }, [target]);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="bg-muted relative h-3 w-full overflow-hidden rounded-full">
        <div
          className="bg-primary absolute inset-y-0 left-0 rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="text-muted-foreground text-sm">
        {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
      </p>
    </div>
  );
}
