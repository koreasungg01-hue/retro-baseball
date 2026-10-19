import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const configured = Boolean(
  config.apiKey &&
  config.authDomain &&
  config.projectId &&
  config.appId
);

export const firebaseApp = configured
  ? initializeApp(config)
  : null;

export const auth = firebaseApp
  ? getAuth(firebaseApp)
  : null;

export const firebaseReady = configured;
