'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { Swords } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/hooks/use-mutations';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: standardSchemaResolver(loginSchema),
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <Swords className="mx-auto mb-2 h-8 w-8" />
        <CardTitle className="text-2xl">Log in</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => login.mutate(data))} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...register('email')} />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••" {...register('password')} />
            {errors.password && (
              <p className="text-destructive text-sm">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" disabled={login.isPending} className="mt-2">
            {login.isPending ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-foreground underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
