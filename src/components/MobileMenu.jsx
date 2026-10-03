import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import SectionLink from './SectionLink.jsx';
import { useFocusTrap, useLockBody } from '../hooks/useUi.js';
import { EASE } from '../motion/tokens.js';

const links = [
  { id: 'story', label: 'Our Story' },
  { id: 'menu', label: 'Menu' },
  { id: 'signature', label: 'Signature' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'reserve', label: 'Reserve' },
  { id: 'contact', label: 'Contact' },
];

export default function MobileMenu({ open, onClose }) {
  return (
    <AnimatePresence>
      {open ? <MenuPanel onClose={onClose} /> : null}
    </AnimatePresence>
  );
}

function MenuPanel({ onClose }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  useLockBody(true);
  useFocusTrap(ref, true);

  useEffect(() => {
    function onKey(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <motion.button
        type="button"
        className="absolute inset-0 bg-ink/45"
        aria-label="Close menu"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.nav
        id="mobile-menu"
        ref={ref}
        className="absolute top-0 right-0 flex h-full w-[min(100%,22rem)] flex-col bg-paper px-6 py-24 shadow-2xl"
        aria-label="Mobile"
        initial={reduce ? false : { x: '100%' }}
        animate={{ x: 0 }}
        exit={reduce ? { opacity: 0 } : { x: '100%' }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {links.map((link, index) => (
          <motion.div
            key={link.id}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + index * 0.05, duration: 0.4, ease: EASE }}
          >
            <SectionLink id={link.id} onNavigate={onClose} className="block border-b border-line py-4 text-lg">
              {link.label}
            </SectionLink>
          </motion.div>
        ))}
        <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
          <Link to="/admin/login" onClick={onClose} className="block border-b border-line py-4 text-lg">
            Admin
          </Link>
          <SectionLink id="reserve" onNavigate={onClose} className="btn btn-primary mt-8">
            Reserve a Table <span className="btn-arrow" aria-hidden="true">→</span>
          </SectionLink>
        </motion.div>
      </motion.nav>
    </div>
  );
}
