import { useEffect, useState } from 'react';

const QUERY = '(pointer: fine) and (min-width: 1024px)';

function matchesDesktop() {
  return window.matchMedia(QUERY).matches;
}

export function useDesktopMotion() {
  const [enabled, setEnabled] = useState(matchesDesktop);

  useEffect(() => {
    const query = window.matchMedia(QUERY);
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return enabled;
}
