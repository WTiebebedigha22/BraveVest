import { useEffect, useMemo, useState } from 'react';
import { FileText, Download, Search, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

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
        if (!cancelled) setItems(Array.isArray(data) ? data : (data && data.documents) || []);
      } catch (e) {
        if (!cancelled) setError(e && e.message ? e.message : 'Could not load documents.');
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
      const token = localStorage.getItem('token') || '';
      const res = await fetch('/api/users/me/documents/' + doc.id + '/download', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) throw new Error('Download failed.');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name || 'document.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e && e.message ? e.message : 'Download failed.');
    } finally {
      setDownloading('');
    }
  }

  return (
    <PortalLayout theme='dark'>
      <section style={{ padding: '32px 20px 96px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className='bv-fade-up' style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 4px', color: 'var(--text)', letterSpacing: '-0.02em' }}>
              Documents
            </h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 15 }}>
              Your statements, certificates, and tax notes.
            </p>
          </div>

          {error && (
            <div role='alert' style={{ padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: 'var(--negative)', display: 'flex', gap: 12, marginBottom: 24 }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <div className='bv-fade-up' style={{ position: 'relative', marginBottom: 24, maxWidth: 360 }}>
            <Search size={16} color='var(--text-muted)' style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input type='search' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search documents' aria-label='Search documents'
              style={{ width: '100%', padding: '11px 14px 11px 38px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text)', outline: 'none' }} />
          </div>

          {loading ? (
            <div style={{ padding: 48, display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
              <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
              Loading documents…
              <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>
            </div>
          ) : filtered.length === 0 ? (
            <div className='bv-card-lift bv-fade-up' style={{ padding: 64, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20 }}>
              <FileText size={48} color='var(--bv-accent)' style={{ margin: '0 auto 24px' }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>
                {search ? 'No documents match your search' : 'No documents yet'}
              </h3>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>
                Documents will appear here as they become available.
              </p>
            </div>
          ) : (
            <ul className='bv-fade-up' style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map((doc) => (
                <li key={doc.id} className='bv-card-lift' style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: 16,
                  background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12,
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(246,165,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bv-accent)', flexShrink: 0 }}>
                    <FileText size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, color: 'var(--text)' }}>{doc.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{doc.type} · {doc.date} · {doc.size}</div>
                  </div>
                  <button onClick={() => download(doc)} disabled={downloading === doc.id} className='bv-pill bv-pill--ghost'>
                    {downloading === doc.id ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={14} />}
                    {downloading === doc.id ? 'Downloading…' : 'Download'}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </PortalLayout>
  );
}
