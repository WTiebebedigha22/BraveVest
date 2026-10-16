import { useCallback, useEffect, useState } from 'react';
import { api, endpoints } from './client';

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
    setLoading(true); setError(null);
    fn().then((res) => { if (alive) setData(res); })
       .catch((e) => { if (alive) setError(e instanceof Error ? e : new Error(String(e))); })
       .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);
  return { data, loading, error, refetch };
}

// ---------- types ----------
export type Project = { id: string; slug: string; title: string; summary?: string; description?: string; category?: string; targetReturn?: number | string; targetAmount?: number; raisedAmount?: number; minimumAmount?: number; durationMonths?: number; status?: string };

export type FundingRequest = {
  id: string;
  reference: string;
  title: string;
  summary?: string | null;
  description?: string | null;
  category?: string;
  currency?: string;
  amountRequested: number | string;
  amountFunded: number | string;
  minCommitment?: number | string | null;
  maxCommitment?: number | string | null;
  proposedReturnPct?: number | string | null;
  durationMonths?: number | null;
  repaymentFrequency?: string | null;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'FUNDED' | 'CANCELLED' | 'REJECTED' | 'DEFAULTED' | 'CLOSED';
  borrower?: { id: string; firstName?: string; lastName?: string };
  documents?: any[];
  createdAt?: string;
  publishedAt?: string | null;
  fundingDeadline?: string | null;
};

export type Commitment = {
  id: string;
  reference: string;
  amount: number | string;
  currency?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';
  request?: {
    id: string;
    reference: string;
    title: string;
    status: string;
    amountRequested: number | string;
    amountFunded: number | string;
    currency?: string;
    proposedReturnPct?: number | string | null;
    durationMonths?: number | null;
    fundingDeadline?: string | null;
  };
  createdAt?: string;
};

export type PortfolioItem = { id: string; projectId?: string; projectTitle?: string; projectSlug?: string; amount?: number; currentValue?: number; returnPct?: number; status?: string; investedAt?: string };
export type PortfolioSummary = { totalInvested: number; currentValue: number; totalReturns: number; itemCount: number; items: PortfolioItem[] };
export type SeriesPoint = { date: string; value: number };
export type Me = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
  role?: string;
  kycStatus?: string;
  phone?: string;
  currency?: string;
  theme?: 'system' | 'light' | 'dark';
  createdAt?: string;
};
export type Goal = { id: string; title: string; targetAmount: number; currentAmount: number; deadline?: string; status?: string };

// ---------- role helper ----------
export function getRoles(user: Me | null | undefined): string[] {
  if (!user) return [];
  if (Array.isArray(user.roles) && user.roles.length) return user.roles;
  if (user.role) return [user.role];
  return [];
}
export function hasRole(user: Me | null | undefined, ...roles: string[]): boolean {
  const owned = getRoles(user);
  return roles.some((r) => owned.includes(r));
}

// ---------- projects ----------
export function useProjects() {
  return useApi<Project[]>(async () => {
    const { data } = await api.get(endpoints.projects.list);
    return Array.isArray(data) ? data : data?.projects ?? data?.items ?? [];
  });
}
export function useProject(slug: string) {
  return useApi<Project | null>(async () => {
    const { data } = await api.get(endpoints.projects.detail(slug));
    return data?.project ?? data ?? null;
  }, [slug]);
}

// ---------- portfolio ----------
export function usePortfolio() {
  return useApi<PortfolioSummary>(async () => {
    const { data } = await api.get(endpoints.investments.portfolio);
    const items: PortfolioItem[] = data?.items ?? data?.investments ?? (Array.isArray(data) ? data : []);
    return {
      totalInvested: data?.totalInvested ?? items.reduce((s, i) => s + Number(i.amount ?? 0), 0),
      currentValue: data?.currentValue ?? items.reduce((s, i) => s + Number(i.currentValue ?? i.amount ?? 0), 0),
      totalReturns: data?.totalReturns ?? 0,
      itemCount: data?.itemCount ?? items.length,
      items,
    };
  });
}
export function usePortfolioSeries() {
  return useApi<SeriesPoint[]>(async () => {
    const { data } = await api.get(endpoints.investments.series);
    const raw = Array.isArray(data) ? data : data?.series ?? data?.points ?? [];
    return raw.map((p: any) => ({ date: String(p.date ?? p.t ?? ''), value: Number(p.value ?? p.v ?? 0) }));
  });
}

// ---------- me ----------
export function useMe() {
  return useApi<Me | null>(async () => {
    const { data } = await api.get(endpoints.users.me);
    return data?.user ?? data ?? null;
  });
}

// ---------- funding ----------
export function useFundingList(params: { category?: string; q?: string } = {}) {
  return useApi<FundingRequest[]>(async () => {
    const { data } = await api.get(endpoints.funding.list, { params });
    const items = data?.data?.items ?? data?.items ?? (Array.isArray(data) ? data : []);
    return items;
  }, [params.category, params.q]);
}
export function useFundingRequest(id: string) {
  return useApi<FundingRequest | null>(async () => {
    const { data } = await api.get(endpoints.funding.detail(id));
    return data?.data ?? data ?? null;
  }, [id]);
}
export function useMyFunding() {
  return useApi<FundingRequest[]>(async () => {
    const { data } = await api.get(endpoints.funding.mine);
    const items = data?.data ?? data ?? [];
    return Array.isArray(items) ? items : [];
  });
}

// ---------- commitments ----------
export function useMyCommitments() {
  return useApi<Commitment[]>(async () => {
    const { data } = await api.get(endpoints.commitments.mine);
    const items = data?.data ?? data ?? [];
    return Array.isArray(items) ? items : [];
  });
}
export function useRequestCommitments(requestId: string) {
  return useApi<Commitment[]>(async () => {
    const { data } = await api.get(endpoints.commitments.forRequest(requestId));
    const items = data?.data ?? data ?? [];
    return Array.isArray(items) ? items : [];
  }, [requestId]);
}

// ---------- goals (legacy) ----------
export function useGoals() {
  return useApi<Goal[]>(async () => {
    const { data } = await api.get(endpoints.goals.list);
    return Array.isArray(data) ? data : data?.goals ?? data?.items ?? [];
  });
}
