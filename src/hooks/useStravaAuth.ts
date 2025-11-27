import { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { AuthSessionResult, useAuthRequest } from 'expo-auth-session';
import { createStravaAuthRequest } from '../services/strava';
import { exchangeStravaCode, getUserProfile } from '../services/firebase';
import { MockStravaOAuthResponse, StravaAuthData } from '../types';
import { getCurrentUser } from '../services/auth';
import { STRAVA_DISCOVERY } from '../constants/config';

WebBrowser.maybeCompleteAuthSession();

const REQUIRED_SCOPE = "read,activity:read_all";

// Mock response for testing - remove in production
// const MOCK_MODE = process.env.MOCK_STRAVA_AUTH === 'true';
// const mockResponse: MockStravaOAuthResponse = {
//   type: 'success',
//   params: { code: process.env.STRAVA_PERSONAL_CODE || 'no_code' }
// };

export const useStravaAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stravaData, setStravaData] = useState<StravaAuthData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checkedProfile, setCheckedProfile] = useState(false);

  // Setup Strava OAuth request
  const [request, response, promptAsync] = useAuthRequest(
    createStravaAuthRequest(),
    STRAVA_DISCOVERY
  );

  // MOCK_MODE
  // ? [null, mockResponse as MockStravaOAuthResponse, async () => {}]
  // : useAuthRequest(
  //     createStravaAuthRequest(),
  //     STRAVA_DISCOVERY
  //   );

  // Check if user already has Strava connected on mount
  useEffect(() => {
    const checkStravaConnection = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser || checkedProfile) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Checking if Strava is already connected...');
        const profile = (await getUserProfile()).profile;

        if (profile.stravaConnected && profile.stravaFirstname) {
          console.log('✅ Strava already connected for:', profile.stravaFirstname);
          // Create a mock StravaAuthData to indicate connection
          setStravaData({
            status: 'success',
            data: {
              athlete: {
                id: profile.stravaId || 0,
                firstname: profile.stravaFirstname,
                lastname: profile.stravaLastname || '',
              },
              access_token: 'existing', // Token is stored in backend
            },
          });
        }
      } catch (err) {
        console.error('Error checking Strava connection:', err);
      } finally {
        setIsLoading(false);
        setCheckedProfile(true);
      }
    };

    checkStravaConnection();
  }, []);

  useEffect(() => {
    console.log("Redirect URI:", createStravaAuthRequest().redirectUri);
    console.log("Auth hook response:", JSON.stringify(response, null, 2));

    if (response) {
      handleAuthResponse(response);
    }
  }, [response]);

  const handleAuthResponse = async (response: AuthSessionResult /* |  MockStravaOAuthResponse */) => {
    console.log("Handling auth response:", response);

    if (response.type === 'success') {
      const { code, scope, ...rest } = response.params;
      console.log('Code:', code.substring(0, 5) + '... and scope:', scope);

      if (scope !== REQUIRED_SCOPE) {
        setError('Required permissions not granted. Please allow all requested permissions.');
        setIsLoading(false);
      } else {
        console.log('✅ Auth Success! Got code:', code.substring(0, 5) + "... and required scope");
      }

      await handleCodeExchange(code);

    } else if (response.type === 'error') {
      setIsLoading(false);
      setError('Authentication failed');

    } else if (response.type === 'dismiss' || response.type === 'cancel') {
      console.log('User dismissed auth session');
      setIsLoading(false);
    }
  };

  const handleCodeExchange = async (code: string) => {
    setIsLoading(true);
    setError(null);

    // Check if user is authenticated
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError('Please sign in first to connect Strava');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Exchanging Strava code for authenticated user:', currentUser.email);
      const data = await exchangeStravaCode(code);
      if (data && data.status === 'success') {
        setStravaData(data);
      } else {
        setError('Failed to connect Strava account, something went wrong.');
        console.error('Unexpected response data:', data);
      }
    } catch (err: any) {
      const errorMessage = err.code === 'functions/unauthenticated'
        ? 'Please sign in first to connect Strava'
        : 'Failed to exchange code for token';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const startAuth = () => {
    // Check if user is authenticated before starting OAuth
    const currentUser = getCurrentUser();
    if (!currentUser) {
      setError('Please sign in first to connect Strava');
      return;
    }

    setError(null);
    setIsLoading(true);
    promptAsync();
  };

  return {
    isLoading,
    stravaData,
    error,
    startAuth,
    isAuthReady: !!request // || MOCK_MODE,
  };
};
