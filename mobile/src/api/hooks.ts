import { useCallback, useEffect, useState } from 'react';
import { api } from './client';

export function useApi<T>(fn: () => Promise<T>, deps: unknown[] = []): { data: T | null; loading: boolean; error: Error | null; refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tick, setTick] = useState(0);
  const refetch = useCallback(() => setTick((t) => t + 1), []);
  useEffect(() => {
    let alive = true;
    setLoading(true); setError(null);
    fn().then((res) => { if (alive) setData(res); })
       .catch((e) => { if (alive) setError(e instanceof Error ? e : new Error(String(e))); })
       .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);
  return { data, loading, error, refetch };
}

export type Project = { id: string; slug: string; title: string; summary?: string; description?: string; category?: string; targetReturn?: number | string; targetAmount?: number; raisedAmount?: number; minimumAmount?: number; durationMonths?: number; status?: string };
export type PortfolioItem = { id: string; projectId?: string; projectTitle?: string; projectSlug?: string; amount?: number; currentValue?: number; returnPct?: number; status?: string; investedAt?: string };
export type PortfolioSummary = { totalInvested: number; currentValue: number; totalReturns: number; itemCount: number; items: PortfolioItem[] };
export type SeriesPoint = { date: string; value: number };
export type Me = { id: string; email: string; firstName?: string; lastName?: string; role?: string; kycStatus?: string; phone?: string; currency?: string; theme?: 'system' | 'light' | 'dark'; createdAt?: string };
export type Goal = { id: string; title: string; targetAmount: number; currentAmount: number; deadline?: string; status?: string; projectId?: string; createdAt?: string };

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
export function usePortfolio() {
  return useApi<PortfolioSummary>(async () => {
    const { data } = await api.get('/api/investments/portfolio');
    const items: PortfolioItem[] = data?.items ?? data?.investments ?? (Array.isArray(data) ? data : []);
    return {
      totalInvested: data?.totalInvested ?? items.reduce((s, i) => s + (i.amount ?? 0), 0),
      currentValue: data?.currentValue ?? items.reduce((s, i) => s + (i.currentValue ?? i.amount ?? 0), 0),
      totalReturns: data?.totalReturns ?? 0,
      itemCount: data?.itemCount ?? items.length,
      items,
    };
  });
}
export function usePortfolioSeries() {
  return useApi<SeriesPoint[]>(async () => {
    const { data } = await api.get('/api/investments/portfolio/series');
    const raw = Array.isArray(data) ? data : data?.series ?? data?.points ?? [];
    return raw.map((p: any) => ({ date: String(p.date ?? p.t ?? p.x ?? ''), value: Number(p.value ?? p.v ?? p.y ?? 0) }));
  });
}
export function useMe() {
  return useApi<Me | null>(async () => {
    const { data } = await api.get('/api/users/me');
    return data?.user ?? data ?? null;
  });
}
export function useGoals() {
  return useApi<Goal[]>(async () => {
    const { data } = await api.get('/api/goals');
    return Array.isArray(data) ? data : data?.goals ?? data?.items ?? [];
  });
}
