import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { showerData, productUsageData } from '../data/showerData';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import PieChart from './charts/PieChart';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const [selectedGroup, setSelectedGroup] = useState<string>('students');

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
    <motion.main 
      className="dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.section 
        className="hero-section"
        variants={itemVariants}
      >
        <div className="container">
          <div className="hero-content">
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {t('heroTitle')}
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {t('heroSubtitle')}
            </motion.p>
            
            {/* Group Selector */}
            <motion.div 
              className="hero-controls"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="group-selector glass">
                <label htmlFor="group-select" className="selector-label">
                  {t('selectGroup')}
                </label>
                <select
                  id="group-select"
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="group-select"
                >
                  <option value="students">{t('students')}</option>
                  <option value="remoteWorkers">{t('remoteWorkers')}</option>
                  <option value="officeWorkers">{t('officeWorkers')}</option>
                </select>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <section className="main-content">
        <div className="container">
          {/* Data Disclaimer */}
          <motion.div 
            className="data-disclaimer glass"
            variants={itemVariants}
          >
            <p className="disclaimer-text">
              📊 <strong>{t('disclaimerNote')}:</strong> {t('disclaimerText')}
            </p>
          </motion.div>

          {/* Charts Grid */}
          <div className="charts-grid">
          {/* Line Chart - Shower Frequency vs Mental State */}
          <motion.div 
            className="chart-container glass"
            variants={itemVariants}
          >
            <div className="chart-header">
              <h2 className="chart-title">{t('weeklyShowers')} vs {t('mentalState')}</h2>
              <div className="chart-emoji">📈</div>
            </div>
            <p className="chart-description">{t('lineChartDescription')}</p>
            <LineChart 
              data={showerData[selectedGroup]} 
              language={t}
            />
          </motion.div>

          {/* Bar Chart - Vibe Level by Day */}
          <motion.div 
            className="chart-container glass"
            variants={itemVariants}
          >
            <div className="chart-header">
              <h2 className="chart-title">{t('vibeLevel')}</h2>
              <div className="chart-emoji">🎯</div>
            </div>
            <p className="chart-description">{t('barChartDescription')}</p>
            <BarChart 
              data={showerData[selectedGroup]} 
              language={t}
            />
          </motion.div>

          {/* Pie Chart - Product Usage */}
          <motion.div 
            className="chart-container glass"
            variants={itemVariants}
          >
            <div className="chart-header">
              <h2 className="chart-title">{t('shampooUsage')}</h2>
              <div className="chart-emoji">🧴</div>
            </div>
            <p className="chart-description">{t('pieChartDescription')}</p>
            <PieChart 
              data={productUsageData} 
              language={t}
            />
          </motion.div>
        </div>

        {/* Fun Stats Section */}
        <motion.div 
          className="stats-section"
          variants={itemVariants}
        >
          <div className="stats-grid">
            <motion.div 
              className="stat-card glass"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="stat-icon">🚿</div>
              <div className="stat-content">
                <h3 className="stat-value">
                  {showerData[selectedGroup].reduce((sum, day) => sum + day.showers, 0).toFixed(1)}
                </h3>
                <p className="stat-label">{t('weeklyShowersLabel')}</p>
              </div>
            </motion.div>

            <motion.div 
              className="stat-card glass"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="stat-icon">🧠</div>
              <div className="stat-content">
                <h3 className="stat-value">
                  {(showerData[selectedGroup].reduce((sum, day) => sum + day.vibe, 0) / 7).toFixed(1)}
                </h3>
                <p className="stat-label">{t('avgVibeLevel')}</p>
              </div>
            </motion.div>

            <motion.div 
              className="stat-card glass"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3 className="stat-value">
                  {showerData[selectedGroup].filter(day => day.vibe >= 8).length}
                </h3>
                <p className="stat-label">{t('peakDays')}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
    </motion.main>
  );
};

export default Dashboard; 