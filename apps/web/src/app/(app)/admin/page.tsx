'use client';

import { useQuery } from '@tanstack/react-query';
import { Activity, Link2, Trophy, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { queryKeys } from '@/lib/api/query-keys';
import { getAdminOverview } from '@/lib/firebase/functions';

function formatNumber(n: number): string {
  return new Intl.NumberFormat().format(n);
}

function formatKm(meters: number): string {
  return `${(meters / 1000).toFixed(1)} km`;
}

interface StatCardProps {
  title: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
}
function StatCard({ title, value, sub, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-muted-foreground text-xs">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminOverviewPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.admin.overview,
    queryFn: getAdminOverview,
  });

  if (error) {
    return (
      <div className="text-destructive text-sm">
        Failed to load overview: {error instanceof Error ? error.message : String(error)}
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  const { overview } = data;
  const stravaPct =
    overview.totalUsers > 0
      ? Math.round((overview.stravaConnectedCount / overview.totalUsers) * 100)
      : 0;

  const tierData = Object.entries(overview.tierDistribution).map(([tier, count]) => ({
    tier,
    count,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          title="Total users"
          value={formatNumber(overview.totalUsers)}
          sub={`+${overview.newUsersLast7d} last 7d · +${overview.newUsersLast30d} last 30d`}
          icon={Users}
        />
        <StatCard
          title="Strava connected"
          value={`${formatNumber(overview.stravaConnectedCount)} (${stravaPct}%)`}
          icon={Link2}
        />
        <StatCard
          title="Total activities"
          value={formatNumber(overview.totalActivities)}
          sub={formatKm(overview.totalDistanceMeters)}
          icon={Activity}
        />
        <StatCard title="Total XP" value={formatNumber(overview.totalXP)} icon={Trophy} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tier distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={tierData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tier" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Level histogram</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={overview.levelHistogram}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="level" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
