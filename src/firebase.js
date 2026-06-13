import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// If API key is empty or placeholder, we skip Firebase initialization
export const isFirebaseConfigured = !!import.meta.env.VITE_FIREBASE_API_KEY && 
                                   import.meta.env.VITE_FIREBASE_API_KEY !== 'undefined' &&
                                   import.meta.env.VITE_FIREBASE_API_KEY.length > 5;

let auth = null;
let app = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log('🔥 Firebase initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
} else {
  console.log('⚠️  Firebase credentials not detected. Authentication running in MOCK mode.');
}

export { auth };
