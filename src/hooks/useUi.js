import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { scrollToId } from '../utils/scroll.js';

export function useHashScroll() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (pathname !== '/' || !hash) return undefined;
    const id = decodeURIComponent(hash.replace('#', ''));
    const timer = window.setTimeout(() => scrollToId(id), 80);
    return () => window.clearTimeout(timer);
  }, [hash, pathname]);
}

export function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}

export function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    const selector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const previous = document.activeElement;
    const items = () => [...node.querySelectorAll(selector)];
    items()[0]?.focus();

    function onKey(event) {
      if (event.key !== 'Tab') return;
      const focusable = items();
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    node.addEventListener('keydown', onKey);
    return () => {
      node.removeEventListener('keydown', onKey);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [active, ref]);
}
