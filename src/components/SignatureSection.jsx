import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import CafeImage from './CafeImage.jsx';
import Eyebrow from './Eyebrow.jsx';
import ParallaxImage from './ParallaxImage.jsx';
import RevealText from './RevealText.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { EASE } from '../motion/tokens.js';
import { resolveImage } from '../data/images.js';

const features = [
  {
    number: '01',
    title: 'Himalayan Coffee Ritual',
    image: 'nepali-coffee.jpg',
    alt: 'Coffee poured into a ceramic cup beside a brass kettle',
    text: 'Our coffee is pulled in small batches and finished with the spices we grew up tasting — cardamom in the latte, cocoa in the mocha, nothing louder than the cup itself. The ritual is simple: good beans, hot water, and enough time.',
    to: '/menu?category=Coffee',
    cta: 'See the coffee',
  },
  {
    number: '02',
    title: 'The Mithaas Platter',
    image: 'signature-platter.jpg',
    alt: 'A Nepali sharing platter with momos, grilled chicken, potatoes, and tea',
    text: 'A plate for the middle of the table: momos, sekuwa, a spoon of aloo sadeko, and pickle. It is how we like to eat with friends — a little of everything, passed around while the tea stays hot.',
    to: '/menu?category=Nepali',
    cta: 'Explore Nepali plates',
  },
  {
    number: '03',
    title: 'Weekend Nepali Kitchen',
    image: 'signature-kitchen.jpg',
    alt: 'The evening kitchen plating rice and vegetables',
    text: 'From Friday evening the kitchen turns toward the valley. Thakali sets, Newari khaja, and a sweet that changes with the season. If yomari or sel roti is on the board, it was made that day.',
    to: '/menu?category=Desserts',
    cta: 'View seasonal sweets',
  },
];

function SignatureFeature({ feature, flip }) {
  const reduce = useReducedMotion();
  const [ref, shown] = useReveal();
  const visible = reduce || shown;
  const enter = (delay) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.5, delay: reduce ? 0 : delay, ease: EASE },
  });

  return (
    <article ref={ref} className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`}>
      <motion.div {...enter(0.05)}>
        <ParallaxImage className="rounded-[1.6rem]">
          <CafeImage data-cursor="image" src={resolveImage(feature.image)} alt={feature.alt} className="aspect-[16/10] w-full object-cover" />
        </ParallaxImage>
      </motion.div>
      <div>
        <motion.p {...enter(0)} className="display text-5xl text-terracotta/80">{feature.number}</motion.p>
        <motion.h3 {...enter(0.1)} className="display mt-3 text-4xl">{feature.title}</motion.h3>
        <motion.p {...enter(0.14)} className="mt-4 leading-relaxed text-stone">{feature.text}</motion.p>
        <motion.div {...enter(0.18)}>
          <Link to={feature.to} className="btn btn-line mt-6">
            {feature.cta} <span className="btn-arrow" aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>
    </article>
  );
}

export default function SignatureSection() {
  return (
    <section id="signature" className="section scroll-mt-24">
      <div className="shell">
        <div>
          <Eyebrow>Signatures</Eyebrow>
          <RevealText className="display mt-3 max-w-xl text-4xl sm:text-5xl" lines={['Flavours That', 'Define Mithaas']} />
        </div>
        <div className="mt-14 space-y-16">
          {features.map((feature, index) => (
            <SignatureFeature key={feature.number} feature={feature} flip={index % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
