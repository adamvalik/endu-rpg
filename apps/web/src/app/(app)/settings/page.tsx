'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useDeleteAccount, useDisconnectStrava, useUpdateProfile } from '@/hooks/use-mutations';
import { useUserProfile } from '@/hooks/use-user-profile';

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
  const { data: profileData } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const disconnectStrava = useDisconnectStrava();
  const deleteAccount = useDeleteAccount();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const profile = profileData?.profile;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: standardSchemaResolver(profileSchema),
  });

  useEffect(() => {
    if (profile?.displayName) {
      reset({ displayName: profile.displayName });
    }
  }, [profile?.displayName, reset]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your display name</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => updateProfile.mutate(data.displayName))}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="displayName">Display name</Label>
              <Input id="displayName" {...register('displayName')} />
              {errors.displayName && (
                <p className="text-destructive text-sm">{errors.displayName.message}</p>
              )}
            </div>
            <Button type="submit" disabled={updateProfile.isPending} className="self-start">
              {updateProfile.isPending ? 'Saving...' : 'Save'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Strava */}
      <Card>
        <CardHeader>
          <CardTitle>Strava</CardTitle>
          <CardDescription>
            {profile?.stravaConnected
              ? `Connected as ${profile.stravaFirstname} ${profile.stravaLastname}`
              : 'Not connected'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile?.stravaConnected ? (
            <Button
              variant="outline"
              onClick={() => disconnectStrava.mutate()}
              disabled={disconnectStrava.isPending}
            >
              {disconnectStrava.isPending ? 'Disconnecting...' : 'Disconnect Strava'}
            </Button>
          ) : (
            <Button asChild>
              <a href="/strava/connect">Connect Strava</a>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Permanently delete your account and all data</CardDescription>
        </CardHeader>
        <CardContent>
          {confirmDelete ? (
            <div className="flex items-center gap-3">
              <p className="text-sm">Are you sure?</p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteAccount.mutate()}
                disabled={deleteAccount.isPending}
              >
                {deleteAccount.isPending ? 'Deleting...' : 'Yes, delete'}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
              Delete Account
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
