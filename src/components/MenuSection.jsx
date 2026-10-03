import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Eyebrow from './Eyebrow.jsx';
import { EASE } from '../motion/tokens.js';
import ErrorMessage from './ErrorMessage.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import MenuCard from './MenuCard.jsx';
import MenuFilter from './MenuFilter.jsx';
import MenuModal from './MenuModal.jsx';
import Reveal from './Reveal.jsx';

export default function MenuSection({ items, loading, error, onRetry, initialCategory = 'All' }) {
  const [category, setCategory] = useState(initialCategory);
  const [selected, setSelected] = useState(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    setCategory(initialCategory || 'All');
  }, [initialCategory]);
  const visible = useMemo(
    () => (category === 'All' ? items || [] : (items || []).filter((item) => item.category === category)),
    [category, items],
  );

  return (
    <section id="menu" className="section scroll-mt-24 bg-cream-deep/50">
      <div className="shell">
        <Reveal>
          <Eyebrow className="w-full justify-center">The Menu</Eyebrow>
          <h2 className="display mt-3 text-center text-4xl sm:text-5xl">Crafted for Every Craving</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-stone">
            From Himalayan-inspired comfort food to carefully brewed coffee, every item is prepared fresh with ingredients we love.
          </p>
        </Reveal>
        <div className="mt-8">
          <MenuFilter value={category} onChange={setCategory} />
        </div>
        <div className="mt-8">
          {loading && <LoadingSpinner label="Loading the menu" />}
          {!loading && error && <ErrorMessage message={error} onRetry={onRetry} />}
          {!loading && !error && visible.length === 0 && (
            <p className="rounded-3xl bg-paper px-5 py-8 text-center text-stone">Nothing in this category right now. Try another part of the menu.</p>
          )}
          {!loading && !error && visible.length > 0 && (
            <div key={category} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: reduce ? 0 : Math.min(index, 4) * 0.03, ease: EASE }}
                >
                  <MenuCard item={item} onView={setSelected} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <MenuModal item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
