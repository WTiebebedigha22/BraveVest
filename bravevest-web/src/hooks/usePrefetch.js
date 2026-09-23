import { useEffect } from 'react';

/**
 * Prefetch a URL when the browser is idle.
 * Uses the browser's requestIdleCallback — no cost if the user is busy.
 * Helps on slow connections by starting the request before it's needed.
 */
export function usePrefetch(urls = []) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1));

    const handle = idle(() => {
      urls.forEach((u) => {
        // Only prefetch if online
        if (!navigator.onLine) return;
        fetch(u, { method: 'GET', mode: 'cors' }).catch(() => {});
      });
    });

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(handle);
    };
  }, [urls.join(',')]);
}
