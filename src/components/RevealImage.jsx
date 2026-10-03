import { motion, useReducedMotion } from 'motion/react';
import { useReveal } from '../hooks/useReveal.js';
import { DURATION, EASE } from '../motion/tokens.js';

export default function RevealImage({ children, className = '' }) {
  const reduce = useReducedMotion();
  const [ref, shown] = useReveal();

  if (reduce) return <div className={`overflow-hidden ${className}`}>{children}</div>;

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 1.08 }}
        animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }}
        transition={{ duration: DURATION.cinematic, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
