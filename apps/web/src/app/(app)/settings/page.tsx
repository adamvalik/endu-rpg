'use client';

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useDeleteAccount, useDisconnectStrava, useUpdateProfile } from '@/hooks/use-mutations';
import { useUserProfile } from '@/hooks/use-user-profile';

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
});

type ProfileValues = z.infer<typeof profileSchema>;

const CONFIRM_TEXT = 'DELETE';

export default function SettingsPage() {
  const { data: profileData } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const disconnectStrava = useDisconnectStrava();
  const deleteAccount = useDeleteAccount();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');

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

  const handleDelete = () => {
    deleteAccount.mutate(undefined, {
      onSuccess: () => setDeleteOpen(false),
    });
  };

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
          <Dialog
            open={deleteOpen}
            onOpenChange={(open) => {
              setDeleteOpen(open);
              if (!open) setConfirmInput('');
            }}
          >
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete your account?</DialogTitle>
                <DialogDescription>
                  This action is permanent and cannot be undone. All your data, activities, and
                  progress will be lost.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2">
                <Label htmlFor="confirm-delete">
                  Type <span className="font-mono font-bold">{CONFIRM_TEXT}</span> to confirm
                </Label>
                <Input
                  id="confirm-delete"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder={CONFIRM_TEXT}
                  autoComplete="off"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={confirmInput !== CONFIRM_TEXT || deleteAccount.isPending}
                >
                  {deleteAccount.isPending ? 'Deleting...' : 'Delete Account'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
