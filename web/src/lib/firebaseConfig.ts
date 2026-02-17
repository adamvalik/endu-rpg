import { initializeApp } from 'firebase/app'
import { getAuth, browserLocalPersistence, setPersistence, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const functions = getFunctions(app)

// Set auth persistence to localStorage
setPersistence(auth, browserLocalPersistence)

// Connect to emulators in development
const useEmulators = import.meta.env.VITE_USE_EMULATORS === 'true'
if (useEmulators) {
  const host = import.meta.env.VITE_EMULATOR_HOST || 'localhost'
  console.log(`🔥 Connecting to Firebase Emulators at ${host}`)

  connectAuthEmulator(auth, `http://${host}:9099`, { disableWarnings: true })
  connectFirestoreEmulator(db, host, 8080)
  connectFunctionsEmulator(functions, host, 5001)
} else {
  console.log('🌐 Using production Firebase services')
}
