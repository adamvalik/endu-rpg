'use client';

import { GAME_CONFIG, type GameConfig } from '@endu/shared/config';
import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { type ArchetypeId, ARCHETYPES } from '@/lib/sim/archetypes';
import { simulateWeeks } from '@/lib/sim/engine';

type EditableClass = keyof GameConfig['CLASS_ACTIVITY_GROUPS'] | 'none';

// Deep clone so edits don't mutate the shared config.
function cloneConfig(cfg: GameConfig): GameConfig {
  return JSON.parse(JSON.stringify(cfg)) as GameConfig;
}

interface NumericFieldProps {
  label: string;
  value: number;
  step?: number;
  onChange: (next: number) => void;
}
function NumericField({ label, value, step = 1, onChange }: NumericFieldProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <Label className="text-xs">{label}</Label>
      <Input
        type="number"
        step={step}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) onChange(n);
        }}
        className="h-7 w-24 text-xs"
      />
    </div>
  );
}

const WEEKS = 52;

export default function SimulatorPage() {
  const [cfg, setCfg] = useState<GameConfig>(() => cloneConfig(GAME_CONFIG as GameConfig));
  const [characterClass, setCharacterClass] = useState<EditableClass>('none');
  const [archetypeId, setArchetypeId] = useState<ArchetypeId>('regular');

  const series = useMemo(() => {
    const cls = characterClass === 'none' ? null : characterClass;
    return ARCHETYPES.map((a) => ({
      id: a.id,
      label: a.label,
      points: simulateWeeks(a.plan, cfg, WEEKS, cls),
    }));
  }, [cfg, characterClass]);

  const combinedChartData = useMemo(() => {
    const rows: { week: number } & Record<string, number> = [] as any;
    const byWeek: Record<number, Record<string, number>> = {};
    for (const s of series) {
      for (const p of s.points) {
        byWeek[p.week] = byWeek[p.week] || { week: p.week };
        byWeek[p.week][`${s.id}_level`] = p.level;
        byWeek[p.week][`${s.id}_xp`] = p.totalXP;
        byWeek[p.week][`${s.id}_gold`] = p.gold;
      }
    }
    return Object.values(byWeek).sort((a: any, b: any) => a.week - b.week);
  }, [series]);

  const activeArchetype = series.find((s) => s.id === archetypeId)!;
  const activePoint = activeArchetype.points[activeArchetype.points.length - 1];

  const reset = () => setCfg(cloneConfig(GAME_CONFIG as GameConfig));

  const copyAsTS = async () => {
    const body = JSON.stringify(cfg, null, 2);
    const ts = `export const GAME_CONFIG = ${body};\n`;
    try {
      await navigator.clipboard.writeText(ts);
      toast.success('Config copied to clipboard as TypeScript');
    } catch {
      toast.error('Could not access clipboard');
    }
  };

  const update = (mutator: (draft: GameConfig) => void) => {
    setCfg((prev) => {
      const next = cloneConfig(prev);
      mutator(next);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Balancing Simulator</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={reset}>
            Reset
          </Button>
          <Button size="sm" onClick={copyAsTS}>
            Copy as TypeScript
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground text-sm">
        Model casual / regular / hardcore archetypes across {WEEKS} weeks. Tune values on the left,
        watch the curves update. Paste the exported config back into
        <code className="bg-muted mx-1 rounded px-1 text-xs">
          packages/shared/config/game.config.ts
        </code>
        and its backend mirror.
      </p>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[360px_1fr]">
        {/* Config editor */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Leveling</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <NumericField
                label="A (L² coefficient)"
                value={cfg.LEVELING.A}
                onChange={(n) => update((d) => (d.LEVELING.A = n))}
              />
              <NumericField
                label="B (L coefficient)"
                value={cfg.LEVELING.B}
                onChange={(n) => update((d) => (d.LEVELING.B = n))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">XP rates</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <NumericField
                label="Run XP/km"
                value={cfg.XP_PER_KM_RUN}
                onChange={(n) => update((d) => (d.XP_PER_KM_RUN = n))}
              />
              <NumericField
                label="Walk XP/km"
                value={cfg.XP_PER_KM_WALK}
                onChange={(n) => update((d) => (d.XP_PER_KM_WALK = n))}
              />
              <NumericField
                label="Ride XP/km"
                value={cfg.XP_PER_KM_RIDE}
                onChange={(n) => update((d) => (d.XP_PER_KM_RIDE = n))}
              />
              <NumericField
                label="Swim XP/km"
                value={cfg.XP_PER_KM_SWIM}
                onChange={(n) => update((d) => (d.XP_PER_KM_SWIM = n))}
              />
              <NumericField
                label="XC Ski XP/km"
                value={cfg.XP_PER_KM_XC_SKI}
                onChange={(n) => update((d) => (d.XP_PER_KM_XC_SKI = n))}
              />
              <NumericField
                label="Alpine Ski XP/km"
                value={cfg.XP_PER_KM_SKI}
                onChange={(n) => update((d) => (d.XP_PER_KM_SKI = n))}
              />
              <NumericField
                label="Workout XP/min"
                value={cfg.XP_PER_MIN_WORKOUT}
                onChange={(n) => update((d) => (d.XP_PER_MIN_WORKOUT = n))}
              />
              <NumericField
                label="Yoga XP/min"
                value={cfg.XP_PER_MIN_YOGA}
                onChange={(n) => update((d) => (d.XP_PER_MIN_YOGA = n))}
              />
              <NumericField
                label="Elevation XP/m"
                value={cfg.XP_PER_M_ELEVATION}
                onChange={(n) => update((d) => (d.XP_PER_M_ELEVATION = n))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Bonuses</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <NumericField
                label="Daily login XP"
                value={cfg.BONUSES.DAILY_LOGIN_XP}
                onChange={(n) => update((d) => (d.BONUSES.DAILY_LOGIN_XP = n))}
              />
              <NumericField
                label="Class multiplier"
                step={0.05}
                value={cfg.BONUSES.CLASS_BONUS_MULTIPLIER}
                onChange={(n) => update((d) => (d.BONUSES.CLASS_BONUS_MULTIPLIER = n))}
              />
              <NumericField
                label="Streak multiplier"
                step={0.05}
                value={cfg.BONUSES.STREAK_BONUS_MULTIPLIER}
                onChange={(n) => update((d) => (d.BONUSES.STREAK_BONUS_MULTIPLIER = n))}
              />
              <NumericField
                label="Streak threshold (days)"
                value={cfg.STREAK.THRESHOLD}
                onChange={(n) => update((d) => (d.STREAK.THRESHOLD = n))}
              />
              <Separator />
              <div className="flex items-center justify-between gap-2">
                <Label className="text-xs">Character class</Label>
                <select
                  className="bg-background h-7 rounded border px-2 text-xs"
                  value={characterClass}
                  onChange={(e) => setCharacterClass(e.target.value as EditableClass)}
                >
                  <option value="none">Novice (no class)</option>
                  <option value="strider">Strider (run)</option>
                  <option value="voyager">Voyager (ride)</option>
                  <option value="mountaineer">Mountaineer (walk)</option>
                  <option value="aquanaut">Aquanaut (swim)</option>
                  <option value="titan">Titan (workout)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Level-up gold</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <NumericField
                label="Base"
                value={cfg.LEVEL_UP_GOLD.base}
                onChange={(n) => update((d) => (d.LEVEL_UP_GOLD.base = n))}
              />
              <NumericField
                label="Per level"
                value={cfg.LEVEL_UP_GOLD.perLevel}
                onChange={(n) => update((d) => (d.LEVEL_UP_GOLD.perLevel = n))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Level over 52 weeks — all archetypes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer>
                  <LineChart data={combinedChartData as any[]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="week"
                      label={{ value: 'Week', position: 'insideBottom', offset: -2 }}
                    />
                    <YAxis label={{ value: 'Level', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="casual_level"
                      name="Casual"
                      stroke="#94a3b8"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="regular_level"
                      name="Regular"
                      stroke="#3b82f6"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="hardcore_level"
                      name="Hardcore"
                      stroke="#ef4444"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Total XP</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer>
                    <LineChart data={combinedChartData as any[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="casual_xp"
                        name="Casual"
                        stroke="#94a3b8"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="regular_xp"
                        name="Regular"
                        stroke="#3b82f6"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="hardcore_xp"
                        name="Hardcore"
                        stroke="#ef4444"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Cumulative gold from level-ups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-56">
                  <ResponsiveContainer>
                    <LineChart data={combinedChartData as any[]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="casual_gold"
                        name="Casual"
                        stroke="#94a3b8"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="regular_gold"
                        name="Regular"
                        stroke="#3b82f6"
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="hardcore_gold"
                        name="Hardcore"
                        stroke="#ef4444"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Archetype inspector</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex gap-2">
                {ARCHETYPES.map((a) => (
                  <Button
                    key={a.id}
                    size="sm"
                    variant={a.id === archetypeId ? 'default' : 'outline'}
                    onClick={() => setArchetypeId(a.id)}
                  >
                    {a.label}
                  </Button>
                ))}
              </div>
              <p className="text-muted-foreground text-xs">
                {ARCHETYPES.find((a) => a.id === archetypeId)!.description}
              </p>
              <Separator />
              <div className="grid grid-cols-3 gap-2 text-sm">
                <Stat label="Week 52 level" value={activePoint.level} />
                <Stat label="Total XP" value={activePoint.totalXP.toLocaleString()} />
                <Stat label="Gold earned" value={activePoint.gold.toLocaleString()} />
                <Stat
                  label="Weeks to Lv10"
                  value={activeArchetype.points.find((p) => p.level >= 10)?.week ?? `>${WEEKS}`}
                />
                <Stat
                  label="Weeks to Lv25"
                  value={activeArchetype.points.find((p) => p.level >= 25)?.week ?? `>${WEEKS}`}
                />
                <Stat
                  label="Weeks to Lv50"
                  value={activeArchetype.points.find((p) => p.level >= 50)?.week ?? `>${WEEKS}`}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
