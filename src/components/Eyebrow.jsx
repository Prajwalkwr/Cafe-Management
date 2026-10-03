import { motion, useReducedMotion } from 'motion/react';
import { useReveal } from '../hooks/useReveal.js';
import { DURATION, EASE } from '../motion/tokens.js';

export default function Eyebrow({ children, className = '', light = false }) {
  const reduce = useReducedMotion();
  const [ref, shown] = useReveal();
  const color = light ? 'text-cream/80' : 'text-coffee';
  const visible = reduce || shown;

  return (
    <motion.p
      ref={ref}
      className={`eyebrow inline-flex items-center gap-3 ${color} ${light ? 'is-light' : ''} ${className}`}
      initial={reduce ? false : { opacity: 0, x: -12 }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
      transition={{ duration: DURATION.normal, ease: EASE }}
    >
      <motion.span
        aria-hidden="true"
        className={`inline-block h-px w-[25px] origin-left ${light ? 'bg-cream/70' : 'bg-coffee'}`}
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: visible ? 1 : 0 }}
        transition={{ duration: DURATION.normal, ease: EASE }}
      />
      <span>{children}</span>
    </motion.p>
  );
}
