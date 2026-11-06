import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const CSS = `
.pn { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-yellow:#F7A600; --by-amber:#C27C00; --by-red:#D6334B;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; min-height:60vh; padding:40px 20px 96px; }
.pn * { box-sizing:border-box; }
.pn-inner { max-width:720px; margin:0 auto; }
.pn-back { display:inline-flex; align-items:center; gap:6px; color:var(--by-mute); text-decoration:none; font-size:14px; font-weight:600; margin-bottom:20px; }
.pn-back:hover { color:var(--by-amber); }
.pn h1 { font-size:clamp(26px,4vw,36px); font-weight:800; letter-spacing:-0.03em; margin:0 0 24px; }

.pn-card { background:var(--by-card); border:1px solid var(--by-line); border-radius:20px; padding:28px; }
.pn-lbl { display:grid; gap:8px; font-size:13px; font-weight:600; color:var(--by-mute); margin-bottom:20px; }
.pn-in, .pn-ta { width:100%; background:#fff; border:1px solid var(--by-line); border-radius:8px; font-family:inherit; font-size:15px; color:var(--by-text); outline:none; transition:border-color .15s; }
.pn-in { height:48px; padding:0 14px; font-variant-numeric:tabular-nums; }
.pn-ta { padding:12px 14px; line-height:1.6; resize:vertical; }
.pn-in::placeholder, .pn-ta::placeholder { color:#B4B4BE; }
.pn-in:focus, .pn-ta:focus { border-color:var(--by-yellow); }
.pn-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:0 16px; }

.pn-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:50px; padding:0 28px; border:0; border-radius:8px; background:var(--by-yellow); color:#121214; font-family:inherit; font-size:15px; font-weight:600; cursor:pointer; transition:background .15s; }
.pn-btn:hover:not(:disabled) { background:#FFB82E; }
.pn-btn:disabled { opacity:.6; cursor:not-allowed; }
.pn-btn:focus-visible, .pn-in:focus-visible, .pn-ta:focus-visible, .pn-back:focus-visible { outline:2px solid #121214; outline-offset:2px; }
.pn-err { display:flex; gap:8px; align-items:flex-start; padding:12px; background:rgba(214,51,75,.08); border:1px solid rgba(214,51,75,.2); border-radius:8px; color:var(--by-red); font-size:13px; line-height:1.5; margin-bottom:20px; }
.pn-err svg { flex:none; margin-top:1px; }
.pn-spin { animation:pn-spin 1s linear infinite; }
@keyframes pn-spin { to { transform:rotate(360deg); } }
@media (prefers-reduced-motion:reduce) { .pn-spin { animation:none; } }
@media (max-width:560px) { .pn-card { padding:20px; } .pn-grid { grid-template-columns:1fr; } .pn-btn { width:100%; } }
`;

export default function ProjectNew() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', sector: '', target: '', minInvestment: '', annualRate: '', tenor: '', description: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Project name is required.');
    if (!form.target || Number(form.target) <= 0) return setError('Target amount is required.');
    if (!form.annualRate || Number(form.annualRate) <= 0) return setError('Annual rate is required.');

    setSaving(true);
    try {
      // apiFetch throws on non-2xx, so no manual res.ok check is needed.
      await apiFetch('/admin/projects', {
        method: 'POST',
        body: {
          name: form.name.trim(),
          sector: form.sector.trim(),
          target: Number(form.target),
          minInvestment: Number(form.minInvestment) || 0,
          annualRate: Number(form.annualRate),
          tenor: Number(form.tenor) || 12,
          description: form.description.trim(),
        },
      });
      navigate('/admin/projects', { replace: true });
    } catch (e) {
      setError(e?.message || 'Could not create project.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <PortalLayout theme='light'>
      <style>{CSS}</style>
      <div className='pn'>
        <div className='pn-inner'>
          <Link to='/admin/projects' className='pn-back'><ArrowLeft size={14} /> Back to projects</Link>
          <h1>New Project</h1>

          <form onSubmit={submit} className='pn-card'>
            {error && <div role='alert' className='pn-err'><AlertCircle size={16} /> {error}</div>}

            <label className='pn-lbl'>Project name
              <input className='pn-in' type='text' value={form.name} onChange={set('name')} required />
            </label>
            <label className='pn-lbl'>Sector
              <input className='pn-in' type='text' value={form.sector} onChange={set('sector')} placeholder='e.g. Real Estate' />
            </label>

            <div className='pn-grid'>
              <label className='pn-lbl'>Target (₦)
                <input className='pn-in' type='number' inputMode='numeric' min='0' value={form.target} onChange={set('target')} required />
              </label>
              <label className='pn-lbl'>Min investment (₦)
                <input className='pn-in' type='number' inputMode='numeric' min='0' value={form.minInvestment} onChange={set('minInvestment')} />
              </label>
              <label className='pn-lbl'>Annual rate (%)
                <input className='pn-in' type='number' inputMode='decimal' min='0' step='0.1' value={form.annualRate} onChange={set('annualRate')} required />
              </label>
              <label className='pn-lbl'>Tenor (months)
                <input className='pn-in' type='number' inputMode='numeric' min='1' value={form.tenor} onChange={set('tenor')} />
              </label>
            </div>

            <label className='pn-lbl'>Description
              <textarea className='pn-ta' value={form.description} onChange={set('description')} rows={5} />
            </label>

            <button type='submit' disabled={saving} className='pn-btn'>
              {saving && <Loader2 size={16} className='pn-spin' />}
              {saving ? 'Creating…' : 'Create project'}
            </button>
          </form>
        </div>
      </div>
    </PortalLayout>
  );
}