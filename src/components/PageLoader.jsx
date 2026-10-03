import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Logo from './Logo.jsx';
import { EASE } from '../motion/tokens.js';

const NAME = 'Mithaas Café';

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function PageLoader({ onReady }) {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(reduce ? NAME.length : 0);
  const [phase, setPhase] = useState('run');
  const [mounted, setMounted] = useState(true);
  const finished = useRef(false);

  useEffect(() => {
    document.getElementById('boot-loader')?.remove();
  }, []);

  useEffect(() => {
    if (reduce) return undefined;
    const timer = window.setInterval(() => {
      setCount((value) => (value >= NAME.length ? value : value + 1));
    }, 28);
    return () => window.clearInterval(timer);
  }, [reduce]);

  useEffect(() => {
    let cancelled = false;

    function finish() {
      if (cancelled || finished.current) return;
      finished.current = true;
      setPhase('leave');
      onReady?.();
      if (reduce) window.setTimeout(() => setMounted(false), 280);
    }

    async function run() {
      const fonts = document.fonts?.ready || Promise.resolve();
      await Promise.race([fonts, wait(reduce ? 80 : 280)]);
      finish();
    }

    run();
    const cap = window.setTimeout(finish, reduce ? 200 : 650);
    return () => {
      cancelled = true;
      window.clearTimeout(cap);
    };
  }, [onReady, reduce]);

  useEffect(() => {
    if (phase !== 'leave') return undefined;
    const timer = window.setTimeout(() => setMounted(false), 550);
    return () => window.clearTimeout(timer);
  }, [phase]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] grid place-items-center bg-cream"
      initial={{ y: 0 }}
      animate={phase === 'leave' ? { y: reduce ? 0 : '-100%' } : { y: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.4, ease: EASE }}
      onAnimationComplete={() => {
        if (phase === 'leave') setMounted(false);
      }}
    >
      <motion.div
        className="w-[min(100%-3rem,28rem)] text-center"
        animate={phase === 'leave' ? { opacity: 0, scale: 0.98 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <Logo />
        <p className="display mt-6 min-h-10 text-4xl" aria-hidden="true">{NAME.slice(0, count)}</p>
        <p className="sr-only">Mithaas Café</p>
        <motion.p
          className="mt-3 text-sm tracking-[0.18em] text-stone uppercase"
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: count > NAME.length - 1 || reduce ? 1 : 0, y: count > NAME.length - 1 || reduce ? 0 : 8 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          Preparing something special…
        </motion.p>
        <div className="mx-auto mt-8 h-px w-40 overflow-hidden bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-label="Loading Mithaas Café">
          <div className={`loader-bar h-full origin-left bg-coffee ${reduce ? 'scale-x-100' : ''}`} />
        </div>
      </motion.div>
    </motion.div>
  );
}
