import React from 'react';
import { motion } from 'framer-motion';

interface OpticalRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  deepFocus?: boolean;
}

export const OpticalReveal: React.FC<OpticalRevealProps> = ({ 
  children, 
  delay = 0, 
  duration = 3.2, 
  deepFocus = false 
}) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        filter: deepFocus ? "blur(24px)" : "blur(12px)", 
        y: deepFocus ? 0 : 10, 
        scale: deepFocus ? 1.1 : 1 
      }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
      transition={{ duration, delay, ease: [0.2, 0.8, 0.2, 1] }} 
      style={{ willChange: "opacity, filter, transform" }}
    >
      {children}
    </motion.div>
  );
};