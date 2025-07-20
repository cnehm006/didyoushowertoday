import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LogIn, UserPlus, Mail, Lock, User, Loader } from 'lucide-react';
import Footer from './Footer';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const { login, signup, isLoading, isAuthenticated } = useUser();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    const isEmailValid = validateEmail(email);
    const isPasswordValid = !isLogin ? validatePassword(password) : true;

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      let result;
      
      if (isLogin) {
        result = await login(email, password);
      } else {
        result = await signup(email, username, password);
      }

      if (!result.success) {
        setError(result.error || 'An error occurred');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPasswordError('');
    setEmailError('');
    setEmail('');
    setUsername('');
    setPassword('');
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('');
      return true; // Allow empty for login
    }
    if (!emailRegex.test(email)) {
      setEmailError(t('invalidEmail'));
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError(t('weakPassword'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!isLogin) {
      validatePassword(newPassword);
    }
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

      <div className="auth-layout">
        {/* Left Side - Auth Form */}
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
              {isLogin ? t('welcomeBack') : t('joinShowerClub')}
            </h1>
            <p className="auth-subtitle">
              {isLogin 
                ? t('welcomeBackDesc') 
                : t('joinShowerClubDesc')
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
                      placeholder={t('username')}
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
                  placeholder={t('email')}
                  value={email}
                  onChange={handleEmailChange}
                  required
                  className={`auth-input ${emailError ? 'error' : ''}`}
                />
              </div>
              {emailError && (
                <motion.div
                  className="email-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {emailError}
                </motion.div>
              )}
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type="password"
                  placeholder={t('password')}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                  className={`auth-input ${passwordError ? 'error' : ''}`}
                />
              </div>
              {passwordError && (
                <motion.div
                  className="password-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {passwordError}
                </motion.div>
              )}
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
                isLogin ? t('signIn') : t('createAccount')
              )}
            </motion.button>
          </form>

          <div className="auth-footer">
            <p className="auth-switch">
              {isLogin ? t('noAccount') : t('haveAccount')}
              <button
                type="button"
                onClick={toggleMode}
                className="switch-button"
              >
                {isLogin ? t('signUp') : t('signIn')}
              </button>
            </p>
          </div>

          <div className="auth-features">
            <div className="feature">
              <span className="feature-icon">🏆</span>
              <span>{t('unlockAchievements')}</span>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <span>{t('trackProgress')}</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🧠</span>
              <span>{t('mentalWellness')}</span>
            </div>
          </div>
        </motion.div>
      </div>

        {/* Right Side - Big Title */}
        <motion.div 
          className="auth-title-section"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div
            className="title-icon"
            animate={{ 
              rotate: [0, 360],
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
          <motion.h1 
            className="big-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {t('title')}
          </motion.h1>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default AuthPage; 