import { useEffect, useRef, useState } from 'react';

const SAFETY_MS = 2500;

function nearViewport(node) {
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > -window.innerHeight * 4;
}

export function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (shown) return undefined;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting || entry.boundingClientRect.bottom < 0)) {
          setShown(true);
        }
      },
      { rootMargin: '0px 0px 40px 0px' },
    );
    observer.observe(node);

    const safety = window.setInterval(() => {
      if (nearViewport(node)) setShown(true);
    }, SAFETY_MS);

    return () => {
      observer.disconnect();
      window.clearInterval(safety);
    };
  }, [shown]);

  return [ref, shown];
}
