import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { Droplets, BarChart3, Award, Users, Zap, Heart } from 'lucide-react';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useUser();

  const features = [
    {
      icon: <BarChart3 className="feature-icon" />,
      title: t('interactiveAnalytics'),
      description: t('interactiveAnalyticsDesc')
    },
    {
      icon: <Award className="feature-icon" />,
      title: t('achievementSystem'),
      description: t('achievementSystemDesc')
    },
    {
      icon: <Users className="feature-icon" />,
      title: t('communityInsights'),
      description: t('communityInsightsDesc')
    },
    {
      icon: <Zap className="feature-icon" />,
      title: t('realTimeTracking'),
      description: t('realTimeTrackingDesc')
    },
    {
      icon: <Heart className="feature-icon" />,
      title: t('mentalWellnessFocus'),
      description: t('mentalWellnessFocusDesc')
    },
    {
      icon: <Droplets className="feature-icon" />,
      title: t('personalDashboard'),
      description: t('personalDashboardDesc')
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <motion.div 
      className="about-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section 
        className="about-hero"
        variants={itemVariants}
      >
        <div className="container">
          <div className="hero-content">
            <motion.div
              className="hero-icon"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🚿
            </motion.div>
            <motion.h1 
              className="hero-title gradient-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('title')}
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('subtitle')}
            </motion.p>
            
            {!isAuthenticated && (
              <motion.div 
                className="hero-cta"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link to="/login">
                  <motion.button
                    className="cta-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t('login')}
                  </motion.button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="features-section"
        variants={itemVariants}
      >
        <div className="container">
          <h2 className="section-title">{t('features')}</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="feature-card glass"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="feature-icon-wrapper">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Data Disclaimer */}
      <motion.section 
        className="disclaimer-section"
        variants={itemVariants}
      >
        <div className="container">
          <div className="disclaimer-content glass">
            <h2 className="section-title">{t('dataPrivacy')}</h2>
            <div className="disclaimer-grid">
              <div className="disclaimer-item">
                <h3>📊 {t('syntheticData')}</h3>
                <p>
                  {t('syntheticDataDesc')}
                </p>
              </div>
              <div className="disclaimer-item">
                <h3>🔒 {t('yourPrivacy')}</h3>
                <p>
                  {t('yourPrivacyDesc')}
                </p>
              </div>
              <div className="disclaimer-item">
                <h3>🎓 {t('educationalPurpose')}</h3>
                <p>
                  {t('educationalPurposeDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>



      {/* Floating Background Elements */}
      <div className="about-background">
        <motion.div
          className="floating-element"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🧼
        </motion.div>
        <motion.div
          className="floating-element"
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          🫧
        </motion.div>
        <motion.div
          className="floating-element"
          animate={{
            y: [0, -10, 0],
            x: [0, 20, 0],
            scale: [1, 0.9, 1]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        >
          💧
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AboutPage; 