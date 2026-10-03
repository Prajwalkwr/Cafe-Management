import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import CafeImage from './CafeImage.jsx';
import { resolveImage } from '../data/images.js';
import { useFocusTrap, useLockBody } from '../hooks/useUi.js';

export default function GalleryLightbox({ items, index, onClose, onIndex }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const open = index !== null && items[index];
  useLockBody(Boolean(open));
  useFocusTrap(ref, Boolean(open));

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') onIndex((index + 1) % items.length);
      if (event.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, items.length, onClose, onIndex]);

  const item = open ? items[index] : null;

  return (
    <AnimatePresence>
      {item ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
      <button type="button" className="absolute inset-0 bg-ink/80" aria-label="Close gallery" onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={item.alt}
        className="relative w-full max-w-5xl"
        initial={reduce ? false : { opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.4 }}
      >
        <CafeImage key={item.image} src={resolveImage(item.image)} alt={item.alt} className="max-h-[78svh] w-full rounded-2xl object-contain" />
        <p className="mt-3 text-center text-sm text-cream">{item.title}</p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button type="button" className="btn btn-light btn-small" onClick={() => onIndex((index - 1 + items.length) % items.length)}>
            Previous
          </button>
          <span className="text-sm text-cream">{index + 1} / {items.length}</span>
          <button type="button" className="btn btn-light btn-small" onClick={() => onIndex((index + 1) % items.length)}>
            Next
          </button>
          <button type="button" className="btn btn-ghost btn-small" onClick={onClose}>
            Close
          </button>
        </div>
      </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
