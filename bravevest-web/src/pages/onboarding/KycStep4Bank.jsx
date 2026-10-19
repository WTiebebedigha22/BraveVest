import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import KycShell from '@/components/kyc/KycShell';
import BankResolveInput from '@/components/kyc/BankResolveInput';
import { useKyc } from '@/hooks/useKyc';

export default function KycStep4Bank() {
  const nav = useNavigate();
  const { profile, saveStep } = useKyc();
  const [bank, setBank] = useState({
    bankCode: '', bankName: '', accountNumber: '', accountName: '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (profile) setBank({
      bankCode: profile.bankCode ?? '',
      bankName: profile.bankName ?? '',
      accountNumber: profile.accountNumber ?? '',
      accountName: profile.accountName ?? '',
    });
  }, [profile]);

  const onChange = useCallback((v) => setBank(v), []);

  async function next() {
    if (!bank.bankName || !bank.accountNumber || !bank.accountName) { setError('Complete all bank details'); return; }
    if (bank.accountNumber.length !== 10) { setError('Account number must be 10 digits'); return; }
    setError(null); setBusy(true);
    try {
      await saveStep(4, bank);
      nav('/kyc/review');
    } catch (e) {
      setError(e?.response?.data?.message ?? e.message);
    } finally { setBusy(false); }
  }

  return (
    <KycShell step={4} title="Bank account" subtitle="Where should we send your returns? We'll verify the account name automatically.">
      <BankResolveInput value={bank} onChange={onChange} />

      {error && <div style={{ color: '#C0363A', fontSize: 13, marginTop: 12 }}>{error}</div>}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
        <button className="btn" onClick={() => nav('/kyc/address')}>← Back</button>
        <button className="btn btn-primary" disabled={busy} onClick={next}>
          {busy ? 'Saving…' : 'Save & continue'}
        </button>
      </div>
    </KycShell>
  );
}
