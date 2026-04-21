'use client';

import type { AdminUserSortBy, ListAdminUsersData } from '@endu/shared/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { queryKeys } from '@/lib/api/query-keys';
import { listAdminUsers } from '@/lib/firebase/functions';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 25;

interface Column {
  key: AdminUserSortBy | 'displayName' | 'tier';
  label: string;
  sortable: boolean;
  align?: 'left' | 'right';
}

const columns: Column[] = [
  { key: 'email', label: 'Email', sortable: true },
  { key: 'displayName', label: 'Name', sortable: false },
  { key: 'level', label: 'Lvl', sortable: true, align: 'right' },
  { key: 'tier', label: 'Tier', sortable: false },
  { key: 'totalXP', label: 'XP', sortable: true, align: 'right' },
  { key: 'streakCount', label: 'Streak', sortable: true, align: 'right' },
  { key: 'activitiesCount', label: 'Acts', sortable: true, align: 'right' },
  { key: 'lastActivityDate', label: 'Last activity', sortable: true },
  { key: 'createdAt', label: 'Joined', sortable: true },
];

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString();
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<AdminUserSortBy>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const params: ListAdminUsersData = useMemo(
    () => ({ page, pageSize: PAGE_SIZE, sortBy, sortDir, search: search.trim() || undefined }),
    [page, sortBy, sortDir, search],
  );

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: queryKeys.admin.users(params),
    queryFn: () => listAdminUsers(params),
    placeholderData: keepPreviousData,
  });

  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  const onSort = (key: Column['key']) => {
    if (!columns.find((c) => c.key === key)?.sortable) return;
    const k = key as AdminUserSortBy;
    if (sortBy === k) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(k);
      setSortDir('desc');
    }
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search email, name, uid…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        {data && (
          <span className="text-muted-foreground text-sm">
            {data.total} user{data.total === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {error && (
        <div className="text-destructive text-sm">
          Failed to load users: {error instanceof Error ? error.message : String(error)}
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  {columns.map((c) => {
                    const active = c.sortable && sortBy === c.key;
                    return (
                      <th
                        key={c.key}
                        className={cn(
                          'px-3 py-2 text-left font-medium',
                          c.align === 'right' && 'text-right',
                          c.sortable && 'cursor-pointer select-none',
                        )}
                        onClick={() => onSort(c.key)}
                      >
                        <span className="inline-flex items-center gap-1">
                          {c.label}
                          {c.sortable &&
                            (active ? (
                              sortDir === 'asc' ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              )
                            ) : (
                              <ArrowUpDown className="h-3 w-3 opacity-40" />
                            ))}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {isLoading && !data ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="border-t">
                      <td colSpan={columns.length} className="px-3 py-2">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    </tr>
                  ))
                ) : data && data.users.length > 0 ? (
                  data.users.map((u) => (
                    <tr key={u.uid} className="hover:bg-muted/30 border-t">
                      <td className="px-3 py-2">
                        <span className="flex items-center gap-1">
                          {u.email}
                          {u.stravaConnected && (
                            <span
                              className="inline-block h-1.5 w-1.5 rounded-full bg-orange-500"
                              title="Strava connected"
                            />
                          )}
                        </span>
                      </td>
                      <td className="px-3 py-2">{u.displayName ?? '—'}</td>
                      <td className="px-3 py-2 text-right">{u.level}</td>
                      <td className="px-3 py-2">{u.tier ?? '—'}</td>
                      <td className="px-3 py-2 text-right">{u.totalXP.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right">
                        <span className={cn(u.streakActive && 'font-medium text-orange-500')}>
                          {u.streakCount}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right">{u.activitiesCount}</td>
                      <td className="px-3 py-2">{formatDate(u.lastActivityDate)}</td>
                      <td className="px-3 py-2">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t">
                    <td
                      colSpan={columns.length}
                      className="text-muted-foreground px-3 py-8 text-center"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          Page {data?.page ?? page} of {totalPages}
          {isFetching && ' · updating…'}
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
