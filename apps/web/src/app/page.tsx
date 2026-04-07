'use client';

import { Activity, ChevronRight, Shield, Swords, TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';

import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Providers } from '@/lib/providers';

const features = [
  {
    icon: Activity,
    title: 'Sync with Strava',
    description: 'Automatically import your runs, rides, and workouts',
  },
  {
    icon: Zap,
    title: 'Earn XP',
    description: 'Every activity earns experience points based on effort',
  },
  {
    icon: TrendingUp,
    title: 'Level Up',
    description: 'Progress through levels and unlock new milestones',
  },
  {
    icon: Shield,
    title: 'Build Your Character',
    description: 'Grow stats like endurance, strength, and speed',
  },
];

function LandingContent() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2 font-bold">
          <Swords className="h-5 w-5" />
          Endu RPG
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!loading && !isAuthenticated && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/login">Log in</Link>
            </Button>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center gap-12 px-4 pb-20">
        <div className="flex max-w-lg flex-col items-center gap-4 text-center">
          <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-2xl">
            <Swords className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Turn your workouts into an adventure
          </h1>
          <p className="text-muted-foreground text-lg">
            Connect Strava, earn XP from real-world activities, and level up your character.
          </p>
          <div className="mt-2 flex gap-3">
            {loading ? null : isAuthenticated ? (
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/signup">
                    Get Started
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Log in</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features grid */}
        <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card border-border flex items-start gap-4 rounded-xl border p-5"
            >
              <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-muted-foreground border-t px-6 py-4 text-center text-sm">
        Endu RPG &mdash; Your fitness journey, gamified.
      </footer>
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
