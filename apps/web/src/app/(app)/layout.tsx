'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { DevToolbar } from '@/components/dev/dev-toolbar';
import { LevelUpModal } from '@/components/game/level-up-modal';
import { Navbar } from '@/components/layout/navbar';
import { useAuth } from '@/hooks/use-auth';
import { useGameProfile } from '@/hooks/use-game-profile';
import { Providers } from '@/lib/providers';

const isDev = process.env.NODE_ENV === 'development';

function AppGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const { data: gameData } = useGameProfile();
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
      {isDev && (
        <div className="bg-orange-500 px-3 py-1 text-center text-xs font-medium text-white">
          DEV — Emulators
        </div>
      )}
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
      <LevelUpModal game={gameData?.game} />
      {isDev && <DevToolbar />}
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
