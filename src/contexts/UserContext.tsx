import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signUpWithEmail, 
  signInWithEmail, 
  signOutUser, 
  onAuthStateChange,
  getCurrentUser,
  addShowerEntry,
  unlockAchievement,
  updateUserData,
  User,
  Achievement,
  ShowerEntry,
  UserPreferences
} from '../firebase/auth';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateShowerData: (entry: ShowerEntry) => void;
  unlockAchievement: (achievementId: string) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await signInWithEmail(email, password);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await signUpWithEmail(email, password, username);
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      return false;
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
      await addShowerEntry(user.id, entry);
      
      // Update local state
      const updatedUser = {
        ...user,
        showerData: [...user.showerData, entry]
      };
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating shower data:', error);
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
    unlockAchievement: unlockUserAchievement,
    updatePreferences
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 