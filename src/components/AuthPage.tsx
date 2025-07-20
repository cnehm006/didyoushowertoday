import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LogIn, UserPlus, Mail, Lock, User, Loader } from 'lucide-react';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const { login, signup, isLoading } = useUser();
  const { t } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(email, password);
      } else {
        success = await signup(email, username, password);
      }

      if (!success) {
        setError(isLogin ? 'Invalid credentials' : 'Signup failed');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <motion.div
          className="floating-shower"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0]
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
            x: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          🫧
        </motion.div>
        <motion.div
          className="floating-drop"
          animate={{
            y: [0, -10, 0],
            x: [0, -15, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          💧
        </motion.div>
      </div>

      <div className="auth-container">
        <motion.div
          className="auth-card glass"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="auth-header">
            <motion.div
              className="auth-icon"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              {isLogin ? <LogIn size={32} /> : <UserPlus size={32} />}
            </motion.div>
            <h1 className="auth-title">
              {isLogin ? 'Welcome Back!' : 'Join the Shower Club!'}
            </h1>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Track your shower habits and unlock achievements' 
                : 'Start your journey to better hygiene and mental wellness'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="username"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="form-group"
                >
                  <div className="input-wrapper">
                    <User className="input-icon" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required={!isLogin}
                      className="auth-input"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="form-group">
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-input"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-input"
                />
              </div>
            </div>

            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="auth-button"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <Loader className="spinner" />
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </motion.button>
          </form>

          <div className="auth-footer">
            <p className="auth-switch">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="switch-button"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="auth-features">
            <div className="feature">
              <span className="feature-icon">🏆</span>
              <span>Unlock Achievements</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>Track Progress</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🧠</span>
              <span>Mental Wellness</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage; 