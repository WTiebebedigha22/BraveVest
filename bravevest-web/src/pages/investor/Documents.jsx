import { useEffect, useRef, useState } from 'react';
import { Upload, FileText, Download, Trash2 } from 'lucide-react';
import { documentsApi } from '@/api/documents';

export default function Documents() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef();

  function load() {
    setLoading(true);
    documentsApi.list().then(r => setItems(Array.isArray(r) ? r : [])).catch(() => setItems([])).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setError('File too large (max 10MB)'); return; }
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'OTHER');
      await documentsApi.upload(fd);
      load();
    } catch (e) {
      setError(e?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  async function remove(id) {
    if (!confirm('Delete this document?')) return;
    try { await documentsApi.delete(id); load(); }
    catch { alert('Delete failed'); }
  }

  return (
    <div style={{ padding: '32px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>Documents</h1>
            <p style={{ color: 'var(--bybit-text-muted)', margin: '4px 0 0', fontSize: '13px' }}>Your legal and investment paperwork</p>
          </div>
          <div>
            <input type="file" ref={fileRef} onChange={onFile} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn btn--primary">
              <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload Document'}
            </button>
          </div>
        </div>

        {error && <div style={{ padding: '10px', background: 'rgba(246,70,93,0.1)', color: 'var(--bybit-red)', fontSize: '13px', borderRadius: '6px', marginBottom: '16px' }}>{error}</div>}

        {loading ? <div style={{ padding: '48px', textAlign: 'center', color: 'var(--bybit-text-muted)' }}>Loading…</div> : items.length === 0 ? (
          <div className="card" style={{ padding: '64px 24px', textAlign: 'center' }}>
            <FileText size={32} color="var(--bybit-text-dim)" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--bybit-text-muted)', marginBottom: '16px' }}>No documents yet.</p>
            <button onClick={() => fileRef.current?.click()} className="btn btn--outline btn--sm">Upload your first document</button>
          </div>
        ) : (
          <div style={{ border: '1px solid var(--bybit-border)', borderRadius: '8px', overflow: 'hidden' }}>
            <table className="fin-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Uploaded</th>
                  <th style={{ textAlign: 'right' }}>Size</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map(doc => (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={16} color="var(--bybit-text-muted)" />
                        <span style={{ fontWeight: '600' }}>{doc.fileName || doc.name || 'Document'}</span>
                      </div>
                    </td>
                    <td><span className="pill">{doc.type || 'OTHER'}</span></td>
                    <td style={{ color: 'var(--bybit-text-muted)' }}>{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td className="num" style={{ color: 'var(--bybit-text-muted)' }}>
                      {doc.fileSize ? Math.round(doc.fileSize / 1024) + ' KB' : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        {doc.fileUrl && (
                          <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="btn btn--ghost btn--sm">
                            <Download size={12} />
                          </a>
                        )}
                        <button onClick={() => remove(doc.id)} className="btn btn--ghost btn--sm" style={{ color: 'var(--bybit-red)' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
