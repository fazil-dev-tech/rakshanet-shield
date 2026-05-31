'use client';

import { useRef, MouseEvent, ReactNode } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'purple' | 'amber' | 'emerald' | 'none';
  tiltIntensity?: number;
  interactive?: boolean;
}

export default function GlassCard({
  children,
  className = '',
  glowColor = 'cyan',
  tiltIntensity = 12,
  interactive = true
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Nuke & Pave: 60fps Motion Values (Bypasses React Renders)
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [tiltIntensity, -tiltIntensity]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-tiltIntensity, tiltIntensity]);
  
  // Map legacy color names to new Pink/White Theme
  const glowStyles = {
    cyan: 'hover:shadow-[0_0_35px_rgba(236,72,153,0.25)] border-pink-500/20 hover:border-pink-400/50',
    purple: 'hover:shadow-[0_0_35px_rgba(244,114,182,0.25)] border-rose-500/20 hover:border-rose-400/50',
    amber: 'hover:shadow-[0_0_35px_rgba(255,255,255,0.25)] border-white/20 hover:border-white/50',
    emerald: 'hover:shadow-[0_0_35px_rgba(216,180,254,0.25)] border-fuchsia-500/20 hover:border-fuchsia-400/50',
    none: 'border-white/10 hover:border-white/20'
  }[glowColor];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!interactive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
    opacity.set(1);
  };

  const handleMouseLeave = () => { 
    x.set(0); 
    y.set(0); 
    opacity.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={interactive ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
      className={`glass-panel p-6 relative rounded-2xl border bg-white/[0.03] backdrop-blur-2xl overflow-hidden transition-colors duration-300 ${glowStyles} ${className}`}
    >
      {interactive && (
        <motion.div 
          style={{ opacity }}
          className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-white/20 mix-blend-overlay"
        />
      )}
      {children}
    </motion.div>
  );
}
