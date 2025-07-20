import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace these with your actual Firebase project config
// For production, use environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBfmt9KENR1eiQVuLNrC4Shi8O-rlj-BbA",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "did-you-shower-today.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "did-you-shower-today",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "did-you-shower-today.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "815882775649",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:815882775649:web:e65f4cb6d23f4710544e20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;