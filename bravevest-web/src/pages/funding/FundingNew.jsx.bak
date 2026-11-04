import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fundingApi } from '../../api/funding';

const CATEGORIES = ['REAL_ESTATE', 'AGRICULTURE', 'ENERGY', 'SME', 'INFRASTRUCTURE'];
const FREQUENCIES = ['monthly', 'quarterly', 'bullet'];

export default function FundingNew() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: '',
    summary: '',
    description: '',
    category: 'SME',
    amountRequested: '',
    minCommitment: '',
    maxCommitment: '',
    proposedReturnPct: '',
    durationMonths: '',
    repaymentFrequency: 'monthly',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  function upd(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      const payload = {
        title: form.title.trim(),
        summary: form.summary.trim() || null,
        description: form.description.trim() || null,
        category: form.category,
        amountRequested: Number(form.amountRequested),
        minCommitment: form.minCommitment ? Number(form.minCommitment) : null,
        maxCommitment: form.maxCommitment ? Number(form.maxCommitment) : null,
        proposedReturnPct: form.proposedReturnPct ? Number(form.proposedReturnPct) : null,
        durationMonths: form.durationMonths ? Number(form.durationMonths) : null,
        repaymentFrequency: form.repaymentFrequency || null,
      };
      const r = await fundingApi.create(payload);
      const created = r.data ?? r;
      nav(`/funding/mine`);
      // eslint-disable-next-line no-console
      console.log('created', created.id);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page" style={{ padding: '32px 16px', maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28 }}>New funding request</h1>
      <p style={{ color: '#666' }}>Save as draft, then submit for review. Admin approval publishes it.</p>

      <div style={{
        margin: '20px 0 24px',
        padding: '16px 18px',
        background: '#f0f7f0',
        border: '1px solid #cfe3cf',
        borderRadius: 12,
      }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>How this works</div>
        <div style={{ color: '#444', fontSize: 13, lineHeight: 1.6 }}>
          You're requesting <strong>funding</strong> from individual investors on BraveVest.
          Each commitment is a <strong>peer-to-peer loan</strong> — you'll receive the capital
          upfront and repay it over the agreed term, with the return percentage you set below.
        </div>
      </div>

      {error && <div style={{ padding: 12, background: '#ffebee', color: '#b71c1c', borderRadius: 8, margin: '16px 0' }}>{error}</div>}

      <form onSubmit={submit} style={{ display: 'grid', gap: 16, marginTop: 24 }}>
        <Field label="Title" required>
          <input required minLength={5} maxLength={120} value={form.title} onChange={(e) => upd('title', e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Summary">
          <input maxLength={280} value={form.summary} onChange={(e) => upd('summary', e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Description">
          <textarea rows={6} maxLength={8000} value={form.description} onChange={(e) => upd('description', e.target.value)} style={{ ...inputStyle, minHeight: 120, fontFamily: 'inherit' }} />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Category">
            <select value={form.category} onChange={(e) => upd('category', e.target.value)} style={inputStyle}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
            </select>
          </Field>
          <Field label="Amount requested (NGN)" required>
            <input required type="number" min="1" value={form.amountRequested} onChange={(e) => upd('amountRequested', e.target.value)} style={inputStyle} />
          </Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Minimum commitment (NGN)">
            <input type="number" min="1" value={form.minCommitment} onChange={(e) => upd('minCommitment', e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Maximum commitment (NGN)">
            <input type="number" min="1" value={form.maxCommitment} onChange={(e) => upd('maxCommitment', e.target.value)} style={inputStyle} />
          </Field>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <Field label="Return %">
            <input type="number" min="0" max="100" step="0.1" value={form.proposedReturnPct} onChange={(e) => upd('proposedReturnPct', e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Duration (months)">
            <input type="number" min="1" max="120" value={form.durationMonths} onChange={(e) => upd('durationMonths', e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Repayment">
            <select value={form.repaymentFrequency} onChange={(e) => upd('repaymentFrequency', e.target.value)} style={inputStyle}>
              {FREQUENCIES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Field>
        </div>

        <button className="btn btn-primary" type="submit" disabled={busy} style={{ marginTop: 8 }}>
          {busy ? 'Saving…' : 'Save as draft'}
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid #e3e3e3',
  borderRadius: 10,
  fontSize: 15,
  background: '#fff',
};

function Field({ label, required, children }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 12, color: '#666', marginBottom: 6, fontWeight: 500 }}>
        {label}{required ? ' *' : ''}
      </div>
      {children}
    </label>
  );
}
