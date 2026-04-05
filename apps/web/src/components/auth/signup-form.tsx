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
import { useSignUp } from '@/hooks/use-mutations';

const signupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().min(1, 'Display name is required'),
});

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const signUp = useSignUp();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: standardSchemaResolver(signupSchema),
  });

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <Swords className="mx-auto mb-2 h-8 w-8" />
        <CardTitle className="text-2xl">Sign up</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => signUp.mutate(data))}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="displayName">Display name</Label>
            <Input id="displayName" placeholder="Your name" {...register('displayName')} />
            {errors.displayName && (
              <p className="text-destructive text-sm">{errors.displayName.message}</p>
            )}
          </div>
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
          <Button type="submit" disabled={signUp.isPending} className="mt-2">
            {signUp.isPending ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-foreground underline">
            Log in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
