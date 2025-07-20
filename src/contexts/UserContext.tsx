import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signOutUser, 
  onAuthStateChange,
  getCurrentUser,
  addShowerEntry,
  deleteShowerEntry as deleteShowerEntryFromDB,
  unlockAchievement,
  updateUserData,
  User,
  Achievement,
  ShowerEntry,
  UserPreferences
} from '../firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateShowerData: (entry: ShowerEntry) => void;
  deleteShowerEntry: (entryId: string) => Promise<void>;
  unlockAchievement: (achievementId: string) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  deleteUserAccount: (userId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((userData) => {
      setUser(userData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      await signInWithEmail(email, password);
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      await signUpWithEmail(email, password, username);
      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      let errorMessage = 'Signup failed. Please try again.';
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters long.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      }
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateShowerData = async (entry: ShowerEntry) => {
    if (!user) return;
    
    try {
      // Ensure the entry has required fields
      const entryWithDefaults = {
        ...entry,
        id: entry.id || `${entry.date}-${Date.now()}`,
        timestamp: entry.timestamp || new Date().toISOString()
      };
      
      await addShowerEntry(user.id, entryWithDefaults);
      
      // Update local state
      const updatedUser = {
        ...user,
        showerData: [...user.showerData, entryWithDefaults]
      };
      setUser(updatedUser);
      
      // Check for new achievements after adding shower data
      setTimeout(() => {
        checkAchievements();
      }, 1000);
    } catch (error) {
      console.error('Error updating shower data:', error);
    }
  };

  const deleteShowerEntry = async (entryId: string) => {
    if (!user) return;
    
    try {
      await deleteShowerEntryFromDB(user.id, entryId);
      
      // Update local state
      const updatedUser = {
        ...user,
        showerData: user.showerData.filter(entry => entry.id !== entryId)
      };
      setUser(updatedUser);
      
      // Check for new achievements after deleting shower data
      setTimeout(() => {
        checkAchievements();
      }, 1000);
    } catch (error) {
      console.error('Error deleting shower entry:', error);
    }
  };

  const unlockUserAchievement = async (achievementId: string) => {
    if (!user) return;
    
    const achievement = getAchievementById(achievementId);
    if (achievement && !user.achievements.find(a => a.id === achievementId)) {
      try {
        const achievementWithDate = {
          ...achievement,
          unlockedAt: new Date()
        };
        
        await unlockAchievement(user.id, achievementWithDate);
        
        // Update local state
        const updatedUser = {
          ...user,
          achievements: [...user.achievements, achievementWithDate]
        };
        setUser(updatedUser);
      } catch (error) {
        console.error('Error unlocking achievement:', error);
      }
    }
  };

  // Check and unlock achievements based on shower data
  const checkAchievements = () => {
    if (!user || user.showerData.length === 0) return;

    const showeredEntries = user.showerData.filter(entry => entry.showered);
    const highVibeEntries = user.showerData.filter(entry => entry.vibe >= 8);
    
    // Check for shower streak (7 consecutive days)
    let currentStreak = 0;
    let maxStreak = 0;
    const sortedEntries = [...user.showerData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (const entry of sortedEntries) {
      if (entry.showered) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    // Unlock achievements based on criteria
    if (maxStreak >= 7 && !user.achievements.find(a => a.id === 'shower_streak_7')) {
      unlockUserAchievement('shower_streak_7');
    }
    
    if (highVibeEntries.length >= 3 && !user.achievements.find(a => a.id === 'high_vibe_master')) {
      unlockUserAchievement('high_vibe_master');
    }
    
    if (showeredEntries.length >= 7 && !user.achievements.find(a => a.id === 'consistency_king')) {
      unlockUserAchievement('consistency_king');
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    try {
      await updateUserData(user.id, { preferences: { ...user.preferences, ...preferences } });
      
      // Update local state
      const updatedUser = {
        ...user,
        preferences: { ...user.preferences, ...preferences }
      };
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const deleteUserAccount = async (userId: string) => {
    try {
      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', userId));
      // Note: Firebase Auth user deletion would require additional setup
      // For now, we just delete the Firestore data
    } catch (error) {
      throw new Error('Failed to delete user account');
    }
  };

  const getAchievementById = (id: string) => {
    const achievements = [
      {
        id: 'shower_streak_7',
        type: 'streak' as const,
        title: 'Shower Streak',
        description: 'Maintain a 7-day shower streak',
        progress: 0,
        maxProgress: 7
      },
      {
        id: 'high_vibe_master',
        type: 'vibe' as const,
        title: 'High Vibe Master',
        description: 'Achieve 8+ vibe level for 3 days',
        progress: 0,
        maxProgress: 3
      },
      {
        id: 'consistency_king',
        type: 'consistency' as const,
        title: 'Consistency King',
        description: 'Shower every day for a week',
        progress: 0,
        maxProgress: 7
      }
    ];
    
    return achievements.find(a => a.id === id);
  };

  const value: UserContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateShowerData,
    deleteShowerEntry,
    unlockAchievement: unlockUserAchievement,
    updatePreferences,
    deleteUserAccount
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 