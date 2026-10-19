import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KycShell from '@/components/kyc/KycShell';
import { useKyc } from '@/hooks/useKyc';

const GENDERS = ['male', 'female', 'other', 'prefer_not_to_say'];

export default function KycStep1Personal() {
  const nav = useNavigate();
  const { profile, saveStep } = useKyc();
  const [form, setForm] = useState({ dateOfBirth: '', gender: '', nationality: 'NG', occupation: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) setForm({
      dateOfBirth: profile.dateOfBirth?.slice(0, 10) ?? '',
      gender: profile.gender ?? '',
      nationality: profile.nationality ?? 'NG',
      occupation: profile.occupation ?? '',
    });
  }, [profile]);

  function upd(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function next() {
    if (!form.dateOfBirth || !form.gender) { setError('Date of birth and gender are required'); return; }
    setError(null); setBusy(true);
    try {
      await saveStep(1, form);
      nav('/kyc/identity');
    } catch (e) {
      setError(e?.response?.data?.message ?? e.message);
    } finally { setBusy(false); }
  }

  return (
    <KycShell step={1} title="Personal details" subtitle="Tell us a bit about yourself.">
      <div style={{ display: 'grid', gap: 16 }}>
        <Field label="Date of birth" required>
          <input type="date" value={form.dateOfBirth} onChange={(e) => upd('dateOfBirth', e.target.value)} style={input} />
        </Field>
        <Field label="Gender" required>
          <select value={form.gender} onChange={(e) => upd('gender', e.target.value)} style={input}>
            <option value="">Select</option>
            {GENDERS.map((g) => <option key={g} value={g}>{g.replace('_', ' ')}</option>)}
          </select>
        </Field>
        <Field label="Nationality">
          <select value={form.nationality} onChange={(e) => upd('nationality', e.target.value)} style={input}>
            <option value="NG">Nigeria</option>
            <option value="KE">Kenya</option>
            <option value="GH">Ghana</option>
            <option value="ZA">South Africa</option>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
          </select>
        </Field>
        <Field label="Occupation">
          <input value={form.occupation} onChange={(e) => upd('occupation', e.target.value)} placeholder="e.g. Software engineer" style={input} />
        </Field>
      </div>

      {error && <div style={{ color: '#C0363A', fontSize: 13, marginTop: 12 }}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
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
