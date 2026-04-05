'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Navbar } from '@/components/layout/navbar';
import { useAuth } from '@/hooks/use-auth';
import { Providers } from '@/lib/providers';

function AppGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
    </>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AppGuard>{children}</AppGuard>
    </Providers>
  );
}
