import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, Target } from 'lucide-react';
import './AchievementBadge.css';

interface AchievementBadgeProps {
  type: 'streak' | 'vibe' | 'consistency' | 'goal';
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  icon?: React.ReactNode;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  type,
  title,
  description,
  progress,
  maxProgress,
  unlocked,
  icon
}) => {
  const progressPercentage = Math.min((progress / maxProgress) * 100, 100);
  
  const getIcon = () => {
    if (icon) return icon;
    
    switch (type) {
      case 'streak':
        return <Zap className="badge-icon" />;
      case 'vibe':
        return <Star className="badge-icon" />;
      case 'consistency':
        return <Target className="badge-icon" />;
      case 'goal':
        return <Trophy className="badge-icon" />;
      default:
        return <Star className="badge-icon" />;
    }
  };

  const getBadgeColor = () => {
    switch (type) {
      case 'streak':
        return 'var(--warning-color)';
      case 'vibe':
        return 'var(--success-color)';
      case 'consistency':
        return 'var(--accent-color)';
      case 'goal':
        return '#fbbf24';
      default:
        return 'var(--accent-color)';
    }
  };

  return (
    <motion.div
      className={`achievement-badge ${unlocked ? 'unlocked' : 'locked'}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="badge-header">
        <div 
          className="badge-icon-container"
          style={{ 
            backgroundColor: unlocked ? getBadgeColor() : 'var(--text-muted)',
            color: unlocked ? 'white' : 'var(--text-secondary)'
          }}
        >
          {getIcon()}
        </div>
        <div className="badge-info">
          <h3 className="badge-title">{title}</h3>
          <p className="badge-description">{description}</p>
        </div>
      </div>
      
      <div className="badge-progress">
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            style={{ backgroundColor: getBadgeColor() }}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <span className="progress-text">
          {progress} / {maxProgress}
        </span>
      </div>

      {unlocked && (
        <motion.div
          className="unlock-effect"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          🎉
        </motion.div>
      )}
    </motion.div>
  );
};

export default AchievementBadge; 