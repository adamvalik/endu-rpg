import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Functions } from 'firebase/functions';

let _app: FirebaseApp | undefined;
let _auth: Auth | undefined;
let _functions: Functions | undefined;

function getApp(): FirebaseApp {
  if (!_app) {
    const { initializeApp } = require('firebase/app') as typeof import('firebase/app');
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const useEmulators = process.env.NEXT_PUBLIC_USE_EMULATORS === 'true';

    console.log(
      `[Firebase] project=${projectId} mode=${useEmulators ? 'emulators' : 'production'}`,
    );

    _app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
  }
  return _app;
}

export function getAuth(): Auth {
  if (!_auth) {
    const firebaseAuth = require('firebase/auth') as typeof import('firebase/auth');
    _auth = firebaseAuth.getAuth(getApp());
    if (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
      firebaseAuth.connectAuthEmulator(_auth, 'http://localhost:9099');
    }
    firebaseAuth.setPersistence(_auth, firebaseAuth.browserLocalPersistence);
  }
  return _auth;
}

export function getFunctions(): Functions {
  if (!_functions) {
    const firebaseFunctions = require('firebase/functions') as typeof import('firebase/functions');
    _functions = firebaseFunctions.getFunctions(getApp());
    if (process.env.NEXT_PUBLIC_USE_EMULATORS === 'true') {
      firebaseFunctions.connectFunctionsEmulator(_functions, 'localhost', 5001);
    }
  }
  return _functions;
}
