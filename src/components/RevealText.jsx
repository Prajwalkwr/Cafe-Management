import { motion, useReducedMotion } from 'motion/react';
import { useReveal } from '../hooks/useReveal.js';
import { DURATION, EASE } from '../motion/tokens.js';

export default function RevealText({ lines, className = '', as: Tag = 'h2' }) {
  const reduce = useReducedMotion();
  const [ref, shown] = useReveal();

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, index) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={reduce ? false : { y: '105%' }}
            animate={reduce || shown ? { y: '0%' } : { y: '105%' }}
            transition={{ duration: DURATION.slow, delay: index * 0.06, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
