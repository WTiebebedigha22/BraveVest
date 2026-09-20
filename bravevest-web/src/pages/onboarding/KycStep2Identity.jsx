import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '@/components/kyc/Stepper';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import DocumentUpload from '@/components/kyc/DocumentUpload';
import { kycApi } from '@/api/kyc';
import './Kyc.css';

export default function KycStep2Identity() {
  const nav = useNavigate();
  const [form, setForm] = useState({ idType: 'NIN', idNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState([]);

  useEffect(() => { kycApi.me().then((d) => setDocs(d.documents || [])).catch(() => {}); }, []);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try { await kycApi.saveStep(2, form); nav('/kyc/address'); }
    catch (err) { setError(err?.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  }

  return (
    <div className="kyc">
      <Stepper current={2} />
      <h1 className="kyc__title">Identity verification</h1>
      <p className="kyc__sub">Provide a valid means of identification and upload a clear photo or PDF.</p>

      <form onSubmit={submit} className="kyc__form">
        <div className="kyc__field">
          <label className="kyc__label">ID type</label>
          <select className="kyc__select" value={form.idType} onChange={update('idType')}>
            <option value="NIN">NIN</option>
            <option value="BVN">BVN</option>
            <option value="PASSPORT">Passport</option>
            <option value="DRIVERS_LICENSE">Driver's License</option>
            <option value="VOTERS_CARD">Voter's Card</option>
          </select>
        </div>

        <Input label="ID number" value={form.idNumber} onChange={update('idNumber')} required />

        <div className="kyc__docs">
          <div className="kyc__docs-title">Upload documents</div>
          <DocumentUpload type="ID_CARD" label="Government-issued ID" onUploaded={(d) => setDocs((x) => [d, ...x])} />
          <DocumentUpload type="PASSPORT_PHOTO" label="Passport photo" onUploaded={(d) => setDocs((x) => [d, ...x])} />
        </div>

        {docs.length > 0 && (
          <div className="kyc__doc-list">
            <div className="kyc__docs-title">Uploaded</div>
            {docs.map((d) => (
              <div key={d.id} className="kyc__doc-row">
                <span>{d.fileName}</span>
                <span className="text-muted">{d.type}</span>
              </div>
            ))}
          </div>
        )}

        {error && <div className="auth__error">{error}</div>}
        <div className="kyc__actions"><Button type="submit" variant="primary" size="lg" disabled={loading}>{loading ? 'Saving…' : 'Continue'}</Button></div>
      </form>
    </div>
  );
}
