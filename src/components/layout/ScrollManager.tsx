import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const initialKey = useRef(key);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(hash.slice(1));
        target?.scrollIntoView({ behavior: 'instant' });
        if (target) {
          target.tabIndex = -1;
          target.focus({ preventScroll: true });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (key !== initialKey.current) {
          document
            .getElementById('main-content')
            ?.focus({ preventScroll: true });
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash, key]);
  return null;
}
