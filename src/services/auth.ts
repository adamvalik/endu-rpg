import { auth, functions } from '../../firebaseConfig';
import { httpsCallable } from 'firebase/functions';
import { signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth';
import { SignUpOrLogInResponse } from '../types';

const signUpOrLogInFunction = httpsCallable<
  { email: string; password: string; displayName?: string },
  SignUpOrLogInResponse
>(functions, 'signUpOrLogIn');

/**
 * Sign up a new user or logs in an existing user
 */
export const signUpOrLogIn = async (
  email: string,
  password: string,
  displayName?: string
): Promise<SignUpOrLogInResponse> => {
  try {
    const result = await signUpOrLogInFunction({ email, password, displayName });
    console.log('Calling signUpOrLogIn, result:', result);
    const data = result.data;

    // Sign in with the custom token
    await signInWithCustomToken(auth, data.customToken);
    console.log('Successfully signed in with custom token');

    return data;
  } catch (error: any) {
    console.error('Error in signUpOrLogIn:', error);
    throw new Error(error.message || 'Failed to sign up or sign in');
  }
};

/**
 * Sign up a new user
 */
export const signUp = async (
  email: string,
  password: string,
  displayName?: string
) => {
  return signUpOrLogIn(email, password, displayName);
};

/**
 * Sign in an existing user
 */
export const logIn = async (email: string, password: string) => {
  return signUpOrLogIn(email, password);
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    console.log('Signed out successfully');
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
