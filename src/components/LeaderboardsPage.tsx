import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp, Calendar, Target, Zap, Users } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';
import './LeaderboardsPage.css';
import { calculateCurrentStreak } from '../utils/streakUtils';

interface LeaderboardEntry {
  id: string;
  username: string;
  totalShowers: number;
  currentStreak: number;
  longestStreak: number;
  totalAchievements: number;
  averageVibe: number;
  lastShowerDate: Date;
  rank: number;
}

const LeaderboardsPage: React.FC = () => {
  const { user } = useUser();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'overall' | 'streak' | 'achievements' | 'vibes'>('overall');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from Firebase
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        
        console.log('Firebase users found:', usersSnapshot.size);
        
        const usersData: LeaderboardEntry[] = [];
        
        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          const showerData = userData.showerData || [];
          const totalShowers = showerData.length;
          const currentStreak = calculateCurrentStreak(showerData);
          const longestStreak = calculateLongestStreak(showerData);
          const totalAchievements = userData.achievements ? userData.achievements.length : 0;
          const averageVibe = calculateAverageVibe(showerData);
                  const lastShowerDate = showerData.length > 0 
          ? getDateFromShowerEntry(showerData[showerData.length - 1])
          : new Date(0); // Never showered
          
          const entry = {
            id: doc.id,
            username: userData.username || userData.email?.split('@')[0] || 'Anonymous',
            totalShowers,
            currentStreak,
            longestStreak,
            totalAchievements,
            averageVibe,
            lastShowerDate,
            rank: 0
          };
          
          console.log('User data:', entry);
          usersData.push(entry);
        });

        // If no users found, show a message
        if (usersData.length === 0) {
          console.log('No users found in database');
          setLeaderboardData([]);
          setIsLoading(false);
          return;
        }

        // Sort based on selected category
        const sortedUsers = usersData.sort((a, b) => {
          switch (selectedCategory) {
            case 'streak':
              return b.currentStreak - a.currentStreak;
            case 'achievements':
              return b.totalAchievements - a.totalAchievements;
            case 'vibes':
              return b.averageVibe - a.averageVibe;
            default: // overall
              return (b.totalShowers * 0.3 + b.currentStreak * 0.3 + b.totalAchievements * 0.2 + b.averageVibe * 0.2) -
                     (a.totalShowers * 0.3 + a.currentStreak * 0.3 + a.totalAchievements * 0.2 + a.averageVibe * 0.2);
          }
        });

        // Update ranks
        sortedUsers.forEach((user, index) => {
          user.rank = index + 1;
        });

        setLeaderboardData(sortedUsers);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        // Fallback to mock data if Firebase fails
        setLeaderboardData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [selectedCategory]);

  // Helper function to handle different date formats
  const getDateFromShowerEntry = (entry: any): Date => {
    if (entry?.date?.toDate) {
      // Firestore Timestamp
      return entry.date.toDate();
    } else if (entry?.date instanceof Date) {
      // JavaScript Date object
      return entry.date;
    } else if (typeof entry?.date === 'string') {
      // String date
      return new Date(entry.date);
    } else {
      // Fallback
      return new Date();
    }
  };

  // Helper functions for calculations
  const calculateLongestStreak = (showerData: any[]) => {
    if (!showerData || showerData.length === 0) return 0;
    
    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;
    
    const sortedData = [...showerData].sort((a, b) => {
      const dateA = getDateFromShowerEntry(a);
      const dateB = getDateFromShowerEntry(b);
      return dateA.getTime() - dateB.getTime();
    });
    
    for (const shower of sortedData) {
      const showerDate = getDateFromShowerEntry(shower);
      showerDate.setHours(0, 0, 0, 0);
      
      if (lastDate) {
        const diffTime = showerDate.getTime() - lastDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          longestStreak = Math.max(longestStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }
      
      lastDate = showerDate;
    }
    
    return Math.max(longestStreak, currentStreak);
  };

  const calculateAverageVibe = (showerData: any[]) => {
    if (!showerData || showerData.length === 0) return 0;
    
    const totalVibe = showerData.reduce((sum, shower) => sum + (shower.vibe || 0), 0);
    return totalVibe / showerData.length;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="rank-icon gold" />;
    if (rank === 2) return <Medal className="rank-icon silver" />;
    if (rank === 3) return <Medal className="rank-icon bronze" />;
    return <Trophy className="rank-icon" />;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'gold';
    if (rank === 2) return 'silver';
    if (rank === 3) return 'bronze';
    return 'default';
  };

  const formatLastShower = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays === 0) return 'Today';
    return `${diffDays} days ago`;
  };

  const categories = [
    { id: 'overall', label: t('overall'), icon: <TrendingUp /> },
    { id: 'streak', label: t('currentStreak'), icon: <Calendar /> },
    { id: 'achievements', label: t('achievements'), icon: <Target /> },
    { id: 'vibes', label: t('vibeScore'), icon: <Zap /> }
  ];

  const categoryLabels: { [key: string]: string } = {
    overall: t('overall'),
    streak: t('currentStreak'),
    achievements: t('achievements'),
    vibes: t('vibeScore')
  };

  if (isLoading) {
    return (
      <div className="leaderboards-page">
        <div className="loading-container">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="loading-spinner"
          >
            🚿
          </motion.div>
          <p>Loading leaderboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboards-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="leaderboards-header"
      >
        <div className="header-content">
          <h1>🏆 {t('showerLeaderboards')}</h1>
          <p>{t('leaderboardsDescription')}</p>
        </div>
                  <div className="stats-summary">
            <div className="stat-item">
              <Users className="stat-icon" />
              <span>{leaderboardData.length} {t('activeUsers')}</span>
            </div>
          </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="category-selector"
      >
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id as any)}
          >
            {category.icon}
            <span>{category.label}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="leaderboard-container"
      >
        <div className="leaderboard-header">
          <div className="rank-col">{t('rank')}</div>
          <div className="user-col">{t('user')}</div>
          <div className="stats-col">{t('score')}</div>
        </div>

        <div className="leaderboard-entries">
          {leaderboardData.length === 0 ? (
            <div className="no-data-message">
              <p>No users found in the leaderboards yet.</p>
              <p>Start logging showers to appear here!</p>
            </div>
          ) : (
            leaderboardData.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`leaderboard-entry ${getRankColor(entry.rank)} ${entry.username === user?.username ? 'current-user' : ''}`}
            >
              <div className="rank-section">
                <div className="rank-number">{entry.rank}</div>
                {getRankIcon(entry.rank)}
              </div>

              <div className="user-section">
                <div className="username">{entry.username}</div>
              </div>

              <div className="stats-section">
                <div className="stat-row">
                  <span className="stat-value">
                    {selectedCategory === 'streak' && `${entry.currentStreak} ${t('days')}`}
                    {selectedCategory === 'achievements' && `${entry.totalAchievements}/14`}
                    {selectedCategory === 'vibes' && entry.averageVibe.toFixed(1)}
                    {selectedCategory === 'overall' && entry.totalShowers}
                  </span>
                </div>
              </div>
            </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* You Section */}
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="you-section"
        >
          <div className="you-header">
            <h3>{t('you')}</h3>
          </div>
          <div className="you-content">
            <div className="you-rank">
              <span className="you-label">{t('rank')}:</span>
              <span className="you-value">
                {leaderboardData.find(entry => entry.username === user.username)?.rank || 'N/A'}
              </span>
            </div>
            <div className="you-score">
              <span className="you-label">{categoryLabels[selectedCategory]}:</span>
              <span className="you-value">
                {(() => {
                  const userEntry = leaderboardData.find(entry => entry.username === user.username);
                  if (!userEntry) return 'N/A';
                  
                  switch (selectedCategory) {
                    case 'streak': return `${userEntry.currentStreak} ${t('days')}`;
                    case 'achievements': return `${userEntry.totalAchievements}/14`;
                    case 'vibes': return userEntry.averageVibe.toFixed(1);
                    case 'overall': return userEntry.totalShowers;
                    default: return 'N/A';
                  }
                })()}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="leaderboard-footer"
      >
        <p>🏆 {t('keepShoweringMessage')} 🚿</p>
        <p className="update-note">{t('leaderboardsUpdateNote')}</p>
      </motion.div>
    </div>
  );
};

export default LeaderboardsPage; 