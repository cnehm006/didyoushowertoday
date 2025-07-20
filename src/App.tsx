import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import ThemeTransition from './components/ThemeTransition';
import FloatingParticles from './components/FloatingParticles';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider, useUser } from './contexts/UserContext';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useUser();
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'profile'>('dashboard');

  if (isLoading) {
    return (
      <div className="App">
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="App">
        <ThemeTransition />
        <FloatingParticles />
        <AuthPage />
      </div>
    );
  }

  return (
    <div className="App">
      <ThemeTransition />
      <FloatingParticles />
      <Header onPageChange={setCurrentPage} currentPage={currentPage} />
      {currentPage === 'dashboard' ? <Dashboard /> : <ProfilePage />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
