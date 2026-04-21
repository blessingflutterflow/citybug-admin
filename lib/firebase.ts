import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Firebase configuration - same as City Bug app
const firebaseConfig = {
  apiKey: "AIzaSyAQZOwYp_-03v9zqmH9hGliKMldhfzBCNQ",
  authDomain: "festo-ee0a4.firebaseapp.com",
  projectId: "festo-ee0a4",
  storageBucket: "festo-ee0a4.firebasestorage.app",
  messagingSenderId: "1086272718593",
  appId: "1:1086272718593:android:acd0750de0daef221a7d00"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
