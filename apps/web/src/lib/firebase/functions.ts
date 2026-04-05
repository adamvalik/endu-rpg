import type {
  GameProfileResponse,
  GetActivitiesResponse,
  ProfileResponse,
  SignUpOrLogInResponse,
  StravaAuthData,
} from '@endu/shared/types';
import { httpsCallable } from 'firebase/functions';

import { getFunctions } from './config';

export const signUpOrLogIn = (data: { email: string; password: string; displayName?: string }) =>
  httpsCallable<typeof data, SignUpOrLogInResponse>(
    getFunctions(),
    'signUpOrLogIn',
  )(data).then((r) => r.data);

export const getUserProfile = () =>
  httpsCallable<void, ProfileResponse>(getFunctions(), 'getUserProfile')().then((r) => r.data);

export const updateUserProfile = (data: { displayName: string }) =>
  httpsCallable<typeof data, { status: string }>(
    getFunctions(),
    'updateUserProfile',
  )(data).then((r) => r.data);

export const deleteUserAccount = () =>
  httpsCallable<void, { status: string }>(getFunctions(), 'deleteUserAccount')().then(
    (r) => r.data,
  );

export const exchangeCodeForToken = (data: { code: string }) =>
  httpsCallable<typeof data, StravaAuthData>(
    getFunctions(),
    'exchangeCodeForToken',
  )(data).then((r) => r.data);

export const disconnectStrava = () =>
  httpsCallable<void, { status: string }>(getFunctions(), 'disconnectStrava')().then((r) => r.data);

export const fetchStravaActivities = (data?: { page?: number; perPage?: number }) =>
  httpsCallable<typeof data, GetActivitiesResponse>(
    getFunctions(),
    'fetchStravaActivities',
  )(data).then((r) => r.data);

export const getUserActivities = (data: { page: number; perPage: number }) =>
  httpsCallable<typeof data, GetActivitiesResponse>(
    getFunctions(),
    'getUserActivities',
  )(data).then((r) => r.data);

export const getGameProfile = () =>
  httpsCallable<void, GameProfileResponse>(getFunctions(), 'getGameProfile')().then((r) => r.data);
