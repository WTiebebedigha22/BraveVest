import { useEffect, useState } from 'react';

/**
 * Debounce a value by N milliseconds.
 * Useful for search inputs — reduces API calls on slow connections.
 */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
