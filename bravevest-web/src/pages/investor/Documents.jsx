import { useEffect, useMemo, useState } from 'react';
import { FileText, Download, Search, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const COLORS = {
  surface: '#FFFFFF', text: '#1A1A1A', muted: '#6B7280',
  border: '#EAEAEA', accent: '#F6A500', positive: '#0ECB81', negative: '#F6465D',
};

export default function Documents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [downloading, setDownloading] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch('/users/me/documents');
        if (!cancelled) setItems(Array.isArray(data) ? data : data.documents ?? []);
      } catch (e) {
        if (!cancelled) setError(e?.message || 'Could not load documents.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((d) => (d.name || '').toLowerCase().includes(q) || (d.type || '').toLowerCase().includes(q));
  }, [items, search]);

  async function download(doc) {
    setDownloading(doc.id);
    try {
      const res = await Promise.resolve([]);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name || 'document.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e?.message || 'Download failed.');
    } finally {
      setDownloading('');
    }
  }

  if (loading) {
    return (
    <PortalLayout theme="dark">
      <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: COLORS.muted }}>
        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> Loading documents…
        <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
      </div>
    </PortalLayout>
  );
  }

  return (
    <div style={{ padding: '24px 20px', maxWidth: 900, margin: '0 auto', color: COLORS.text }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px' }}>Documents</h1>
      <p style={{ margin: '0 0 20px', color: COLORS.muted, fontSize: 14 }}>
        Your statements, certificates, and tax notes.
      </p>

      {error && (
        <div role="alert" style={{ display: 'flex', gap: 8, padding: '10px 12px', background: 'rgba(246,70,93,0.08)', border: '1px solid rgba(246,70,93,0.2)', borderRadius: 8, color: COLORS.negative, fontSize: 13, marginBottom: 16 }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 360 }}>
        <Search size={16} color={COLORS.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search documents" aria-label="Search documents"
          style={{ width: '100%', padding: '10px 12px 10px 36px', border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 14, outline: 'none', background: COLORS.surface }} />
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: COLORS.muted, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, fontSize: 14 }}>
          {search ? 'No documents match your search.' : 'No documents available yet.'}
        </div>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((doc) => (
            <li key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(246,165,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: COLORS.accent, flexShrink: 0 }}>
                <FileText size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{doc.name}</div>
                <div style={{ fontSize: 12, color: COLORS.muted }}>
                  {doc.type} · {doc.date} · {doc.size}
                </div>
              </div>
              <button type="button" onClick={() => download(doc)} disabled={downloading === doc.id}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, cursor: downloading === doc.id ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600, color: COLORS.text }}>
                {downloading === doc.id ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Downloading…</> : <><Download size={14} /> Download</>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
