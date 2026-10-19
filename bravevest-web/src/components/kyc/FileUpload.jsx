import { useRef, useState } from 'react';
import { kycApi } from '@/api/kyc';

export default function FileUpload({ type, label, onUploaded, existingUrl }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState(existingUrl || null);
  const [error, setError] = useState(null);

  async function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { setError('Max 20 MB'); return; }
    if (!/pdf|jpe?g|png/i.test(file.type) && !/\.(pdf|jpe?g|png)$/i.test(file.name)) {
      setError('PDF, JPG, or PNG only'); return;
    }
    setError(null); setBusy(true);
    try {
      const doc = await kycApi.upload(file, type);
      setUrl(doc.fileUrl ?? doc.url);
      onUploaded?.(doc);
    } catch (e2) {
      setError(e2?.response?.data?.message ?? e2.message ?? 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6 }}>{label}</label>
      <div
        onClick={() => !busy && ref.current?.click()}
        style={{
          border: '1.5px dashed #d0d0d0',
          borderRadius: 12,
          padding: '20px 16px',
          textAlign: 'center',
          cursor: busy ? 'wait' : 'pointer',
          background: url ? '#f0f7f0' : '#fafafa',
          transition: 'background 0.15s',
        }}
      >
        {busy ? (
          <div style={{ color: '#666', fontSize: 13 }}>Uploading…</div>
        ) : url ? (
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1b5e20' }}>✓ Uploaded</div>
            <a href={url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#1b5e20' }}>View file</a>
          </div>
        ) : (
          <div style={{ color: '#888', fontSize: 13 }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>↑</div>
            Click to upload PDF, JPG, or PNG
            <div style={{ fontSize: 11, marginTop: 4 }}>Max 20 MB</div>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} onChange={onFile} />
      {error && <div style={{ color: '#C0363A', fontSize: 12, marginTop: 4 }}>{error}</div>}
    </div>
  );
}
