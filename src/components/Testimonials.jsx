import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import ErrorMessage from './ErrorMessage.jsx';
import Eyebrow from './Eyebrow.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import { EASE } from '../motion/tokens.js';

export default function Testimonials({ items, loading, error, onRetry }) {
  const quotes = items || [];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const reduce = useReducedMotion();

  function show(next) {
    const total = quotes.length;
    if (!total) return;
    const normalized = (next + total) % total;
    setDirection(next >= index ? 1 : -1);
    setIndex(normalized);
  }

  useEffect(() => {
    if (quotes.length < 2 || paused) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % quotes.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [paused, quotes.length]);

  useEffect(() => {
    if (index > quotes.length - 1) setIndex(0);
  }, [index, quotes.length]);

  const quote = quotes[index];

  return (
    <section className="section scroll-mt-24" aria-roledescription="carousel" aria-label="Guest testimonials">
      <div className="shell max-w-3xl text-center">
        <Eyebrow className="w-full justify-center">Guests</Eyebrow>
        <h2 className="display mt-3 text-4xl sm:text-5xl">Words From Our Guests</h2>
        <div className="mt-10" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          {loading && <div className="flex justify-center"><LoadingSpinner label="Loading guest notes" /></div>}
          {!loading && error && <ErrorMessage message={error} onRetry={onRetry} />}
          {!loading && !error && !quote && <p className="text-stone">Guest notes will appear here soon.</p>}
          {!loading && !error && quote && (
            <AnimatePresence mode="wait" custom={direction}>
              <motion.figure
                key={quote.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: direction * 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -20 }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <p className="tracking-[0.3em] text-terracotta" aria-label={`${quote.rating} out of 5 stars`}>
                  {'★'.repeat(quote.rating || 5)}
                </p>
                <blockquote className="display mt-6 text-3xl italic leading-snug sm:text-4xl">“{quote.quote}”</blockquote>
                <figcaption className="mt-6">
                  <p className="font-medium">{quote.name}</p>
                  <p className="text-sm text-stone">{quote.role}</p>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          )}
        </div>
        {quote && quotes.length > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button type="button" className="btn btn-line btn-small" onClick={() => show(index - 1)}>
              Previous
            </button>
            <div className="flex gap-2" aria-label="Choose a testimonial">
              {quotes.map((item, dot) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Show testimonial from ${item.name}`}
                  aria-current={dot === index}
                  className={`h-2.5 w-2.5 rounded-full ${dot === index ? 'bg-ink' : 'bg-line'}`}
                  onClick={() => show(dot)}
                />
              ))}
            </div>
            <button type="button" className="btn btn-line btn-small" onClick={() => show(index + 1)}>
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
