import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { useIntro } from '../context/IntroContext.jsx';
import { EASE } from '../motion/tokens.js';
import Logo from './Logo.jsx';
import MobileMenu from './MobileMenu.jsx';
import SectionLink from './SectionLink.jsx';

const links = [
  { id: 'story', label: 'Our Story' },
  { id: 'menu', label: 'Menu' },
  { id: 'signature', label: 'Signature' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'reserve', label: 'Reserve' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const location = useLocation();
  const ready = useIntro();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const onHome = location.pathname === '/';
  const light = onHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!onHome) return undefined;
    const elements = links.map((link) => document.getElementById(link.id)).filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0.15, 0.4] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [onHome]);

  const linkClass = (id) =>
    `text-sm tracking-wide transition-colors ${
      light ? 'text-cream/90 hover:text-white' : 'text-ink/80 hover:text-ink'
    } ${active === id ? 'underline decoration-terracotta underline-offset-8' : ''}`;

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${light ? 'bg-transparent' : 'border-b border-line/80 bg-cream/90 backdrop-blur-md'}`}
      initial={reduce ? false : { opacity: 0, y: -20 }}
      animate={ready || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className={`shell flex items-center justify-between gap-4 transition-[height] duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
        <Link to="/" aria-label="Mithaas Café home" className="shrink-0">
          <Logo tone={light ? 'light' : 'dark'} />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <SectionLink key={link.id} id={link.id} className={linkClass(link.id)} aria-current={active === link.id ? 'true' : undefined}>
              {link.label}
            </SectionLink>
          ))}
          <Link to="/admin/login" className={linkClass('admin')}>
            Admin
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <SectionLink id="reserve" className={`btn hidden sm:inline-flex ${light ? 'btn-light' : 'btn-primary'}`}>
            Reserve a Table <span className="btn-arrow" aria-hidden="true">→</span>
          </SectionLink>
          <button
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full border lg:hidden ${light ? 'border-cream/50 text-cream' : 'border-line text-ink'}`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? 'Close' : 'Menu'}</span>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              {open ? (
                <path d="M4 4 L14 14 M14 4 L4 14" stroke="currentColor" strokeWidth="1.4" />
              ) : (
                <path d="M3 5 H15 M3 9 H15 M3 13 H15" stroke="currentColor" strokeWidth="1.4" />
              )}
            </svg>
          </button>
        </div>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </motion.header>
  );
}
