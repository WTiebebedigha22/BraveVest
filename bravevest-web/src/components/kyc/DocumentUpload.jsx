import { useState } from 'react';
import { kycApi } from '@/api/kyc';
import './DocumentUpload.css';

export default function DocumentUpload({ type, label, onUploaded }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | done | error
  const [error, setError] = useState('');

  async function upload() {
    if (!file) return;
    setStatus('uploading'); setError('');
    try {
      const doc = await kycApi.uploadDocument(file, type);
      setStatus('done');
      onUploaded?.(doc);
    } catch (err) {
      setStatus('error');
      setError(err?.response?.data?.message || 'Upload failed');
    }
  }

  return (
    <div className={`du du--${status}`}>
      <div className="du__info">
        <div className="du__label">{label}</div>
        <div className="du__hint">PDF, JPEG, or PNG · max 10MB</div>
      </div>
      <div className="du__action">
        {status === 'done' ? (
          <span className="du__done">✓ Uploaded</span>
        ) : (
          <>
            <label className="du__picker">
              <input
                type="file"
                accept=".pdf,image/jpeg,image/png"
                onChange={(e) => { setFile(e.target.files?.[0] || null); setStatus('idle'); }}
              />
              <span>{file ? file.name : 'Choose file'}</span>
            </label>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              onClick={upload}
              disabled={!file || status === 'uploading'}
            >
              {status === 'uploading' ? 'Uploading…' : 'Upload'}
            </button>
          </>
        )}
      </div>
      {error && <div className="du__error">{error}</div>}
    </div>
  );
}
