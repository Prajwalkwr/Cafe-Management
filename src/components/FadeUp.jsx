import { motion, useReducedMotion } from 'motion/react';
import { useReveal } from '../hooks/useReveal.js';
import { DURATION, EASE } from '../motion/tokens.js';

export default function FadeUp({ children, className = '', delay = 0, as = 'div' }) {
  const reduce = useReducedMotion();
  const [ref, shown] = useReveal();
  const Tag = motion[as] || motion.div;

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <Tag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: DURATION.slow, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}
