import type { GameConfig } from '@endu/shared/config';

export type SimActivityType =
  | 'Run'
  | 'Walk'
  | 'Hike'
  | 'Ride'
  | 'Swim'
  | 'Workout'
  | 'Yoga'
  | 'NordicSki'
  | 'AlpineSki';

export interface SimActivity {
  type: SimActivityType;
  km?: number;
  minutes?: number;
  elevationM?: number;
}

export interface WeeklyPlan {
  perWeek: SimActivity[];
  activeDays: number;
}

function xpPerKm(type: SimActivityType, cfg: GameConfig): number {
  switch (type) {
    case 'Run':
      return cfg.XP_PER_KM_RUN;
    case 'Walk':
    case 'Hike':
      return cfg.XP_PER_KM_WALK;
    case 'Ride':
      return cfg.XP_PER_KM_RIDE;
    case 'Swim':
      return cfg.XP_PER_KM_SWIM;
    case 'NordicSki':
      return cfg.XP_PER_KM_XC_SKI;
    case 'AlpineSki':
      return cfg.XP_PER_KM_SKI;
    default:
      return 0;
  }
}

function xpPerMin(type: SimActivityType, cfg: GameConfig): number {
  if (type === 'Workout') return cfg.XP_PER_MIN_WORKOUT;
  if (type === 'Yoga') return cfg.XP_PER_MIN_YOGA;
  return 0;
}

function activityMatchesClass(
  type: SimActivityType,
  cls: keyof GameConfig['CLASS_ACTIVITY_GROUPS'] | null,
  cfg: GameConfig,
): boolean {
  if (!cls) return false;
  const groups = cfg.CLASS_ACTIVITY_GROUPS[cls] as readonly string[];
  for (const group of groups) {
    const types = cfg[group as keyof GameConfig] as readonly string[];
    if (types && types.includes(type)) return true;
  }
  return false;
}

export interface SimXPOptions {
  isFirstOfDay: boolean;
  streakActive: boolean;
  characterClass: keyof GameConfig['CLASS_ACTIVITY_GROUPS'] | null;
}

export function xpForActivity(activity: SimActivity, cfg: GameConfig, opts: SimXPOptions): number {
  let base = 0;
  if (activity.km && xpPerKm(activity.type, cfg) > 0) {
    base += activity.km * xpPerKm(activity.type, cfg);
  } else if (activity.minutes && xpPerMin(activity.type, cfg) > 0) {
    base += activity.minutes * xpPerMin(activity.type, cfg);
  }
  if (activity.elevationM) {
    base += activity.elevationM * cfg.XP_PER_M_ELEVATION;
  }

  if (activityMatchesClass(activity.type, opts.characterClass, cfg)) {
    base *= cfg.BONUSES.CLASS_BONUS_MULTIPLIER;
  }
  if (opts.streakActive) {
    base *= cfg.BONUSES.STREAK_BONUS_MULTIPLIER;
  }
  if (opts.isFirstOfDay) {
    base += cfg.BONUSES.DAILY_LOGIN_XP;
  }
  return Math.floor(base);
}

export function xpRequiredForLevel(level: number, cfg: GameConfig): number {
  if (level <= 1) return 0;
  return Math.floor(cfg.LEVELING.A * level * level + cfg.LEVELING.B * level);
}

export function levelForTotalXP(totalXP: number, cfg: GameConfig): number {
  let level = 1;
  while (totalXP >= xpRequiredForLevel(level + 1, cfg)) level++;
  return level;
}

export interface WeekPoint {
  week: number;
  totalXP: number;
  level: number;
  gold: number;
  streakDays: number;
}

export function simulateWeeks(
  plan: WeeklyPlan,
  cfg: GameConfig,
  weeks: number,
  characterClass: keyof GameConfig['CLASS_ACTIVITY_GROUPS'] | null = null,
): WeekPoint[] {
  const points: WeekPoint[] = [];
  let totalXP = 0;
  let gold = 0;
  let streakDays = 0;
  let prevLevel = 1;

  for (let w = 1; w <= weeks; w++) {
    streakDays += plan.activeDays;
    const streakActive = streakDays >= cfg.STREAK.THRESHOLD;

    let weekXP = 0;
    let activityIdx = 0;
    const activitiesPerDay = Math.max(1, Math.round(plan.perWeek.length / plan.activeDays));
    for (let d = 0; d < plan.activeDays; d++) {
      let isFirst = true;
      for (let k = 0; k < activitiesPerDay && activityIdx < plan.perWeek.length; k++) {
        const act = plan.perWeek[activityIdx++];
        weekXP += xpForActivity(act, cfg, {
          isFirstOfDay: isFirst,
          streakActive,
          characterClass,
        });
        isFirst = false;
      }
    }
    while (activityIdx < plan.perWeek.length) {
      const act = plan.perWeek[activityIdx++];
      weekXP += xpForActivity(act, cfg, {
        isFirstOfDay: false,
        streakActive,
        characterClass,
      });
    }

    totalXP += weekXP;
    const level = levelForTotalXP(totalXP, cfg);
    for (let l = prevLevel + 1; l <= level; l++) {
      gold += cfg.LEVEL_UP_GOLD.base + cfg.LEVEL_UP_GOLD.perLevel * l;
    }
    prevLevel = level;

    points.push({ week: w, totalXP, level, gold, streakDays });
  }
  return points;
}
