'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
  threshold?: number;
}

export default function ScrollReveal({ 
  children, 
  className = '', 
  variant = 'up', 
  delay = 0, 
  threshold = 0.15 
}: ScrollRevealProps) {
  
  const framerDelay = delay / 1000;
  
  const variants = {
    up: {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20, delay: framerDelay } }
    },
    left: {
      hidden: { opacity: 0, x: -40 },
      visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 20, delay: framerDelay } }
    },
    right: {
      hidden: { opacity: 0, x: 40 },
      visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 20, delay: framerDelay } }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.85 },
      visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100, damping: 20, delay: framerDelay } }
    }
  };

  return (
    <motion.div 
      className={className}
      variants={variants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" }}
    >
      {children}
    </motion.div>
  );
}
