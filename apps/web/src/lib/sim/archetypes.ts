import type { WeeklyPlan } from './engine';

export type ArchetypeId = 'casual' | 'regular' | 'hardcore';

export interface Archetype {
  id: ArchetypeId;
  label: string;
  description: string;
  plan: WeeklyPlan;
}

export const ARCHETYPES: Archetype[] = [
  {
    id: 'casual',
    label: 'Casual (3×/week)',
    description: 'Weekend runner + one midweek walk.',
    plan: {
      activeDays: 3,
      perWeek: [
        { type: 'Run', km: 5, elevationM: 30 },
        { type: 'Walk', km: 4, elevationM: 10 },
        { type: 'Run', km: 8, elevationM: 60 },
      ],
    },
  },
  {
    id: 'regular',
    label: 'Regular (5×/week)',
    description: 'Mixed training — runs, a ride, and a gym session.',
    plan: {
      activeDays: 5,
      perWeek: [
        { type: 'Run', km: 6, elevationM: 40 },
        { type: 'Workout', minutes: 45 },
        { type: 'Ride', km: 30, elevationM: 200 },
        { type: 'Run', km: 10, elevationM: 80 },
        { type: 'Yoga', minutes: 30 },
      ],
    },
  },
  {
    id: 'hardcore',
    label: 'Hardcore (7×/week+)',
    description: 'Daily training with double days and big efforts.',
    plan: {
      activeDays: 7,
      perWeek: [
        { type: 'Run', km: 10, elevationM: 80 },
        { type: 'Ride', km: 50, elevationM: 400 },
        { type: 'Run', km: 6, elevationM: 40 },
        { type: 'Workout', minutes: 60 },
        { type: 'Run', km: 15, elevationM: 150 },
        { type: 'Swim', km: 2 },
        { type: 'Ride', km: 80, elevationM: 800 },
        { type: 'Workout', minutes: 45 },
      ],
    },
  },
];
