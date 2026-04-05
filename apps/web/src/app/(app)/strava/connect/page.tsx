'use client';

import { ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function buildStravaOAuthUrl() {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/strava/callback`;

  const params = new URLSearchParams({
    client_id: clientId || '',
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'activity:read_all',
    approval_prompt: 'auto',
  });

  return `https://www.strava.com/oauth/authorize?${params.toString()}`;
}

export default function StravaConnectPage() {
  const handleConnect = () => {
    window.location.href = buildStravaOAuthUrl();
  };

  return (
    <div className="flex items-center justify-center py-20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connect Strava</CardTitle>
          <CardDescription>
            Link your Strava account to automatically sync your activities and earn XP.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <ul className="text-muted-foreground space-y-2 text-sm">
            <li>Sync your runs, rides, swims and more</li>
            <li>Earn XP and level up your character</li>
            <li>Build streaks for bonus XP</li>
          </ul>
          <Button onClick={handleConnect} size="lg" className="w-full">
            <ExternalLink className="mr-2 h-4 w-4" />
            Connect with Strava
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
