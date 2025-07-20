import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const ThemeTransition: React.FC = () => {
  const { theme } = useTheme();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="theme-transition-overlay"
          initial={{ 
            clipPath: 'circle(0% at 0% 0%)',
            backgroundColor: theme === 'light' ? '#0f172a' : '#ffffff'
          }}
          animate={{ 
            clipPath: 'circle(150% at 0% 0%)',
            backgroundColor: theme === 'light' ? '#0f172a' : '#ffffff'
          }}
          exit={{ 
            clipPath: 'circle(0% at 100% 100%)',
            backgroundColor: theme === 'light' ? '#0f172a' : '#ffffff'
          }}
          transition={{ 
            duration: 0.8,
            ease: "easeInOut"
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'none'
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default ThemeTransition; 