'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef } from 'react';

import { useConnectStrava } from '@/hooks/use-mutations';

function StravaCallbackHandler() {
  const searchParams = useSearchParams();
  const connectStrava = useConnectStrava();
  const called = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return;
    }

    if (code && !called.current) {
      called.current = true;
      connectStrava.mutate(code);
    }
  }, [searchParams]);

  if (searchParams.get('error')) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-destructive text-lg font-medium">Strava authorization was denied</p>
        <a href="/strava/connect" className="text-sm underline">
          Try again
        </a>
      </div>
    );
  }

  if (connectStrava.isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-destructive text-lg font-medium">Failed to connect Strava</p>
        <a href="/strava/connect" className="text-sm underline">
          Try again
        </a>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-20">
      <p className="text-muted-foreground">Connecting Strava...</p>
    </div>
  );
}

export default function StravaCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <StravaCallbackHandler />
    </Suspense>
  );
}
