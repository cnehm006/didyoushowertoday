import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Settings, Trophy, Calendar, Target, LogOut, Edit3 } from 'lucide-react';
import './ProfilePage.css';
import { AnimatePresence } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { user, logout } = useUser();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'settings'>('profile');

  if (!user) return null;

  const totalShowers = user.showerData.length;
  const currentStreak = calculateCurrentStreak(user.showerData);
  const averageVibe = user.showerData.length > 0 
    ? (user.showerData.reduce((sum, entry) => sum + entry.vibe, 0) / user.showerData.length).toFixed(1)
    : '0.0';

  const tabs = [
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'achievements', label: t('achievements'), icon: Trophy },
    { id: 'settings', label: t('settings'), icon: Settings }
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <motion.div 
          className="profile-header glass"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.avatar ? (
                <img src={user.avatar} alt={user.username} />
              ) : (
                <User size={32} />
              )}
            </div>
            <motion.button
              className="edit-avatar-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Edit3 size={16} />
            </motion.button>
          </div>
          
          <div className="profile-info">
            <h1 className="profile-name">{user.username}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-join-date">
              {t('memberSince')} {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Recently'}
            </p>
          </div>

          <motion.button
            className="logout-btn"
            onClick={logout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={20} />
            {t('logout')}
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="stats-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="stats-grid">
            <motion.div 
              className="stat-card glass"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="stat-icon">🚿</div>
              <div className="stat-content">
                <h3 className="stat-value">{totalShowers}</h3>
                <p className="stat-label">{t('totalShowers')}</p>
              </div>
            </motion.div>

            <motion.div 
              className="stat-card glass"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <h3 className="stat-value">{currentStreak}</h3>
                <p className="stat-label">{t('currentStreak')}</p>
              </div>
            </motion.div>

            <motion.div 
              className="stat-card glass"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="stat-icon">🧠</div>
              <div className="stat-content">
                <h3 className="stat-value">{averageVibe}</h3>
                <p className="stat-label">{t('avgVibe')}</p>
              </div>
            </motion.div>

            <motion.div 
              className="stat-card glass"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="stat-icon">🏆</div>
              <div className="stat-content">
                <h3 className="stat-value">{user.achievements.length}</h3>
                <p className="stat-label">{t('achievements')}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="tabs-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="tabs-header">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id as any)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          <div className="tab-content glass">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="profile-tab"
                >
                  <h2>{t('profileInformation')}</h2>
                  <div className="profile-details">
                    <div className="detail-item">
                      <label>{t('username')}</label>
                      <input type="text" value={user.username} readOnly />
                    </div>
                    <div className="detail-item">
                      <label>{t('email')}</label>
                      <input type="email" value={user.email} readOnly />
                    </div>
                    <div className="detail-item">
                      <label>{t('joinDate')}</label>
                      <input type="text" value={user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'Recently'} readOnly />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="achievements-tab"
                >
                  <h2>{t('yourAchievements')}</h2>
                  {user.achievements.length === 0 ? (
                    <div className="empty-state">
                      <Trophy size={48} />
                      <p>{t('noAchievementsYet')}</p>
                      <p>{t('startTrackingToUnlock')}</p>
                    </div>
                  ) : (
                    <div className="achievements-grid">
                      {user.achievements.map((achievement) => (
                        <div key={achievement.id} className="achievement-item">
                          <div className="achievement-icon">🏆</div>
                          <div className="achievement-info">
                            <h3>{achievement.title}</h3>
                            <p>{achievement.description}</p>
                            <small>Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="settings-tab"
                >
                  <h2>Settings</h2>
                  <div className="settings-section">
                    <h3>Preferences</h3>
                    <div className="setting-item">
                      <label>Theme</label>
                      <select value={user.preferences.theme}>
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <label>Language</label>
                      <select value={user.preferences.language}>
                        <option value="en">English</option>
                        <option value="fr">Français</option>
                      </select>
                    </div>
                    <div className="setting-item">
                      <label>
                        <input 
                          type="checkbox" 
                          checked={user.preferences.notifications}
                        />
                        Enable Notifications
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Helper function to calculate current streak
const calculateCurrentStreak = (showerData: any[]) => {
  if (showerData.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const entry = showerData.find(e => e.date === dateStr);
    if (entry && entry.showered) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

export default ProfilePage; 