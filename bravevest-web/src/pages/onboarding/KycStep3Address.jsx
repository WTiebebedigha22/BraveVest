import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KycShell from '@/components/kyc/KycShell';
import FileUpload from '@/components/kyc/FileUpload';
import { useKyc } from '@/hooks/useKyc';

export default function KycStep3Address() {
  const nav = useNavigate();
  const { profile, documents, saveStep } = useKyc();
  const [form, setForm] = useState({
    addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'NG',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) setForm({
      addressLine1: profile.addressLine1 ?? '',
      addressLine2: profile.addressLine2 ?? '',
      city: profile.city ?? '',
      state: profile.state ?? '',
      postalCode: profile.postalCode ?? '',
      country: profile.country ?? 'NG',
    });
  }, [profile]);

  const existingAddressDoc = documents.find((d) => d.type === 'PROOF_OF_ADDRESS' || d.type === 'UTILITY_BILL');

  function upd(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function next() {
    if (!form.addressLine1 || !form.city || !form.state) { setError('Address line 1, city, and state are required'); return; }
    if (!existingAddressDoc) { setError('Upload a proof of address'); return; }
    setError(null); setBusy(true);
    try {
      await saveStep(3, form);
      nav('/kyc/bank');
    } catch (e) {
      setError(e?.response?.data?.message ?? e.message);
    } finally { setBusy(false); }
  }

  return (
    <KycShell step={3} title="Address" subtitle="Where do you currently live? This must match your proof of address.">
      <div style={{ display: 'grid', gap: 16 }}>
        <Field label="Address line 1" required>
          <input value={form.addressLine1} onChange={(e) => upd('addressLine1', e.target.value)} placeholder="Street number, street name" style={input} />
        </Field>
        <Field label="Address line 2">
          <input value={form.addressLine2} onChange={(e) => upd('addressLine2', e.target.value)} placeholder="Apartment, suite, etc (optional)" style={input} />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="City" required>
            <input value={form.city} onChange={(e) => upd('city', e.target.value)} style={input} />
          </Field>
          <Field label="State" required>
            <input value={form.state} onChange={(e) => upd('state', e.target.value)} style={input} />
          </Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Postal code">
            <input value={form.postalCode} onChange={(e) => upd('postalCode', e.target.value)} style={input} />
          </Field>
          <Field label="Country">
            <select value={form.country} onChange={(e) => upd('country', e.target.value)} style={input}>
              <option value="NG">Nigeria</option>
              <option value="KE">Kenya</option>
              <option value="GH">Ghana</option>
              <option value="ZA">South Africa</option>
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
            </select>
          </Field>
        </div>

        <div style={{ marginTop: 8 }}>
          <FileUpload
            type="PROOF_OF_ADDRESS"
            label="Upload proof of address (utility bill, bank statement — last 3 months) *"
            existingUrl={existingAddressDoc?.fileUrl}
          />
        </div>
      </div>

      {error && <div style={{ color: '#C0363A', fontSize: 13, marginTop: 12 }}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button className="btn" onClick={() => nav('/kyc/identity')}>← Back</button>
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
