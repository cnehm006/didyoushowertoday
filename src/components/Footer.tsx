import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Droplets } from 'lucide-react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="footer-content">
        <div className="footer-text">
          Made with 
          <motion.span 
            className="heart-icon"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            <Heart size={16} />
          </motion.span>
          and 
          <motion.span 
            className="shampoo-icon"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Droplets size={16} />
          </motion.span>
          shampoo
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer; 