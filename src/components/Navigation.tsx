import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sun, Moon, Languages, Droplets, LogIn } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import './Navigation.css';

interface NavigationProps {
  showNavLinks?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ showNavLinks = true }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { isAuthenticated, user, logout } = useUser();

  const currentPage = location.pathname === '/dashboard' ? 'dashboard' : 
                     location.pathname === '/profile' ? 'profile' : 
                     location.pathname === '/about' ? 'about' : '';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <motion.nav 
      className="navigation glass"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container">
        <div className="nav-content">
          {/* Logo and Title */}
          <motion.div 
            className="nav-brand"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="brand-link">
              <div className="logo">
                <Droplets className="logo-icon" />
              </div>
              <div className="brand-text">
                <h1 className="title">{t('title')}</h1>
              </div>
            </Link>
          </motion.div>

          {/* Navigation Links */}
          {showNavLinks && isAuthenticated && (
            <div className="nav-links">
              <Link to="/dashboard">
                <motion.button
                  className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  📊 {t('dashboard')}
                </motion.button>
              </Link>
              <Link to="/about">
                <motion.button
                  className={`nav-btn ${currentPage === 'about' ? 'active' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ℹ️ {t('about')}
                </motion.button>
              </Link>
            </div>
          )}

          {/* Controls */}
          <div className="nav-controls">
            {/* Language Toggle */}
            <motion.button
              className="control-btn language-btn"
              onClick={toggleLanguage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={language === 'en' ? 'Switch to French' : 'Passer à l\'anglais'}
            >
              <Languages className="control-icon" />
              <span className="control-text">{language.toUpperCase()}</span>
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              className="control-btn theme-btn"
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={theme === 'dark' ? t('lightMode') : t('darkMode')}
            >
              <motion.div
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? (
                  <Sun className="control-icon" />
                ) : (
                  <Moon className="control-icon" />
                )}
              </motion.div>
            </motion.button>

            {/* Login/User Avatar */}
            {!isAuthenticated && location.pathname !== '/login' ? (
              <Link to="/login">
                <motion.button
                  className="control-btn login-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogIn className="control-icon" />
                  <span className="control-text">{t('login')}</span>
                </motion.button>
              </Link>
            ) : isAuthenticated && (
              <div className="user-section">
                <Link to="/profile">
                  <motion.button
                    className="user-avatar"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={`${t('profile')} (${user?.username || user?.email})`}
                  >
                    <span className="avatar-letter">
                      {(user?.username || user?.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </motion.button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation; 