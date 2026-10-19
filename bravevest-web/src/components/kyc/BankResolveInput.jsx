import { useEffect, useState } from 'react';
import { payApi } from '@/api/kyc';
import { NIGERIAN_BANKS } from '@/constants/nigerianBanks';

export default function BankResolveInput({ value, onChange }) {
  const [bankCode, setBankCode] = useState(value?.bankCode ?? '');
  const [accountNumber, setAccountNumber] = useState(value?.accountNumber ?? '');
  const [accountName, setAccountName] = useState(value?.accountName ?? '');
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bankCode && accountNumber.length === 10) {
      setResolving(true); setError(null);
      payApi.resolveAccount(bankCode, accountNumber)
        .then((r) => {
          if (r?.accountName) {
            setAccountName(r.accountName);
            onChange?.({
              bankCode,
              bankName: NIGERIAN_BANKS.find((b) => b.code === bankCode)?.name ?? '',
              accountNumber,
              accountName: r.accountName,
            });
          }
        })
        .catch((e) => setError(e?.response?.data?.message ?? 'Could not verify — type account name manually'))
        .finally(() => setResolving(false));
    }
  }, [bankCode, accountNumber, onChange]);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6 }}>Bank</label>
        <select
          value={bankCode}
          onChange={(e) => setBankCode(e.target.value)}
          style={{ width: '100%', padding: '11px 14px', border: '1px solid #e3e3e3', borderRadius: 10, fontSize: 15 }}
        >
          <option value="">Select bank</option>
          {NIGERIAN_BANKS.map((b) => <option key={b.code} value={b.code}>{b.name}</option>)}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6 }}>Account number</label>
        <input
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
          placeholder="10-digit NUBAN"
          inputMode="numeric"
          style={{ width: '100%', padding: '11px 14px', border: '1px solid #e3e3e3', borderRadius: 10, fontSize: 15 }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 6 }}>
          Account name {resolving && <span style={{ color: '#888', fontWeight: 400 }}>· resolving…</span>}
        </label>
        <input
          value={accountName}
          onChange={(e) => {
            setAccountName(e.target.value);
            onChange?.({
              bankCode,
              bankName: NIGERIAN_BANKS.find((b) => b.code === bankCode)?.name ?? '',
              accountNumber,
              accountName: e.target.value,
            });
          }}
          placeholder="Auto-fills when bank + account are valid"
          style={{ width: '100%', padding: '11px 14px', border: '1px solid #e3e3e3', borderRadius: 10, fontSize: 15 }}
        />
      </div>

      {error && <div style={{ color: '#C0363A', fontSize: 12 }}>{error}</div>}
    </div>
  );
}
