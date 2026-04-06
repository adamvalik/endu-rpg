'use client';

import { Flame } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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

interface StreakDisplayProps {
  count: number;
  active: boolean;
}

export function StreakDisplay({ count, active }: StreakDisplayProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold',
            active
              ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400'
              : 'bg-muted text-muted-foreground',
          )}
        >
          {count}
        </div>
        <div>
          <div className="flex items-center gap-1.5 font-medium">
            <Flame
              className={cn('h-4 w-4', active ? 'text-orange-500' : 'text-muted-foreground')}
            />
            {count} day streak
          </div>
          <p className="text-muted-foreground text-sm">
            {active
              ? 'Streak active — +20% XP bonus!'
              : count >= 3
                ? 'Keep it going!'
                : `${3 - count} more day${3 - count === 1 ? '' : 's'} to activate +20% bonus`}
          </p>
        </div>
      </div>

      {/* Last 7 days dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => {
          const dayIndex = 6 - i; // 6 = oldest, 0 = today
          const filled = dayIndex < count;
          return (
            <div
              key={i}
              className={cn(
                'h-2.5 flex-1 rounded-full transition-colors',
                filled ? (active ? 'bg-orange-500' : 'bg-primary') : 'bg-muted',
              )}
            />
          );
        })}
      </div>
      <div className="text-muted-foreground flex justify-between text-[10px]">
        <span>7d ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
