import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Languages, Droplets, Keyboard } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import KeyboardShortcuts from './KeyboardShortcuts';
import './Header.css';

interface HeaderProps {
  onPageChange?: (page: 'dashboard' | 'profile') => void;
  currentPage?: 'dashboard' | 'profile';
}

const Header: React.FC<HeaderProps> = ({ onPageChange, currentPage = 'dashboard' }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <motion.header 
      className="header glass"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container">
        <div className="header-content">
          {/* Logo and Title */}
          <motion.div 
            className="header-brand"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="logo">
              <Droplets className="logo-icon" />
              <motion.div 
                className="logo-bubble"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🧼
              </motion.div>
            </div>
            <div className="brand-text">
              <h1 className="title">{t('title')}</h1>
              <p className="subtitle">{t('subtitle')}</p>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="header-controls">
            {/* Navigation */}
            <div className="nav-buttons">
              <motion.button
                className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={() => onPageChange?.('dashboard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📊 Dashboard
              </motion.button>
              <motion.button
                className={`nav-btn ${currentPage === 'profile' ? 'active' : ''}`}
                onClick={() => onPageChange?.('profile')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                👤 Profile
              </motion.button>
            </div>

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
              <motion.div
                className="language-indicator"
                animate={{ 
                  x: language === 'en' ? 0 : 25,
                  opacity: [0.3, 1, 0.3],
                  scale: [0.8, 1.2, 0.8]
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
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
              <span className="control-text">
                {theme === 'dark' ? t('lightMode') : t('darkMode')}
              </span>
            </motion.button>

            {/* Keyboard Shortcuts */}
            <motion.button
              className="control-btn shortcuts-btn"
              onClick={() => setShowShortcuts(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Keyboard Shortcuts"
            >
              <Keyboard className="control-icon" />
              <span className="control-text">⌨️</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcuts 
        isVisible={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Animated background elements */}
      <div className="header-background">
        <motion.div
          className="floating-bubble"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🚿
        </motion.div>
        <motion.div
          className="floating-bubble"
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          🧠
        </motion.div>
        <motion.div
          className="floating-bubble"
          animate={{
            y: [0, -10, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          ☁️
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header; 