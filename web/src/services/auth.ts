import { auth, functions } from '@/lib/firebaseConfig'
import { httpsCallable } from 'firebase/functions'
import { signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth'
import type { SignUpOrLogInResponse } from '@shared/types'

const signUpOrLogInFunction = httpsCallable<
  { email: string; password: string; displayName?: string },
  SignUpOrLogInResponse
>(functions, 'signUpOrLogIn')

export const signUpOrLogIn = async (
  email: string,
  password: string,
  displayName?: string
): Promise<SignUpOrLogInResponse> => {
  try {
    const result = await signUpOrLogInFunction({ email, password, displayName })
    const data = result.data

    // Sign in with custom token
    await signInWithCustomToken(auth, data.customToken)

    return data
  } catch (error: any) {
    console.error('Error in signUpOrLogIn:', error)
    throw new Error(error.message || 'Failed to sign up or sign in')
  }
}

export const signOut = async () => {
  try {
    await firebaseSignOut(auth)
  } catch (error: any) {
    console.error('Error signing out:', error)
    throw new Error(error.message || 'Failed to sign out')
  }
}

export const getCurrentUser = () => {
  return auth.currentUser
}
