import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// For now, using hardcoded values to fix the GitHub security alert
// TODO: Set up proper environment variables
const firebaseConfig = {
  apiKey: "AIzaSyBfmt9KENR1eiQVuLNrC4Shi8O-rlj-BbA",
  authDomain: "did-you-shower-today.firebaseapp.com",
  projectId: "did-you-shower-today",
  storageBucket: "did-you-shower-today.firebasestorage.app",
  messagingSenderId: "815882775649",
  appId: "1:815882775649:web:e65f4cb6d23f4710544e20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;