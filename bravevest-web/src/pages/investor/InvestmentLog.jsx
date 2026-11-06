import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useCurrency } from '@/context/CurrencyContext';
import PortalLayout from '@/components/layout/PortalLayout';
export default function InvestmentLog() {
  const { id } = useParams();
  const { format } = useCurrency();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const json = await apiFetch('/investments/' + id + '/log');
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e && e.message ? e.message : 'Could not load log.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);
  if (loading) return <PortalLayout theme="dark"><div style={{ padding: 96, color: 'var(--text-muted)' }}>Loading…</div></PortalLayout>;
  if (error) return <PortalLayout theme="dark"><div style={{ padding: 48, color: '#F6465D' }}>{error}</div></PortalLayout>;
  const investment = (data && data.investment) || data;
  const events = (data && (data.events || data.log)) || [];
  return (
    <PortalLayout theme="dark">
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Link to={'/investments/' + id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, marginBottom: 16 }}>
            <ArrowLeft size={14} /> Back to investment
          </Link>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 8px' }}>Investment log</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0 0 32px' }}>{(investment && (investment.projectName || investment.name)) || 'Investment'} · {format((investment && investment.amount) || 0)}</p>
          <div style={{ padding: 28, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>
            {events.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No events yet.</div>
            ) : (
              <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {events.map((e, i) => {
                  const status = (e.status || 'info').toLowerCase();
                  const Icon = status === 'completed' ? CheckCircle : status === 'failed' ? XCircle : Clock;
                  const tone = status === 'completed' ? '#0ECB81' : status === 'failed' ? '#F6465D' : '#F59E0B';
                  return (
                    <li key={e.id || i} style={{ display: 'flex', gap: 20, paddingBottom: 24 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface)', border: '2px solid ' + tone, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tone, flexShrink: 0 }}><Icon size={14} /></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{e.title || e.type}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>{e.description}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{e.date || (e.createdAt && new Date(e.createdAt).toLocaleString())}</div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}
