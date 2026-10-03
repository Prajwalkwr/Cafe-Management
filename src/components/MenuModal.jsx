import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import CafeImage from './CafeImage.jsx';
import { resolveImage } from '../data/images.js';
import { formatNpr } from '../utils/format.js';
import { useFocusTrap, useLockBody } from '../hooks/useUi.js';

export default function MenuModal({ item, onClose }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  useLockBody(Boolean(item));
  useFocusTrap(ref, Boolean(item));

  useEffect(() => {
    if (!item) return undefined;
    function onKey(event) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          key={item.id}
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
      <button type="button" className="absolute inset-0 bg-ink/60" aria-label="Close item details" onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-item-title"
        className="relative grid max-h-[90svh] w-full max-w-3xl overflow-auto rounded-[1.6rem] bg-paper shadow-2xl md:grid-cols-2"
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.35 }}
      >
        <CafeImage
          src={resolveImage(item.image)}
          alt={item.name}
          className="h-64 w-full object-cover md:h-full"
        />
        <div className="p-6 sm:p-8">
          <p className="text-xs tracking-[0.18em] text-coffee uppercase">{item.category}</p>
          <h3 id="menu-item-title" className="display mt-2 text-4xl">{item.name}</h3>
          <p className="mt-4 leading-relaxed text-stone">{item.description}</p>
          <p className="mt-6 text-lg">{formatNpr(item.price)}</p>
          <p className="mt-2 text-sm text-forest">{item.available === false ? 'Currently unavailable' : 'Available today'}</p>
          <button type="button" className="btn btn-primary mt-8" onClick={onClose}>
            Close
          </button>
        </div>
        <button type="button" className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-paper/90" aria-label="Close" onClick={onClose}>
          ×
        </button>
      </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
