import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc
} from 'firebase/firestore';
import { auth, db } from './config';

// User interface for our app
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  joinDate: Date;
  achievements: Achievement[];
  showerData: ShowerEntry[];
  preferences: UserPreferences;
}

export interface Achievement {
  id: string;
  type: 'streak' | 'vibe' | 'variety' | 'timing' | 'mastery' | 'extreme' | 'secret';
  title: string;
  description: string;
  unlockedAt: Date;
  progress: number;
  maxProgress: number;
}

export interface ShowerEntry {
  id: string;
  date: string;
  timestamp?: string;
  showered: boolean;
  vibe: number;
  notes?: string;
  products: string[];
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'en' | 'fr';
  notifications: boolean;
  reminderTime?: string;
}

// Sign up with email and password
export const signUpWithEmail = async (email: string, password: string, username: string): Promise<User> => {
  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with username
    await updateProfile(user, {
      displayName: username
    });

    // Create user document in Firestore
    const userData: User = {
      id: user.uid,
      email: user.email!,
      username,
      joinDate: new Date(),
      achievements: [],
      showerData: [],
      preferences: {
        theme: 'light',
        language: 'en',
        notifications: true
      }
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return userData;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Sign in with email and password
export const signInWithEmail = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    const userData = userDoc.data();
    
    // Convert Firestore timestamp to Date object
    const processedUserData: User = {
      ...userData,
      joinDate: userData.joinDate?.toDate() || new Date(),
      achievements: userData.achievements?.map((achievement: any) => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt?.toDate() || new Date()
      })) || []
    } as User;

    return processedUserData;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error('Failed to sign out');
  }
};

// Get current user data
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) return null;

    const userData = userDoc.data();
    
    // Convert Firestore timestamp to Date object
    const processedUserData: User = {
      ...userData,
      joinDate: userData.joinDate?.toDate() || new Date(),
      achievements: userData.achievements?.map((achievement: any) => ({
        ...achievement,
        unlockedAt: achievement.unlockedAt?.toDate() || new Date()
      })) || []
    } as User;

    return processedUserData;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Update user data
export const updateUserData = async (userId: string, updates: Partial<User>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', userId), updates);
  } catch (error) {
    throw new Error('Failed to update user data');
  }
};

// Add shower entry
export const addShowerEntry = async (userId: string, entry: ShowerEntry): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data() as User;
    const updatedShowerData = [...userData.showerData, entry];

    await updateDoc(userRef, {
      showerData: updatedShowerData
    });
  } catch (error) {
    throw new Error('Failed to add shower entry');
  }
};

// Delete shower entry
export const deleteShowerEntry = async (userId: string, entryId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data() as User;
    const updatedShowerData = userData.showerData.filter(entry => entry.id !== entryId);

    await updateDoc(userRef, {
      showerData: updatedShowerData
    });
  } catch (error) {
    throw new Error('Failed to delete shower entry');
  }
};

// Unlock achievement
export const unlockAchievement = async (userId: string, achievement: Achievement): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data() as User;
    const updatedAchievements = [...userData.achievements, achievement];

    await updateDoc(userRef, {
      achievements: updatedAchievements
    });
  } catch (error) {
    throw new Error('Failed to unlock achievement');
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const userData = await getCurrentUser();
        callback(userData);
      } catch (error) {
        console.error('Error getting user data:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists';
    case 'auth/invalid-email':
      return 'Please enter a valid email address';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters';
    case 'auth/user-disabled':
      return 'This account has been disabled';
    case 'auth/user-not-found':
      return 'No account found with this email';
    case 'auth/wrong-password':
      return 'Incorrect password';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later';
    default:
      return 'An error occurred. Please try again';
  }
}; 