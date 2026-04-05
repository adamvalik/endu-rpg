'use client';

import { Progress } from '@/components/ui/progress';

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
}

export function XPBar({ currentXP, nextLevelXP }: XPBarProps) {
  const percent = nextLevelXP > 0 ? (currentXP / nextLevelXP) * 100 : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <Progress value={percent} className="h-3" />
      <p className="text-muted-foreground text-sm">
        {currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
      </p>
    </div>
  );
}
