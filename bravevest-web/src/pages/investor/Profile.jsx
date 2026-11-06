import { useEffect, useMemo, useState } from 'react';
import {
  User, Mail, Phone, MapPin, Shield, LogOut, CheckCircle, AlertCircle,
  Loader2, KeyRound, Calendar, Award, Camera,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api';
import PortalLayout from '@/components/layout/PortalLayout';

const CSS = `
.pf { --by-bg:#FFFFFF; --by-card:#F5F5F7; --by-card2:#EDEDF0; --by-line:#E4E4E9; --by-text:#121214; --by-mute:#6B6B76; --by-yellow:#F7A600; --by-amber:#C27C00; --by-green:#0E9F5B; --by-red:#D6334B; --by-warn:#B26A00;
  background:var(--by-bg); color:var(--by-text); font-family:'Inter','Helvetica Neue',Arial,sans-serif; min-height:60vh; }
.pf * { box-sizing:border-box; }
.pf-wrap { max-width:1100px; margin:0 auto; padding:0 20px; }
.pf-top { position:relative; overflow:hidden; padding:48px 0 32px; }
.pf-glow { position:absolute; inset:0; pointer-events:none; background:radial-gradient(520px 260px at 85% 0%, rgba(247,166,0,.2), transparent 70%); }
.pf-top .pf-wrap { position:relative; }
.pf h1 { font-size:clamp(30px,4.2vw,44px); font-weight:800; letter-spacing:-0.035em; margin:0; }
.pf-main { padding-bottom:96px; }
.pf-grid { display:grid; grid-template-columns:1fr; gap:20px; align-items:start; }
@media (min-width:900px) { .pf-grid { grid-template-columns:320px 1fr; } }

.pf-card { background:var(--by-card); border:1px solid var(--by-line); border-radius:20px; padding:28px; margin-bottom:20px; }
.pf-card > :last-child { margin-bottom:0; }
.pf-center { text-align:center; }
.pf-avwrap { position:relative; display:inline-block; margin-bottom:20px; }
.pf-av { width:96px; height:96px; border-radius:50%; background:var(--by-yellow); color:#121214; display:flex; align-items:center; justify-content:center; font-size:34px; font-weight:800; letter-spacing:-0.02em; }
.pf-cam { position:absolute; right:-2px; bottom:-2px; width:32px; height:32px; border-radius:50%; background:#fff; border:1px solid var(--by-line); display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--by-mute); transition:border-color .15s, color .15s; }
.pf-cam:hover { border-color:var(--by-yellow); color:var(--by-amber); }
.pf-name { font-size:20px; font-weight:800; letter-spacing:-0.02em; margin-bottom:4px; }
.pf-email { font-size:13px; color:var(--by-mute); margin-bottom:20px; display:flex; align-items:center; justify-content:center; gap:6px; word-break:break-all; }

.pf-kyc { display:flex; justify-content:space-between; align-items:center; padding:12px 14px; border-radius:10px; text-align:left; font-size:12px; font-weight:700; letter-spacing:.02em; }
.pf-kyc--ok { background:rgba(14,159,91,.1); color:var(--by-green); }
.pf-kyc--bad { background:rgba(214,51,75,.1); color:var(--by-red); }
.pf-kyc--wait { background:rgba(247,166,0,.16); color:var(--by-warn); }
.pf-meta { display:grid; gap:10px; margin-top:18px; text-align:left; font-size:13px; color:var(--by-mute); }
.pf-meta div { display:flex; align-items:center; gap:8px; }
.pf-meta .mono { font-family:ui-monospace,Menlo,monospace; font-size:12px; }

.pf-sub { font-size:14px; font-weight:700; margin:0 0 12px; }
.pf-stack { display:grid; gap:8px; }
.pf-head { display:flex; align-items:center; gap:12px; margin-bottom:22px; }
.pf-ic { width:34px; height:34px; border-radius:8px; background:rgba(247,166,0,.16); color:var(--by-amber); display:flex; align-items:center; justify-content:center; flex:none; }
.pf-head h2 { font-size:18px; font-weight:800; letter-spacing:-0.02em; margin:0; }

.pf-msg { display:flex; gap:8px; align-items:flex-start; padding:12px; border-radius:8px; font-size:13px; line-height:1.5; margin-bottom:18px; }
.pf-msg svg { flex:none; margin-top:1px; }
.pf-msg--error { background:rgba(214,51,75,.08); border:1px solid rgba(214,51,75,.2); color:var(--by-red); }
.pf-msg--success { background:rgba(14,159,91,.08); border:1px solid rgba(14,159,91,.2); color:var(--by-green); }

.pf-two { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:16px; margin-bottom:16px; }
.pf-lbl { display:grid; gap:8px; font-size:13px; font-weight:600; color:var(--by-mute); margin-bottom:16px; }
.pf-two .pf-lbl { margin-bottom:0; }
.pf-lbl > span { display:flex; align-items:center; gap:6px; }
.pf-in { width:100%; height:48px; padding:0 14px; background:#fff; border:1px solid var(--by-line); border-radius:8px; font-family:inherit; font-size:15px; color:var(--by-text); outline:none; transition:border-color .15s; }
.pf-in::placeholder { color:#B4B4BE; }
.pf-in:focus { border-color:var(--by-yellow); }
.pf-in[readonly] { background:var(--by-card2); color:var(--by-mute); cursor:not-allowed; }
.pf-lbl--last { margin-bottom:24px; }

.pf-btn { display:inline-flex; align-items:center; justify-content:center; gap:8px; height:46px; padding:0 24px; border-radius:8px; border:0; font-family:inherit; font-size:15px; font-weight:600; cursor:pointer; transition:background .15s, border-color .15s, color .15s; }
.pf-btn--y { background:var(--by-yellow); color:#121214; }
.pf-btn--y:hover:not(:disabled) { background:#FFB82E; }
.pf-btn--g { background:#fff; color:var(--by-text); border:1px solid var(--by-line); }
.pf-btn--g:hover:not(:disabled) { border-color:var(--by-yellow); color:var(--by-amber); }
.pf-btn--out { background:#fff; color:var(--by-red); border:1px solid rgba(214,51,75,.3); }
.pf-btn--out:hover { background:rgba(214,51,75,.06); border-color:var(--by-red); }
.pf-btn--full { width:100%; }
.pf-btn:disabled { opacity:.6; cursor:not-allowed; }
.pf-btn:focus-visible, .pf-in:focus-visible, .pf-cam:focus-visible { outline:2px solid #121214; outline-offset:2px; }
.pf-spin { animation:pf-spin 1s linear infinite; }
@keyframes pf-spin { to { transform:rotate(360deg); } }
@media (prefers-reduced-motion:reduce) { .pf-spin { animation:none; } }
@media (max-width:560px) { .pf-card { padding:22px; } }
`;

export default function Profile() {
  const { user, logout, refresh } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', location: '' });
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ kind: '', text: '' });
  const [pwdMsg, setPwdMsg] = useState({ kind: '', text: '' });

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      location: user.location || '',
    });
  }, [user]);

  const initials = useMemo(() => {
    const f = (form.firstName || user?.firstName || '').charAt(0).toUpperCase();
    const l = (form.lastName || user?.lastName || '').charAt(0).toUpperCase();
    return (f + l) || (user?.email || 'U').charAt(0).toUpperCase();
  }, [form.firstName, form.lastName, user]);

  const kycStatus = (user?.kycStatus || 'pending').toLowerCase();
  const kycTone =
    kycStatus === 'verified'
      ? { cls: 'ok', label: 'Verified' }
      : kycStatus === 'rejected'
      ? { cls: 'bad', label: 'Rejected' }
      : { cls: 'wait', label: 'Pending' };

  async function saveProfile(e) {
    e.preventDefault();
    setProfileMsg({ kind: '', text: '' });
    if (!form.firstName.trim() || !form.lastName.trim()) {
      return setProfileMsg({ kind: 'error', text: 'First and last name are required.' });
    }
    setSavingProfile(true);
    try {
      await apiFetch('/users/me', {
        method: 'PATCH',
        body: form,
      });
      if (refresh) await refresh();
      setProfileMsg({ kind: 'success', text: 'Profile updated.' });
    } catch (err) {
      setProfileMsg({ kind: 'error', text: err?.message || 'Could not save profile.' });
    } finally {
      setSavingProfile(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    setPwdMsg({ kind: '', text: '' });
    if (pwd.next.length < 8) return setPwdMsg({ kind: 'error', text: 'Password must be at least 8 characters.' });
    if (pwd.next !== pwd.confirm) return setPwdMsg({ kind: 'error', text: 'Passwords do not match.' });

    setSavingPwd(true);
    try {
      await apiFetch('/users/me/change-password', {
        method: 'POST',
        body: { currentPassword: pwd.current, newPassword: pwd.next },
      });
      setPwd({ current: '', next: '', confirm: '' });
      setPwdMsg({ kind: 'success', text: 'Password changed.' });
    } catch (err) {
      setPwdMsg({ kind: 'error', text: err?.message || 'Could not change password.' });
    } finally {
      setSavingPwd(false);
    }
  }

  const Msg = ({ m }) =>
    m.kind ? (
      <div className={`pf-msg pf-msg--${m.kind}`} role={m.kind === 'error' ? 'alert' : 'status'}>
        {m.kind === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
        {m.text}
      </div>
    ) : null;

  return (
    <PortalLayout theme="dark">
      <style>{CSS}</style>
      <div className='pf'>
        <section className='pf-top'>
          <div className='pf-glow' aria-hidden='true' />
          <div className='pf-wrap'><h1>Account</h1></div>
        </section>

        <div className='pf-wrap pf-main'>
          <div className='pf-grid'>
            {/* LEFT — identity */}
            <aside>
              <div className='pf-card pf-center'>
                <div className='pf-avwrap'>
                  <div className='pf-av'>{initials}</div>
                  <button type='button' aria-label='Change avatar' className='pf-cam'><Camera size={14} /></button>
                </div>
                <div className='pf-name'>
                  {form.firstName || user?.firstName || 'Your name'} {form.lastName || user?.lastName}
                </div>
                <div className='pf-email'><Mail size={12} /> {user?.email || '—'}</div>

                <div className={`pf-kyc pf-kyc--${kycTone.cls}`}>
                  <span>KYC {kycTone.label}</span>
                  <Shield size={14} />
                </div>

                <div className='pf-meta'>
                  <div>
                    <Calendar size={14} />
                    <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-NG', { month: 'short', year: 'numeric' }) : '—'}</span>
                  </div>
                  <div className='mono'><Award size={14} /> UID: {(user?.id || '').slice(0, 8) || '—'}</div>
                </div>
              </div>

              <div className='pf-card'>
                <h3 className='pf-sub'>Quick actions</h3>
                <div className='pf-stack'>
                  <button type='button' onClick={() => (window.location.hash = '#/kyc')} className='pf-btn pf-btn--g pf-btn--full'>
                    <Shield size={14} /> Complete KYC
                  </button>
                  <button type='button' onClick={logout} className='pf-btn pf-btn--out pf-btn--full'>
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              </div>
            </aside>

            {/* RIGHT — forms */}
            <main>
              <form onSubmit={saveProfile} className='pf-card'>
                <div className='pf-head'>
                  <div className='pf-ic'><User size={18} /></div>
                  <h2>Personal information</h2>
                </div>

                <Msg m={profileMsg} />

                <div className='pf-two'>
                  <label className='pf-lbl'>
                    First name
                    <input className='pf-in' type='text' value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                  </label>
                  <label className='pf-lbl'>
                    Last name
                    <input className='pf-in' type='text' value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                  </label>
                </div>

                <label className='pf-lbl'>
                  <span><Phone size={12} /> Phone number</span>
                  <input className='pf-in' type='tel' value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder='+234 801 234 5678' />
                </label>

                <label className='pf-lbl'>
                  <span><MapPin size={12} /> Location</span>
                  <input className='pf-in' type='text' value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder='Lagos, Nigeria' />
                </label>

                <label className='pf-lbl pf-lbl--last'>
                  <span><Mail size={12} /> Email (read-only)</span>
                  <input className='pf-in' type='email' value={user?.email || ''} readOnly />
                </label>

                <button type='submit' disabled={savingProfile} className='pf-btn pf-btn--y'>
                  {savingProfile && <Loader2 size={16} className='pf-spin' />}
                  {savingProfile ? 'Saving…' : 'Save changes'}
                </button>
              </form>

              <form onSubmit={changePassword} className='pf-card'>
                <div className='pf-head'>
                  <div className='pf-ic'><KeyRound size={18} /></div>
                  <h2>Password &amp; security</h2>
                </div>

                <Msg m={pwdMsg} />

                <label className='pf-lbl'>
                  Current password
                  <input className='pf-in' type='password' value={pwd.current} onChange={(e) => setPwd({ ...pwd, current: e.target.value })} autoComplete='current-password' required />
                </label>

                <div className='pf-two' style={{ marginBottom: 24 }}>
                  <label className='pf-lbl'>
                    New password
                    <input className='pf-in' type='password' value={pwd.next} onChange={(e) => setPwd({ ...pwd, next: e.target.value })} autoComplete='new-password' minLength={8} required />
                  </label>
                  <label className='pf-lbl'>
                    Confirm new password
                    <input className='pf-in' type='password' value={pwd.confirm} onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })} autoComplete='new-password' minLength={8} required />
                  </label>
                </div>

                <button type='submit' disabled={savingPwd} className='pf-btn pf-btn--g'>
                  {savingPwd && <Loader2 size={16} className='pf-spin' />}
                  {savingPwd ? 'Updating…' : 'Update password'}
                </button>
              </form>
            </main>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}