import { makeRedirectUri, ResponseType } from 'expo-auth-session';
import { STRAVA_CONFIG } from '../constants/config';

export const getStravaRedirectUri = (): string => {
  return makeRedirectUri({
    native: `${STRAVA_CONFIG.REDIRECT_SCHEME}://localhost/${STRAVA_CONFIG.REDIRECT_PATH}`,
  });
};

export const createStravaAuthRequest = () => {
  return {
    clientId: STRAVA_CONFIG.CLIENT_ID,
    scopes: STRAVA_CONFIG.SCOPES,
    redirectUri: getStravaRedirectUri(),
    responseType: ResponseType.Code,
  };
};
