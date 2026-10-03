import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import CafeImage from './CafeImage.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import Eyebrow from './Eyebrow.jsx';
import GalleryLightbox from './GalleryLightbox.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { EASE } from '../motion/tokens.js';
import { resolveImage } from '../data/images.js';

function GalleryTile({ item, index, reduce, onOpen }) {
  const [ref, shown] = useReveal();
  return (
    <motion.button
      ref={ref}
      type="button"
      data-cursor="view"
      className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl"
      onClick={() => onOpen(index)}
      initial={reduce ? false : { opacity: 0, y: 20, scale: 0.97 }}
      animate={reduce || shown ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.4, delay: (index % 3) * 0.04, ease: EASE }}
    >
      <CafeImage
        src={resolveImage(item.image)}
        alt={item.alt}
        className={`gallery-zoom w-full object-cover ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
      />
      <span className="pointer-events-none absolute inset-0 bg-ink/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="pointer-events-none absolute inset-0 grid place-items-center text-sm tracking-[0.2em] text-cream uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100">View</span>
    </motion.button>
  );
}

export default function Gallery({ items, loading, error, onRetry }) {
  const [index, setIndex] = useState(null);
  const photos = items || [];
  const reduce = useReducedMotion();

  return (
    <section id="gallery" className="section scroll-mt-24 bg-cream-deep/40">
      <div className="shell">
        <div className="text-center">
          <Eyebrow className="w-full justify-center">Moments</Eyebrow>
          <h2 className="display mt-3 text-4xl sm:text-5xl">Life at Mithaas Café</h2>
        </div>
        <div className="mt-10">
          {loading && <LoadingSpinner label="Loading the gallery" />}
          {!loading && error && <ErrorMessage message={error} onRetry={onRetry} />}
          {!loading && !error && photos.length === 0 && (
            <p className="rounded-3xl bg-paper px-5 py-8 text-center text-stone">New photographs from the café will appear here soon.</p>
          )}
          {!loading && !error && photos.length > 0 && (
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {photos.map((item, photoIndex) => (
                <GalleryTile key={item.id} item={item} index={photoIndex} reduce={reduce} onOpen={setIndex} />
              ))}
            </div>
          )}
        </div>
      </div>
      <GalleryLightbox items={photos} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </section>
  );
}
