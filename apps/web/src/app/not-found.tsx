import { Swords } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Swords className="text-muted-foreground h-16 w-16" />
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-muted-foreground text-lg">This path leads nowhere, adventurer.</p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Return to base</Link>
      </Button>
    </div>
  );
}
