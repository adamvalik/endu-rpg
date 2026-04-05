'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FirebaseError } from 'firebase/app';
import { signInWithCustomToken, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { queryKeys } from '@/lib/api/query-keys';
import { getAuth } from '@/lib/firebase/config';
import * as api from '@/lib/firebase/functions';

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof FirebaseError) {
    const details = (error as FirebaseError & { details?: unknown }).details;
    console.error(`[${error.code}] ${error.message}`, { details, customData: error.customData });
    // FirebaseError.message for callable internal errors is just "INTERNAL"
    // — prefer details or fallback in that case
    if (details && typeof details === 'string') return details;
    if (error.message && error.message !== 'INTERNAL') return error.message;
    return fallback;
  }
  if (error instanceof Error) {
    console.error(error);
    return error.message || fallback;
  }
  console.error(error);
  return fallback;
}

export function useSignUp() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { email: string; password: string; displayName: string }) => {
      const result = await api.signUpOrLogIn(data);
      await signInWithCustomToken(getAuth(), result.customToken);
      return result;
    },
    onSuccess: () => router.push('/dashboard'),
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to sign up')),
  });
}

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await api.signUpOrLogIn(data);
      await signInWithCustomToken(getAuth(), result.customToken);
      return result;
    },
    onSuccess: () => router.push('/dashboard'),
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to log in')),
  });
}

export function useConnectStrava() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (code: string) => api.exchangeCodeForToken({ code }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
      router.push('/dashboard');
      toast.success('Strava connected!');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to connect Strava')),
  });
}

export function useSyncActivities() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.fetchStravaActivities({ page: 1, perPage: 30 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.gameProfile });
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
      toast.success('Activities synced!');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to sync activities')),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (displayName: string) => api.updateUserProfile({ displayName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
      toast.success('Profile updated!');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to update profile')),
  });
}

export function useDisconnectStrava() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.disconnectStrava(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userProfile });
      toast.success('Strava disconnected');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to disconnect Strava')),
  });
}

export function useDeleteAccount() {
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await api.deleteUserAccount();
      await signOut(getAuth());
    },
    onSuccess: () => {
      router.push('/');
      toast.success('Account deleted');
    },
    onError: (error) => toast.error(getErrorMessage(error, 'Failed to delete account')),
  });
}
