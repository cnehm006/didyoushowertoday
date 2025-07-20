import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import './KeyboardShortcuts.css';

interface KeyboardShortcutsProps {
  isVisible: boolean;
  onClose: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ isVisible, onClose }) => {
  const { toggleTheme } = useTheme();
  const { toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Close shortcuts modal with Escape
      if (event.key === 'Escape' && isVisible) {
        onClose();
        return;
      }

      // Only handle shortcuts when modal is closed
      if (!isVisible) {
        switch (event.key.toLowerCase()) {
          case 'd':
            if (event.ctrlKey || event.metaKey) {
              event.preventDefault();
              toggleTheme();
            }
            break;
          case 'l':
            if (event.ctrlKey || event.metaKey) {
              event.preventDefault();
              toggleLanguage();
            }
            break;
          case '?':
            if (event.ctrlKey || event.metaKey) {
              event.preventDefault();
              // This would typically show the shortcuts modal
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, toggleTheme, toggleLanguage, onClose]);

  const shortcuts = [
    { key: 'Ctrl + D', description: 'Toggle theme' },
    { key: 'Ctrl + L', description: 'Toggle language' },
    { key: 'Ctrl + ?', description: 'Show shortcuts' },
    { key: 'Escape', description: 'Close modal' },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="keyboard-shortcuts-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="keyboard-shortcuts-modal glass"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="shortcuts-header">
              <div className="shortcuts-title">
                <Keyboard className="shortcuts-icon" />
                <h2>Keyboard Shortcuts</h2>
              </div>
              <button className="close-button" onClick={onClose}>
                <X className="close-icon" />
              </button>
            </div>

            <div className="shortcuts-list">
              {shortcuts.map((shortcut, index) => (
                <motion.div
                  key={shortcut.key}
                  className="shortcut-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <kbd className="shortcut-key">{shortcut.key}</kbd>
                  <span className="shortcut-description">{shortcut.description}</span>
                </motion.div>
              ))}
            </div>

            <div className="shortcuts-footer">
              <p>Press any key combination to try it out!</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KeyboardShortcuts; 