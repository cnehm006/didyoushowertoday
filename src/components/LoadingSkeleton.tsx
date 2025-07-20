import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSkeletonProps {
  type: 'chart' | 'stats' | 'hero';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type }) => {
  const shimmerVariants = {
    shimmer: {
      x: ['-100%', '100%'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  if (type === 'chart') {
    return (
      <div className="skeleton-chart">
        <div className="skeleton-header">
          <div className="skeleton-title" />
          <div className="skeleton-emoji" />
        </div>
        <div className="skeleton-chart-area">
          <div className="skeleton-chart-content" />
        </div>
        <motion.div 
          className="skeleton-shimmer"
          variants={shimmerVariants}
          animate="shimmer"
        />
      </div>
    );
  }

  if (type === 'stats') {
    return (
      <div className="skeleton-stats">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton-stat-card">
            <div className="skeleton-stat-icon" />
            <div className="skeleton-stat-content">
              <div className="skeleton-stat-value" />
              <div className="skeleton-stat-label" />
            </div>
            <motion.div 
              className="skeleton-shimmer"
              variants={shimmerVariants}
              animate="shimmer"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-hero">
      <div className="skeleton-hero-title" />
      <div className="skeleton-hero-subtitle" />
      <div className="skeleton-hero-controls" />
      <motion.div 
        className="skeleton-shimmer"
        variants={shimmerVariants}
        animate="shimmer"
      />
    </div>
  );
};

export default LoadingSkeleton; 