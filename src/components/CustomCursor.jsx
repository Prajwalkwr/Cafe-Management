import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { useDesktopMotion } from '../hooks/useDesktopMotion.js';

export default function CustomCursor() {
  const reduce = useReducedMotion();
  const desktop = useDesktopMotion();
  const dotRef = useRef(null);
  const ringRef = useRef(null);
    const modeRef = useRef('default');
  const shown = useRef(false);
  const [mode, setMode] = useState('default');
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!desktop || reduce) return undefined;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');
    const dot = dotRef.current;
    const ring = ringRef.current;
    let x = 0;
    let y = 0;
    let ringX = 0;
    let ringY = 0;
    let frame = 0;
    let last = 0;

    function place() {
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    }

    function paint(now) {
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      const follow = 1 - Math.exp(-dt / 70);
      ringX += (x - ringX) * follow;
      ringY += (y - ringY) * follow;
      if (Math.hypot(x - ringX, y - ringY) < 0.4) {
        ringX = x;
        ringY = y;
        place();
        frame = 0;
        last = 0;
        return;
      }
      place();
      frame = window.requestAnimationFrame(paint);
    }

    function onMove(event) {
      x = event.clientX;
      y = event.clientY;
      if (!shown.current) {
        ringX = x;
        ringY = y;
        shown.current = true;
        setActive(true);
      }
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (!frame) frame = window.requestAnimationFrame(paint);
    }

    function onOver(event) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      let next = 'default';
      if (target.closest('input, textarea, select')) next = 'text';
      else if (target.closest('[data-cursor="view"]')) next = 'view';
      else if (target.closest('[data-cursor="image"]')) next = 'image';
      else if (target.closest('[data-cursor="hover"], button, [role="button"]')) next = 'button';
      else if (target.closest('a')) next = 'link';
      if (modeRef.current !== next) {
        modeRef.current = next;
        setMode(next);
      }
    }

    function onLeave() {
      shown.current = false;
      setActive(false);
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      root.classList.remove('has-custom-cursor');
    };
  }, [desktop, reduce]);

  if (!desktop || reduce) return null;

  return (
    <div className={`pointer-events-none transition-opacity duration-200 ${active && mode !== 'text' ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
      <div ref={ringRef} className="pointer-events-none fixed top-0 left-0 z-[90]">
        <div className={`cursor-ring cursor-${mode}`}>
          <span className="cursor-label">View</span>
        </div>
      </div>
      <div ref={dotRef} className="cursor-mark pointer-events-none fixed top-0 left-0 z-[90]">
        <svg width="28" height="28" viewBox="0 0 36 36" aria-hidden="true">
          <circle cx="18" cy="18" r="16.5" fill="none" stroke="currentColor" strokeWidth="1.15" />
          <path d="M7.5 24.5 L13.5 15 L18 20.5 L23 12.5 L28.5 24.5" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M18 7.5c1.3 2.2 1.2 3.8 0 5.4-1.2-1.6-1.3-3.2 0-5.4Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
