import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import ProfilePage from './components/ProfilePage';
import AboutPage from './components/AboutPage';
import LogShowerPage from './pages/LogShowerPage';
import ThemeTransition from './components/ThemeTransition';
import FloatingParticles from './components/FloatingParticles';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { UserProvider, useUser } from './contexts/UserContext';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useUser();

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

  return (
    <BrowserRouter>
      <div className="App">
        <ThemeTransition />
        <FloatingParticles />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            !isAuthenticated ? (
              <>
                <Navigation showNavLinks={false} />
                <AuthPage />
              </>
            ) : (
              <Navigate to="/dashboard" replace />
            )
          } />
          
          <Route path="/about" element={
            <>
              <Navigation showNavLinks={isAuthenticated} />
              <AboutPage />
            </>
          } />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            isAuthenticated ? (
              <>
                <Navigation />
                <Dashboard />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          
          <Route path="/profile" element={
            isAuthenticated ? (
              <>
                <Navigation />
                <ProfilePage />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          
          <Route path="/log-shower" element={
            isAuthenticated ? (
              <LogShowerPage />
            ) : (
              <Navigate to="/login" replace />
            )
          } />
          
          {/* Default redirects */}
          <Route path="/" element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/about" replace />
            )
          } />
          
          {/* Catch all - redirect to dashboard if authenticated, about if not */}
          <Route path="*" element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/about" replace />
            )
          } />
        </Routes>
      </div>
    </BrowserRouter>
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
