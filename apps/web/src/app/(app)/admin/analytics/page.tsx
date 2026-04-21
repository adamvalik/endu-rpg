'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { queryKeys } from '@/lib/api/query-keys';
import { getAdminActivityAnalytics } from '@/lib/firebase/functions';
import { cn } from '@/lib/utils';

const WINDOWS: Array<{ label: string; days: number }> = [
  { label: '7d', days: 7 },
  { label: '30d', days: 30 },
  { label: '90d', days: 90 },
];

function formatKm(meters: number): string {
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function AdminAnalyticsPage() {
  const [days, setDays] = useState(30);

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.admin.analytics({ days }),
    queryFn: () => getAdminActivityAnalytics({ days }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">Window</span>
        {WINDOWS.map((w) => (
          <Button
            key={w.days}
            variant={days === w.days ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDays(w.days)}
          >
            {w.label}
          </Button>
        ))}
      </div>

      {error && (
        <div className="text-destructive text-sm">
          Failed to load analytics: {error instanceof Error ? error.message : String(error)}
        </div>
      )}

      {isLoading || !data ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily activity count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <LineChart data={data.analytics.dailyCounts}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                        tickFormatter={(v: string) => v.slice(5)}
                      />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="#6366f1" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={data.analytics.byType}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" tick={{ fontSize: 10 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent activities</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">When</th>
                      <th className="px-3 py-2 text-left font-medium">User</th>
                      <th className="px-3 py-2 text-left font-medium">Name</th>
                      <th className="px-3 py-2 text-left font-medium">Type</th>
                      <th className="px-3 py-2 text-right font-medium">Distance</th>
                      <th className="px-3 py-2 text-right font-medium">Time</th>
                      <th className="px-3 py-2 text-right font-medium">XP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.analytics.recent.length === 0 ? (
                      <tr className="border-t">
                        <td
                          colSpan={7}
                          className={cn('text-muted-foreground px-3 py-8 text-center')}
                        >
                          No activities in this window.
                        </td>
                      </tr>
                    ) : (
                      data.analytics.recent.map((a) => (
                        <tr key={`${a.userId}-${a.id}`} className="hover:bg-muted/30 border-t">
                          <td className="px-3 py-2">
                            {new Date(a.startDate).toLocaleString([], {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="px-3 py-2">{a.userEmail ?? a.userId}</td>
                          <td className="px-3 py-2">{a.name}</td>
                          <td className="px-3 py-2">{a.type}</td>
                          <td className="px-3 py-2 text-right">{formatKm(a.distanceMeters)}</td>
                          <td className="px-3 py-2 text-right">
                            {formatDuration(a.movingTimeSeconds)}
                          </td>
                          <td className="px-3 py-2 text-right">{a.xpEarned}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
