import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import CafeImage from './CafeImage.jsx';
import SectionLink from './SectionLink.jsx';
import { useIntro } from '../context/IntroContext.jsx';
import { useDesktopMotion } from '../hooks/useDesktopMotion.js';
import { EASE } from '../motion/tokens.js';
import { resolveImage } from '../data/images.js';
import { scrollToId } from '../utils/scroll.js';

const lines = ['Where Every', 'Taste Feels', 'Like Home.'];

export default function Hero() {
  const ready = useIntro();
  const reduce = useReducedMotion();
  const desktop = useDesktopMotion();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const play = ready || reduce;

  return (
    <section ref={sectionRef} className="relative flex min-h-[100svh] items-end overflow-hidden">
      <motion.div style={desktop && !reduce ? { y } : undefined} className="absolute -top-[8%] right-0 left-0 h-[116%]">
        <motion.div
          className="h-full w-full"
          initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)', scale: 1.08, opacity: 0 }}
          animate={play ? { clipPath: 'inset(0 0 0% 0)', scale: 1, opacity: 1 } : undefined}
          transition={{ duration: reduce ? 0.15 : 0.7, ease: EASE }}
        >
          <CafeImage
            src={resolveImage('hero-kathmandu-cafe.jpg')}
            alt="Sunlit Kathmandu café interior with wooden tables, plants, and Nepali pottery"
            priority
            className="h-full w-full object-cover"
          />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-ink/30" />
      <div className="relative shell pb-24 pt-32 text-cream">
        <motion.p
          className="text-xs tracking-[0.32em] uppercase text-cream/80"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={play ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4, delay: 0.05, ease: EASE }}
        >
          Est. 2020 · Kathmandu Café
        </motion.p>
        <h1 className="display mt-4 max-w-4xl text-[2.7rem] sm:text-6xl lg:text-7xl">
          <span className="sr-only">Where Every Taste Feels Like Home.</span>
          <span aria-hidden="true">
            {lines.map((line, index) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: '110%' }}
                  animate={play ? { y: '0%' } : undefined}
                  transition={{ duration: 0.55, delay: 0.08 + index * 0.05, ease: EASE }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>
        <motion.p
          className="mt-6 max-w-xl text-base leading-relaxed text-cream/90 sm:text-lg"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={play ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.4, delay: 0.18, ease: EASE }}
        >
          Handcrafted coffee, comforting Nepali flavours, and a space made for slow mornings, good conversations, and sweet moments.
        </motion.p>
        <motion.div
          className="mt-8 flex flex-wrap gap-3"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={play ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.35, delay: 0.24, ease: EASE }}
        >
          <SectionLink id="menu" className="btn btn-light" data-cursor="hover">Explore Our Menu <span className="btn-arrow" aria-hidden="true">→</span></SectionLink>
          <SectionLink id="story" className="btn btn-ghost">Our Story</SectionLink>
        </motion.div>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <motion.button
          type="button"
          className="text-[0.68rem] tracking-[0.28em] text-cream/80 uppercase"
          onClick={() => scrollToId('story')}
          initial={reduce ? false : { opacity: 0 }}
          animate={play ? { opacity: 1 } : undefined}
          transition={{ duration: 0.35, delay: 0.32, ease: EASE }}
        >
          Scroll to Explore
        </motion.button>
      </div>
    </section>
  );
}
