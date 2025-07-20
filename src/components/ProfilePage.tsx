import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Settings, Trophy, Calendar, Target, LogOut } from 'lucide-react';
import Footer from './Footer';
import './ProfilePage.css';
import { AnimatePresence } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { user, logout, updatePreferences, deleteUserAccount } = useUser();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'settings'>('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) return null;

  const totalShowers = user.showerData.length;
  const currentStreak = calculateCurrentStreak(user.showerData);
  const averageVibe = user.showerData.length > 0 
    ? (user.showerData.reduce((sum, entry) => sum + entry.vibe, 0) / user.showerData.length).toFixed(1)
    : '0.0';

  const exportUserData = () => {
    const data = {
      user: {
        username: user.username,
        email: user.email,
        joinDate: user.joinDate,
        achievements: user.achievements,
        preferences: user.preferences
      },
      showerData: user.showerData,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shower-data-${user.username}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    try {
      // Delete user data from Firestore
      await deleteUserAccount(user.id);
      // Logout and redirect
      await logout();
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

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
                  <h2>{t('settings')}</h2>
                  <div className="settings-content">
                    {/* Email Reminders */}
                    <div className="setting-item">
                      <div className="setting-header">
                        <label className="setting-label">
                          <input
                            type="checkbox"
                            checked={user.preferences?.notifications || false}
                            onChange={(e) => updatePreferences({ notifications: e.target.checked })}
                            className="setting-checkbox"
                          />
                          <span className="setting-text">{t('emailReminders')}</span>
                        </label>
                      </div>
                      <p className="setting-description">{t('emailRemindersDesc')}</p>
                    </div>

                    {/* Reminder Time */}
                    {user.preferences?.notifications && (
                      <div className="setting-item">
                        <label className="setting-label">{t('reminderTime')}</label>
                        <select
                          value={user.preferences?.reminderTime || '09:00'}
                          onChange={(e) => updatePreferences({ reminderTime: e.target.value })}
                          className="setting-select"
                        >
                          <option value="07:00">{t('7am')}</option>
                          <option value="08:00">{t('8am')}</option>
                          <option value="09:00">{t('9am')}</option>
                          <option value="10:00">{t('10am')}</option>
                          <option value="11:00">{t('11am')}</option>
                          <option value="12:00">{t('12pm')}</option>
                          <option value="18:00">{t('6pm')}</option>
                          <option value="19:00">{t('7pm')}</option>
                          <option value="20:00">{t('8pm')}</option>
                          <option value="21:00">{t('9pm')}</option>
                        </select>
                      </div>
                    )}

                    {/* Data Export */}
                    <div className="setting-item">
                      <div className="setting-header">
                        <label className="setting-label">{t('exportData')}</label>
                        <motion.button
                          className="setting-btn secondary"
                          onClick={exportUserData}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {t('download')}
                        </motion.button>
                      </div>
                      <p className="setting-description">{t('exportDataDesc')}</p>
                    </div>

                    {/* Delete Account */}
                    <div className="setting-item danger-zone">
                      <div className="setting-header">
                        <label className="setting-label danger">{t('deleteAccount')}</label>
                        <motion.button
                          className="setting-btn danger"
                          onClick={() => setShowDeleteConfirm(true)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {t('delete')}
                        </motion.button>
                      </div>
                      <p className="setting-description">{t('deleteAccountDesc')}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              className="modal-content glass"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{t('deleteAccountConfirm')}</h3>
              <p>{t('deleteAccountWarning')}</p>
              <div className="modal-actions">
                <motion.button
                  className="modal-btn cancel"
                  onClick={() => setShowDeleteConfirm(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('cancel')}
                </motion.button>
                <motion.button
                  className="modal-btn danger"
                  onClick={handleDeleteAccount}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('deleteAccount')}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
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