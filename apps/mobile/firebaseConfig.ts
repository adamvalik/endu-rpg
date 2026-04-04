import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(app);
export const functions = getFunctions(app);

// Determine if we should use emulators
// Check environment variable first, then fall back to app.json extra config
const useEmulatorsEnv = process.env.EXPO_PUBLIC_USE_EMULATORS === 'true';
const useEmulatorsConfig = Constants.expoConfig?.extra?.useEmulators === true;
const useEmulators = useEmulatorsEnv || (__DEV__ && useEmulatorsConfig);

if (useEmulators) {
  const host = process.env.EXPO_PUBLIC_EMULATOR_HOST || 'localhost';

  console.log(`🔥 Connecting to Firebase Emulators at ${host}`);

  // Connect to Auth Emulator
  connectAuthEmulator(auth, `http://${host}:9099`);

  // Connect to Firestore Emulator
  connectFirestoreEmulator(db, host, 8080);

  // Connect to Functions Emulator
  connectFunctionsEmulator(functions, host, 5001);
} else {
  console.log('🌐 Using production Firebase services');
}
