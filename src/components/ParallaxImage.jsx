import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useDesktopMotion } from '../hooks/useDesktopMotion.js';

export default function ParallaxImage({ children, className = '' }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const desktop = useDesktopMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);
  const active = desktop && !reduce;

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={active ? { y } : undefined} className={active ? 'scale-[1.08]' : undefined}>
        {children}
      </motion.div>
    </div>
  );
}
