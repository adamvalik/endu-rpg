'use client';

import { BarChart3, LayoutDashboard, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';

const tabs = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !isAdmin) router.replace('/dashboard');
  }, [isAdmin, loading, router]);

  if (loading || !isAdmin) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin</h1>
        <p className="text-muted-foreground text-sm">Cross-user statistics and analytics.</p>
      </div>

      <nav className="flex gap-1 border-b">
        {tabs.map((tab) => {
          const active =
            tab.href === '/admin' ? pathname === tab.href : pathname?.startsWith(tab.href);
          return (
            <Button
              key={tab.href}
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                'rounded-b-none border-b-2 border-transparent',
                active && 'border-foreground',
              )}
            >
              <Link href={tab.href}>
                <tab.icon className="mr-1.5 h-4 w-4" />
                {tab.label}
              </Link>
            </Button>
          );
        })}
      </nav>

      <div>{children}</div>
    </div>
  );
}
