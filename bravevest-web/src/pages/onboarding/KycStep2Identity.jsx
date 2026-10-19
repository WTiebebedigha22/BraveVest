import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KycShell from '@/components/kyc/KycShell';
import FileUpload from '@/components/kyc/FileUpload';
import { useKyc } from '@/hooks/useKyc';

const ID_TYPES = [
  { v: 'NIN', label: 'NIN (National Identity Number)' },
  { v: 'BVN', label: 'BVN (Bank Verification Number)' },
  { v: 'PASSPORT', label: 'International passport' },
  { v: 'DRIVERS_LICENSE', label: "Driver's license" },
  { v: 'VOTERS_CARD', label: "Voter's card" },
];

export default function KycStep2Identity() {
  const nav = useNavigate();
  const { profile, documents, saveStep } = useKyc();
  const [form, setForm] = useState({
    idType: '', idNumber: '', idIssuedDate: '', idExpiryDate: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) setForm({
      idType: profile.idType ?? '',
      idNumber: profile.idNumber ?? '',
      idIssuedDate: profile.idIssuedDate?.slice(0, 10) ?? '',
      idExpiryDate: profile.idExpiryDate?.slice(0, 10) ?? '',
    });
  }, [profile]);

  const existingIdDoc = documents.find((d) => d.type === 'ID_CARD' || d.type === 'PASSPORT');

  function upd(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function next() {
    if (!form.idType || !form.idNumber) { setError('Select ID type and enter the number'); return; }
    if (!existingIdDoc) { setError('Upload a scan of your ID'); return; }
    setError(null); setBusy(true);
    try {
      await saveStep(2, form);
      nav('/kyc/address');
    } catch (e) {
      setError(e?.response?.data?.message ?? e.message);
    } finally { setBusy(false); }
  }

  return (
    <KycShell step={2} title="Identity verification" subtitle="Confirm who you are. Details are encrypted and only used for verification.">
      <div style={{ display: 'grid', gap: 16 }}>
        <Field label="ID type" required>
          <select value={form.idType} onChange={(e) => upd('idType', e.target.value)} style={input}>
            <option value="">Select ID type</option>
            {ID_TYPES.map((t) => <option key={t.v} value={t.v}>{t.label}</option>)}
          </select>
        </Field>
        <Field label="ID number" required>
          <input value={form.idNumber} onChange={(e) => upd('idNumber', e.target.value)} placeholder="Enter the number exactly" style={input} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Issue date">
            <input type="date" value={form.idIssuedDate} onChange={(e) => upd('idIssuedDate', e.target.value)} style={input} />
          </Field>
          <Field label="Expiry date">
            <input type="date" value={form.idExpiryDate} onChange={(e) => upd('idExpiryDate', e.target.value)} style={input} />
          </Field>
        </div>

        <div style={{ marginTop: 8 }}>
          <FileUpload
            type="ID_CARD"
            label="Upload ID scan (PDF or image) *"
            existingUrl={existingIdDoc?.fileUrl}
          />
        </div>
      </div>

      {error && <div style={{ color: '#C0363A', fontSize: 13, marginTop: 12 }}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button className="btn" onClick={() => nav('/kyc')}>← Back</button>
        <button className="btn btn-primary" disabled={busy} onClick={next}>
          {busy ? 'Saving…' : 'Save & continue'}
        </button>
      </div>
    </KycShell>
  );
}

const input = { width: '100%', padding: '11px 14px', border: '1px solid #e3e3e3', borderRadius: 10, fontSize: 15 };

function Field({ label, required, children }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6 }}>{label}{required ? ' *' : ''}</div>
      {children}
    </label>
  );
}
