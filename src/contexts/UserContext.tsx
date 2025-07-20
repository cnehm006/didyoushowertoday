import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  joinDate: Date;
  achievements: Achievement[];
  showerData: ShowerEntry[];
  preferences: UserPreferences;
}

interface Achievement {
  id: string;
  type: 'streak' | 'vibe' | 'consistency' | 'goal';
  title: string;
  description: string;
  unlockedAt: Date;
  progress: number;
  maxProgress: number;
}

interface ShowerEntry {
  date: string;
  showered: boolean;
  vibe: number;
  notes?: string;
  products: string[];
}

interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'en' | 'fr';
  notifications: boolean;
  reminderTime?: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateShowerData: (entry: ShowerEntry) => void;
  unlockAchievement: (achievementId: string) => void;
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

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('shower_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('shower_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('shower_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('shower_user');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any email/password
    if (email && password) {
      const newUser: User = {
        id: 'user_' + Date.now(),
        email,
        username: email.split('@')[0],
        joinDate: new Date(),
        achievements: [],
        showerData: [],
        preferences: {
          theme: 'light',
          language: 'en',
          notifications: true
        }
      };
      
      setUser(newUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (email: string, username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any valid signup
    if (email && username && password) {
      const newUser: User = {
        id: 'user_' + Date.now(),
        email,
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
      
      setUser(newUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateShowerData = (entry: ShowerEntry) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      showerData: [...user.showerData, entry]
    };
    
    setUser(updatedUser);
  };

  const unlockAchievement = (achievementId: string) => {
    if (!user) return;
    
    const achievement = getAchievementById(achievementId);
    if (achievement && !user.achievements.find(a => a.id === achievementId)) {
      const updatedUser = {
        ...user,
        achievements: [...user.achievements, {
          ...achievement,
          unlockedAt: new Date()
        }]
      };
      
      setUser(updatedUser);
    }
  };

  const updatePreferences = (preferences: Partial<UserPreferences>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, ...preferences }
    };
    
    setUser(updatedUser);
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
    unlockAchievement,
    updatePreferences
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}; 