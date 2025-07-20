import React from 'react';
import { motion } from 'framer-motion';
import './FloatingParticles.css';

const FloatingParticles: React.FC = () => {
  const particles = [
    { emoji: '💧', delay: 0, duration: 8 },
    { emoji: '🫧', delay: 1, duration: 10 },
    { emoji: '🌊', delay: 2, duration: 12 },
    { emoji: '💦', delay: 3, duration: 9 },
    { emoji: '🫧', delay: 4, duration: 11 },
    { emoji: '💧', delay: 5, duration: 7 },
    { emoji: '🌊', delay: 6, duration: 13 },
    { emoji: '💦', delay: 7, duration: 8 },
  ];

  return (
    <div className="floating-particles">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="particle"
          initial={{ 
            y: '100vh',
            x: Math.random() * window.innerWidth,
            opacity: 0,
            scale: 0
          }}
          animate={{
            y: '-10vh',
            x: Math.random() * window.innerWidth,
            opacity: [0, 0.8, 0.8, 0],
            scale: [0, 1, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {particle.emoji}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingParticles; 