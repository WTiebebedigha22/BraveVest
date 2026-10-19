import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import KycShell from '@/components/kyc/KycShell';
import { useKyc } from '@/hooks/useKyc';

export default function KycStep5Review() {
  const nav = useNavigate();
  const { profile, documents, submit, loading } = useKyc();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (profile?.status === 'UNDER_REVIEW') nav('/kyc/review');
  }, [profile, nav]);

  async function onSubmit() {
    if (!accepted) { setError('Accept the terms to continue'); return; }
    setError(null); setBusy(true);
    try {
      await submit();
      nav('/kyc/review');
    } catch (e) {
      setError(e?.response?.data?.message ?? e.message);
    } finally { setBusy(false); }
  }

  if (loading || !profile) return <div style={{ padding: 80, textAlign: 'center' }}>Loading…</div>;

  const missingBank = !profile.bankName || !profile.accountNumber;
  const missingDocs = !documents.some((d) => d.type === 'ID_CARD' || d.type === 'PASSPORT');
  const canSubmit = !missingBank && !missingDocs;

  return (
    <KycShell step={5} title="Review & submit" subtitle="Confirm everything looks correct before submitting for review.">
      <Section title="Personal" edit={() => nav('/kyc')}>
        <Row label="Date of birth" value={fmtDate(profile.dateOfBirth)} />
        <Row label="Gender" value={profile.gender?.replace('_', ' ')} />
        <Row label="Nationality" value={profile.nationality} />
        <Row label="Occupation" value={profile.occupation} />
      </Section>

      <Section title="Identity" edit={() => nav('/kyc/identity')}>
        <Row label="ID type" value={profile.idType} />
        <Row label="ID number" value={mask(profile.idNumber)} />
        <Row label="Issued" value={fmtDate(profile.idIssuedDate)} />
        <Row label="Expires" value={fmtDate(profile.idExpiryDate)} />
      </Section>

      <Section title="Address" edit={() => nav('/kyc/address')}>
        <Row label="Address" value={[profile.addressLine1, profile.addressLine2].filter(Boolean).join(', ')} />
        <Row label="City / State" value={[profile.city, profile.state].filter(Boolean).join(', ')} />
        <Row label="Country" value={profile.country} />
      </Section>

      <Section title="Bank" edit={() => nav('/kyc/bank')}>
        <Row label="Bank" value={profile.bankName} />
        <Row label="Account" value={profile.accountNumber} />
        <Row label="Name" value={profile.accountName} />
      </Section>

      <Section title="Documents">
        {documents.length === 0 ? (
          <div style={{ color: '#888', fontSize: 13 }}>No documents uploaded yet.</div>
        ) : (
          documents.map((d) => (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
              <span style={{ color: '#555' }}>{d.type?.replace('_', ' ')}</span>
              <a href={d.fileUrl} target="_blank" rel="noreferrer" style={{ color: '#1b5e20', fontWeight: 600 }}>View</a>
            </div>
          ))
        )}
      </Section>

      {(missingBank || missingDocs) && (
        <div style={{ padding: 14, background: '#fff8e1', border: '1px solid #ffe082', borderRadius: 10, marginTop: 16, fontSize: 13, color: '#8d6e00' }}>
          Missing information: {missingBank && 'bank details'}{missingBank && missingDocs && ', '}{missingDocs && 'ID document'}. Go back and complete these sections.
        </div>
      )}

      <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginTop: 24, fontSize: 13, color: '#666', cursor: 'pointer' }}>
        <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} style={{ marginTop: 3 }} />
        <span>I confirm the information above is accurate and agree to BraveVest's Terms and Privacy Policy. I understand that falsified information may result in account termination.</span>
      </label>

      {error && <div style={{ color: '#C0363A', fontSize: 13, marginTop: 12 }}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button className="btn" onClick={() => nav('/kyc/bank')}>← Back</button>
        <button className="btn btn-primary" disabled={busy || !canSubmit || !accepted} onClick={onSubmit}>
          {busy ? 'Submitting…' : 'Submit for review'}
        </button>
      </div>
    </KycShell>
  );
}

function Section({ title, edit, children }) {
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0d0d0d' }}>{title}</div>
        {edit && <button onClick={edit} style={{ background: 'none', border: 'none', color: '#1b5e20', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>Edit</button>}
      </div>
      {children}
    </div>
  );
}
function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
      <span style={{ color: '#888' }}>{label}</span>
      <span style={{ color: '#333', fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );
}
function fmtDate(d) { return d ? new Date(d).toLocaleDateString() : '—'; }
function mask(s) { if (!s) return '—'; return s.slice(0, 3) + '••••' + s.slice(-2); }
