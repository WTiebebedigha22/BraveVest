import { useEffect, useState, useCallback } from 'react';

/**
 * Fetcher hook — runs an async function on mount and returns { data, loading, error, refetch }.
 * Usage:
 *   const { data, loading } = useFetch(() => projectsApi.list({ limit: 20 }), []);
 */
export function useFetch(fn, deps = [], { initialData = null, skip = false } = {}) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (!skip) refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch };
}
