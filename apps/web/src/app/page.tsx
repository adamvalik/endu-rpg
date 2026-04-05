'use client';

import { Swords } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Providers } from '@/lib/providers';

function LandingContent() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <div className="flex flex-col items-center gap-3">
        <Swords className="h-12 w-12" />
        <h1 className="text-4xl font-bold tracking-tight">Endu RPG</h1>
        <p className="text-muted-foreground text-lg">Turn your workouts into an RPG adventure</p>
      </div>

      <div className="flex gap-3">
        {loading ? null : isAuthenticated ? (
          <Button asChild size="lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="lg">
              <Link href="/signup">Sign up</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Providers>
      <LandingContent />
    </Providers>
  );
}
