import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'dark';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (!isTransitioning) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme, isTransitioning]);

  const toggleTheme = () => {
    setIsTransitioning(true);
    // Delay the actual theme change to allow wave animation to complete
    setTimeout(() => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
      setIsTransitioning(false);
    }, 400); // Half of the wave duration
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 