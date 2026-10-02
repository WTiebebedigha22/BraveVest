import { useCallback, useEffect, useState } from 'react';
import { api } from './client';

export function useApi<T>(
  fn: () => Promise<T>,
  deps: unknown[] = []
): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tick, setTick] = useState(0);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fn()
      .then((res) => { if (alive) setData(res); })
      .catch((e) => { if (alive) setError(e instanceof Error ? e : new Error(String(e))); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);

  return { data, loading, error, refetch };
}

export type Project = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  description?: string;
  category?: string;
  targetReturn?: number | string;
  targetAmount?: number;
  raisedAmount?: number;
  minimumAmount?: number;
  durationMonths?: number;
  status?: string;
  heroImageUrl?: string;
  images?: string[];
};

export function useProjects() {
  return useApi<Project[]>(async () => {
    const { data } = await api.get('/api/projects');
    return Array.isArray(data) ? data : data?.projects ?? data?.items ?? [];
  });
}

export function useProject(slug: string) {
  return useApi<Project | null>(async () => {
    const { data } = await api.get(`/api/projects/${slug}`);
    return data?.project ?? data ?? null;
  }, [slug]);
}
