import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import SectionLink from './SectionLink.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { EASE } from '../motion/tokens.js';
import { CAFE_CONTACT, CAFE_LOCATION, CAFE_SOCIAL, WEEKDAY_HOURS, WEEKEND_HOURS } from '../../shared/site.js';

const links = [
  ['story', 'Our Story'],
  ['menu', 'Menu'],
  ['signature', 'Signature'],
  ['gallery', 'Gallery'],
  ['reserve', 'Reserve'],
  ['contact', 'Contact'],
];

export default function Footer() {
  const reduce = useReducedMotion();
  const [ref, shown] = useReveal();
  return (
    <motion.footer
      ref={ref}
      className="bg-ink text-cream"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={reduce || shown ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: reduce ? 0.2 : 0.5, ease: EASE }}
    >
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-xs text-sm text-cream/75">Where Every Taste Feels Like Home.</p>
        </div>
        <div>
          <h2 className="text-xs tracking-[0.2em] uppercase text-cream/60">Navigate</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {links.map(([id, label]) => (
              <li key={id}>
                <SectionLink id={id} className="text-cream/85 hover:text-white">{label}</SectionLink>
              </li>
            ))}
            <li><Link to="/menu" className="text-cream/85 hover:text-white">Full Menu</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs tracking-[0.2em] uppercase text-cream/60">Opening Hours</h2>
          <p className="mt-4 text-sm text-cream/80">{WEEKDAY_HOURS.label}<br />{WEEKDAY_HOURS.display}</p>
          <p className="mt-3 text-sm text-cream/80">{WEEKEND_HOURS.label}<br />{WEEKEND_HOURS.display}</p>
        </div>
        <div>
          <h2 className="text-xs tracking-[0.2em] uppercase text-cream/60">Contact</h2>
          <p className="mt-4 text-sm text-cream/80">
            {CAFE_LOCATION.name}<br />
            {CAFE_LOCATION.street}<br />
            {CAFE_LOCATION.city}, {CAFE_LOCATION.country}
          </p>
          <p className="mt-3 text-sm">
            <a href={`tel:${CAFE_CONTACT.phoneHref}`}>{CAFE_CONTACT.phone}</a><br />
            <a href={`mailto:${CAFE_CONTACT.email}`}>{CAFE_CONTACT.email}</a>
          </p>
          <ul className="mt-3 space-y-1 text-sm text-cream/70">
            {CAFE_SOCIAL.map((item) => (
              <li key={item.name}>{item.name}: {item.handle}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="shell py-5 text-sm text-cream/60">© 2026 Mithaas Café. All rights reserved.</p>
      </div>
    </motion.footer>
  );
}
