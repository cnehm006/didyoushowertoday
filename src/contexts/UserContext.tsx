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
  getAllAchievements: () => Array<{
    id: string;
    type: 'streak' | 'vibe' | 'variety' | 'timing' | 'mastery' | 'extreme' | 'secret';
    title: string;
    description: string;
    progress: number;
    maxProgress: number;
    unlocked: boolean;
  }>;
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
      // Re-fetch user data from Firebase to ensure consistency
      const freshUser = await getCurrentUser();
      if (freshUser) {
        setUser(freshUser);
      }
      // Check for new achievements after adding shower data with updated state
      setTimeout(() => {
        checkAchievementsWithData(freshUser ? freshUser.showerData : [...user.showerData, entryWithDefaults]);
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
    checkAchievementsWithData(user.showerData);
  };

  const checkAchievementsWithData = (showerData: any[]) => {
    if (!user || showerData.length === 0) return;

    const showeredEntries = showerData.filter(entry => entry.showered);
    const highVibeEntries = showerData.filter(entry => entry.vibe >= 8);
    
    // Check for shower streak (7 consecutive days)
    let currentStreak = 0;
    let maxStreak = 0;
    const sortedEntries = [...showerData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
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
    
    // Product Explorer - Use 4 different products (excluding 'none')
    const uniqueProducts = new Set(showerData.filter(entry => entry.showered).map(entry => entry.products).flat().filter(product => product !== 'none'));
    if (uniqueProducts.size >= 4 && !user.achievements.find(a => a.id === 'product_explorer')) {
      unlockUserAchievement('product_explorer');
    }
    
    // Morning Person - 10 showers before 9 AM
    const morningShowers = showerData.filter(entry => {
      if (!entry.showered) return false;
      const showerTime = new Date(entry.date);
      return showerTime.getHours() < 9;
    });
    if (morningShowers.length >= 10 && !user.achievements.find(a => a.id === 'morning_person')) {
      unlockUserAchievement('morning_person');
    }
    
    // Vibe Consistency - 7+ vibe for 7 consecutive days
    const vibeStreak = calculateVibeStreak(showerData);
    if (vibeStreak >= 7 && !user.achievements.find(a => a.id === 'vibe_consistency')) {
      unlockUserAchievement('vibe_consistency');
    }
    
    // Shower Master - 30 total showers
    if (showeredEntries.length >= 30 && !user.achievements.find(a => a.id === 'shower_master')) {
      unlockUserAchievement('shower_master');
    }
    
    // EXTREME: Shower Legend - 30-day streak
    if (maxStreak >= 30 && !user.achievements.find(a => a.id === 'extreme_streak')) {
      unlockUserAchievement('extreme_streak');
    }
    
    // EXTREME: Vibe God - 9+ vibe for 14 consecutive days
    const extremeVibeStreak = calculateExtremeVibeStreak(showerData);
    if (extremeVibeStreak >= 14 && !user.achievements.find(a => a.id === 'extreme_vibe')) {
      unlockUserAchievement('extreme_vibe');
    }
    
    // EXTREME: Early Bird - 50 showers before 7 AM
    const extremeEarlyShowers = showerData.filter(entry => {
      if (!entry.showered) return false;
      const showerTime = new Date(entry.date);
      return showerTime.getHours() < 7;
    });
    if (extremeEarlyShowers.length >= 50 && !user.achievements.find(a => a.id === 'extreme_early_bird')) {
      unlockUserAchievement('extreme_early_bird');
    }
    
    // EXTREME: Shower King - 100 total showers
    if (showeredEntries.length >= 100 && !user.achievements.find(a => a.id === 'extreme_shower_king')) {
      unlockUserAchievement('extreme_shower_king');
    }
    
    // Shower Marathon - 365 consecutive days
    const consecutiveDays = calculateConsecutiveDays(showerData);
    if (consecutiveDays >= 365 && !user.achievements.find(a => a.id === 'shower_marathon')) {
      unlockUserAchievement('shower_marathon');
    }
    
    // Mystery Achievement - Shower at 3 different times of day
    const mysteryProgress = calculateMysteryProgress(showerData);
    if (mysteryProgress >= 3 && !user.achievements.find(a => a.id === 'mystery_achievement')) {
      unlockUserAchievement('mystery_achievement');
    }
    
    // Secret Words Achievement - Log "thinking of chafic" in notes
    const secretWordsProgress = calculateSecretWordsProgress(showerData);
    if (secretWordsProgress >= 1 && !user.achievements.find(a => a.id === 'secret_words')) {
      unlockUserAchievement('secret_words');
    }
    
    // Midnight Shower Achievement - Take showers between 11 PM and 1 AM
    const midnightShowerProgress = calculateMidnightShowerProgress(showerData);
    if (midnightShowerProgress >= 7 && !user.achievements.find(a => a.id === 'midnight_shower')) {
      unlockUserAchievement('midnight_shower');
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

  const calculateVibeStreak = (showerData: any[]) => {
    let currentVibeStreak = 0;
    let maxVibeStreak = 0;
    const sortedEntries = [...showerData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (const entry of sortedEntries) {
      if (entry.vibe >= 7) {
        currentVibeStreak++;
        maxVibeStreak = Math.max(maxVibeStreak, currentVibeStreak);
      } else {
        currentVibeStreak = 0;
      }
    }
    
    return maxVibeStreak;
  };

  const calculateExtremeVibeStreak = (showerData: any[]) => {
    let currentVibeStreak = 0;
    let maxVibeStreak = 0;
    const sortedEntries = [...showerData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    for (const entry of sortedEntries) {
      if (entry.vibe >= 9) {
        currentVibeStreak++;
        maxVibeStreak = Math.max(maxVibeStreak, currentVibeStreak);
      } else {
        currentVibeStreak = 0;
      }
    }
    
    return maxVibeStreak;
  };

  const calculateConsecutiveDays = (showerData: any[]) => {
    if (showerData.length === 0) return 0;
    
    const sortedEntries = [...showerData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const showeredEntries = sortedEntries.filter(entry => entry.showered);
    
    if (showeredEntries.length === 0) return 0;
    
    let currentStreak = 1;
    let maxStreak = 1;
    
    for (let i = 1; i < showeredEntries.length; i++) {
      const prevDate = new Date(showeredEntries[i - 1].date);
      const currDate = new Date(showeredEntries[i].date);
      const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return maxStreak;
  };

  const calculateMysteryProgress = (showerData: any[]) => {
    // Secret achievement: Log showers at 3 different times of day (morning, afternoon, evening)
    const morningShowers = showerData.filter(entry => {
      if (!entry.showered) return false;
      const hour = new Date(entry.date).getHours();
      return hour >= 6 && hour < 12;
    }).length;
    
    const afternoonShowers = showerData.filter(entry => {
      if (!entry.showered) return false;
      const hour = new Date(entry.date).getHours();
      return hour >= 12 && hour < 18;
    }).length;
    
    const eveningShowers = showerData.filter(entry => {
      if (!entry.showered) return false;
      const hour = new Date(entry.date).getHours();
      return hour >= 18 || hour < 6;
    }).length;
    
    // Progress based on having showers in all 3 time periods
    let progress = 0;
    if (morningShowers > 0) progress += 1;
    if (afternoonShowers > 0) progress += 1;
    if (eveningShowers > 0) progress += 1;
    
    return Math.min(progress, 3);
  };

  const calculateSecretWordsProgress = (showerData: any[]) => {
    // Secret achievement: Log "thinking of chafic" in shower notes
    let foundChafic = 0;
    
    showerData.forEach(entry => {
      if (entry.notes && entry.notes.toLowerCase().includes('thinking of chafic')) {
        foundChafic++;
      }
    });
    
    return Math.min(foundChafic, 1);
  };

  const calculateMidnightShowerProgress = (showerData: any[]) => {
    // Secret achievement: Take showers between 11 PM and 1 AM
    const midnightShowers = showerData.filter(entry => {
      if (!entry.showered) return false;
      const hour = new Date(entry.date).getHours();
      return hour >= 23 || hour <= 1;
    }).length;
    
    return Math.min(midnightShowers, 7);
  };

  const getAllAchievements = () => {
    const showeredEntries = user?.showerData.filter(entry => entry.showered) || [];
    const highVibeEntries = user?.showerData.filter(entry => entry.vibe >= 8) || [];
    
    // Calculate current streak
    let currentStreak = 0;
    let maxStreak = 0;
    if (user?.showerData) {
      const sortedEntries = [...user.showerData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      for (const entry of sortedEntries) {
        if (entry.showered) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
    }

    const achievements = [
      {
        id: 'shower_streak_7',
        type: 'streak' as const,
        title: 'Shower Streak',
        description: 'Maintain a 7-day shower streak',
        progress: Math.min(maxStreak, 7),
        maxProgress: 7,
        unlocked: user?.achievements.find(a => a.id === 'shower_streak_7') !== undefined
      },
      {
        id: 'high_vibe_master',
        type: 'vibe' as const,
        title: 'High Vibe Master',
        description: 'Achieve 8+ vibe level for 3 days',
        progress: Math.min(highVibeEntries.length, 3),
        maxProgress: 3,
        unlocked: user?.achievements.find(a => a.id === 'high_vibe_master') !== undefined
      },
      {
        id: 'product_explorer',
        type: 'variety' as const,
        title: 'Product Explorer',
        description: 'Use all 4 shower products',
        progress: Math.min(new Set(user?.showerData.filter(entry => entry.showered).map(entry => entry.products).flat().filter(product => product !== 'none') || []).size, 4),
        maxProgress: 4,
        unlocked: user?.achievements.find(a => a.id === 'product_explorer') !== undefined
      },
      {
        id: 'morning_person',
        type: 'timing' as const,
        title: 'Morning Person',
        description: 'Take 10 showers before 9 AM',
        progress: Math.min(user?.showerData.filter(entry => {
          if (!entry.showered) return false;
          const showerTime = new Date(entry.date);
          return showerTime.getHours() < 9;
        }).length || 0, 10),
        maxProgress: 10,
        unlocked: user?.achievements.find(a => a.id === 'morning_person') !== undefined
      },
      {
        id: 'vibe_consistency',
        type: 'vibe' as const,
        title: 'Vibe Consistency',
        description: 'Maintain 7+ vibe level for 7 consecutive days',
        progress: Math.min(calculateVibeStreak(user?.showerData || []), 7),
        maxProgress: 7,
        unlocked: user?.achievements.find(a => a.id === 'vibe_consistency') !== undefined
      },
      {
        id: 'shower_master',
        type: 'mastery' as const,
        title: 'Shower Master',
        description: 'Log 30 total showers',
        progress: Math.min(showeredEntries.length, 30),
        maxProgress: 30,
        unlocked: user?.achievements.find(a => a.id === 'shower_master') !== undefined
      },
      {
        id: 'extreme_streak',
        type: 'extreme' as const,
        title: 'Shower Legend',
        description: 'Maintain a 30-day shower streak',
        progress: Math.min(maxStreak, 30),
        maxProgress: 30,
        unlocked: user?.achievements.find(a => a.id === 'extreme_streak') !== undefined
      },
      {
        id: 'extreme_vibe',
        type: 'extreme' as const,
        title: 'Vibe God',
        description: 'Achieve 9+ vibe level for 14 consecutive days',
        progress: Math.min(calculateExtremeVibeStreak(user?.showerData || []), 14),
        maxProgress: 14,
        unlocked: user?.achievements.find(a => a.id === 'extreme_vibe') !== undefined
      },
      {
        id: 'extreme_early_bird',
        type: 'extreme' as const,
        title: 'Early Bird',
        description: 'Take 50 showers before 7 AM',
        progress: Math.min(user?.showerData.filter(entry => {
          if (!entry.showered) return false;
          const showerTime = new Date(entry.date);
          return showerTime.getHours() < 7;
        }).length || 0, 50),
        maxProgress: 50,
        unlocked: user?.achievements.find(a => a.id === 'extreme_early_bird') !== undefined
      },
      {
        id: 'extreme_shower_king',
        type: 'extreme' as const,
        title: 'Shower King',
        description: 'Log 100 total showers',
        progress: Math.min(showeredEntries.length, 100),
        maxProgress: 100,
        unlocked: user?.achievements.find(a => a.id === 'extreme_shower_king') !== undefined
      },
      {
        id: 'shower_marathon',
        type: 'extreme' as const,
        title: 'Shower Marathon',
        description: 'Log showers for 365 consecutive days (1 full year)',
        progress: Math.min(calculateConsecutiveDays(user?.showerData || []), 365),
        maxProgress: 365,
        unlocked: user?.achievements.find(a => a.id === 'shower_marathon') !== undefined
      },
      {
        id: 'secret_words',
        type: 'secret' as const,
        title: 'Shower Thoughts',
        description: 'A special achievement for those who think of the creator while showering...',
        progress: calculateSecretWordsProgress(user?.showerData || []),
        maxProgress: 1,
        unlocked: user?.achievements.find(a => a.id === 'secret_words') !== undefined
      },
      {
        id: 'mystery_achievement',
        type: 'secret' as const,
        title: '???',
        description: 'A mysterious achievement... keep exploring to discover it!',
        progress: calculateMysteryProgress(user?.showerData || []),
        maxProgress: 3,
        unlocked: user?.achievements.find(a => a.id === 'mystery_achievement') !== undefined
      },
      {
        id: 'midnight_shower',
        type: 'secret' as const,
        title: '???',
        description: 'A mysterious achievement... keep exploring to discover it!',
        progress: calculateMidnightShowerProgress(user?.showerData || []),
        maxProgress: 7,
        unlocked: user?.achievements.find(a => a.id === 'midnight_shower') !== undefined
      }
    ];
    
    return achievements;
  };

  const getAchievementById = (id: string) => {
    const achievements = getAllAchievements();
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
    deleteUserAccount,
    getAllAchievements
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 