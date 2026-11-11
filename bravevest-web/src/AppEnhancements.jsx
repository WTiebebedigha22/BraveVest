/* AppEnhancements.jsx
 * BraveVest — theme sync, admin gating, KYC lock, country picker,
 * notifications, floating AI chat. Import only what a page needs.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/* ============================================================
 * SECTION 1 — THEME TOKENS
 * ============================================================ */

const THEME_CSS = `
:root, [data-theme="dark"] {
  --bv-bg: #0B0E11;
  --bv-bg-elevated: #151A21;
  --bv-surface: #1E2329;
  --bv-border: #2B313A;
  --bv-border-strong: #3A414A;
  --bv-text: #F0F3F6;
  --bv-text-muted: #848E9C;
  --text-main: #F0F3F6;
  --text-primary: #F0F3F6;
  --text-secondary: #C5CBD3;
  --text-muted: #848E9C;
  --text-body: #F0F3F6;
  --text-heading: #FFFFFF;
  --text-dim: #6B7280;

  --bv-accent: #F0B90B;
  --bv-accent-hover: #FCD535;
  --bv-danger: #FF4D4F;
  --bv-success: #0ECB81;
  --bv-info: #3B82F6;
  --bv-info-text: #60A5FA;
  --bv-warning: #F59E0B;
  --bv-warning-text: #FBBF24;
}
[data-theme="light"] {
  --bv-bg: #FFFFFF;
  --bv-bg-elevated: #F7F8FA;
  --bv-surface: #F2F4F6;
  --bv-border: #D4D8DD;
  --bv-border-strong: #B9BEC5;
  --bv-text: #0B0E11;
  --bv-text-muted: #5A6169;
  --text-main: #0B0E11;
  --text-primary: #0B0E11;
  --text-secondary: #3A3F45;
  --text-muted: #5A6169;
  --text-body: #0B0E11;
  --text-heading: #000000;
  --text-dim: #6B7280;

  --bv-accent: #B07C00;
  --bv-accent-hover: #8A5F00;
  --bv-danger: #D9363E;
  --bv-success: #0A8F5C;
  --bv-info: #2563EB;
  --bv-info-text: #1E40AF;
  --bv-warning: #D97706;
  --bv-warning-text: #92400E;
}
html, body, #root {
  background: var(--bv-bg) !important;
  color: var(--bv-text) !important;
  transition: background 0.2s ease, color 0.2s ease;
}

/* ── Force light text over dark image overlays ── */
.bv-on-image,
.bv-on-image h1,
.bv-on-image h2,
.bv-on-image h3,
.bv-on-image h4,
.bv-on-image h5,
.bv-on-image h6,
.bv-on-image p,
.bv-on-image span:not([class*="btn"]):not([class*="badge"]):not([class*="pill"]):not([class*="chip"]) {
  color: #F0F3F6 !important;
}
.bv-on-image {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}
.bv-on-image .bv-on-image--muted {
  color: #C5CBD3 !important;
}
.bv-on-image .bv-on-image--accent {
  color: #F0B90B !important;
}
/* Buttons, badges, pills, chips on heroes keep their own styling */
.bv-on-image .bv-btn,
.bv-on-image .bv-btn *,
.bv-on-image [class*="badge"],
.bv-on-image [class*="badge"] *,
.bv-on-image [class*="pill"],
.bv-on-image [class*="pill"] *,
.bv-on-image [class*="chip"],
.bv-on-image [class*="chip"] * {
  text-shadow: none;
}

/* ── Always-dark containers (navbar, footer) ── */
.bv-always-dark {
  --bv-bg: #0B0E11;
  --bv-bg-elevated: #151A21;
  --bv-surface: #1E2329;
  --bv-border: #2B313A;
  --bv-border-strong: #3A414A;
  --bv-text: #F0F3F6;
  --bv-text-muted: #848E9C;
  --bv-accent: #F0B90B;
  --bv-accent-hover: #FCD535;
  color-scheme: dark;
  background-color: #0B0E11 !important;
  color: #F0F3F6 !important;
}
.bv-always-dark h1, .bv-always-dark h2, .bv-always-dark h3,
.bv-always-dark p, .bv-always-dark a,
.bv-always-dark span:not([class*="btn"]) {
  color: #F0F3F6;
}
.bv-always-dark.bv-footer,
.bv-always-dark .bv-footer__inner {
  background-color: #0B0E11 !important;
  color: #F0F3F6 !important;
}

/* ── Elite banner: permanently dark regardless of theme ── */
.elite-banner {
  --bv-bg: #0B0E11;
  --bv-bg-elevated: #151A21;
  --bv-surface: #1E2329;
  --bv-border: #2B313A;
  --bv-border-strong: #3A414A;
  --bv-text: #F0F3F6;
  --bv-text-muted: #848E9C;
  --bv-accent: #F0B90B;
  --bv-accent-hover: #FCD535;
  --text-main: #F0F3F6;
  --text-primary: #F0F3F6;
  --text-secondary: #C5CBD3;
  --text-muted: #848E9C;
  --text-body: #F0F3F6;
  --text-heading: #FFFFFF;
  color-scheme: dark;
  background-color: #0B0E11 !important;
  color: #F0F3F6 !important;
}
.elite-banner h1,
.elite-banner h2,
.elite-banner h3,
.elite-banner h4,
.elite-banner h5,
.elite-banner h6,
.elite-banner p,
.elite-banner .elite-banner-title,
.elite-banner .elite-banner-sub {
  color: #F0F3F6 !important;
}
.elite-banner .elite-banner-kicker,
.elite-banner .elite-hero-kicker {
  color: #F0B90B !important;
}
.elite-banner .elite-banner-muted,
.elite-banner .elite-hero-sub {
  color: #C5CBD3 !important;
}
.elite-banner h1,
.elite-banner h2 {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
}
.elite-banner p {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}
.elite-banner .bv-btn,
.elite-banner .bv-btn *,
.elite-banner button {
  text-shadow: none;
}

/* ── Hero overlay ── */
.bv-hero,
.bv-hero h1,
.bv-hero h2,
.bv-hero h3,
.bv-hero h4,
.bv-hero p,
.bv-hero .elite-hero-title,
.bv-hero .elite-hero-sub,
.bv-hero .elite-banner h1,
.bv-hero .elite-banner p {
  color: #F0F3F6 !important;
}
.bv-hero .bv-hero-muted,
.bv-hero .elite-hero-sub {
  color: #C5CBD3 !important;
}
.bv-hero .bv-hero-accent,
.bv-hero .elite-hero-kicker {
  color: #F0B90B !important;
}
.bv-hero h1,
.bv-hero h2,
.bv-hero h3 {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.45);
}
.bv-hero p {
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}

/* ════════════════════════════════════════════════════════════
   BUTTON SYSTEM — .bv-pill, .btn, page-specific
   ════════════════════════════════════════════════════════════ */

.bv-pill,
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-family: inherit;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  border: none;
  text-decoration: none;
  white-space: nowrap;
}
.bv-pill:disabled,
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Primary */
.bv-pill--primary,
.btn-primary,
.btn--primary {
  background: var(--bv-accent);
  color: #000;
}
.bv-pill--primary:hover:not(:disabled),
.btn-primary:hover:not(:disabled),
.btn--primary:hover:not(:disabled) {
  background: var(--bv-accent-hover);
}

/* Ghost / secondary */
.bv-pill--ghost,
.btn-ghost,
.btn--ghost,
.btn-secondary,
.btn--secondary {
  background: transparent;
  color: var(--bv-text);
  border: 1px solid var(--bv-border);
}
.bv-pill--ghost:hover:not(:disabled),
.btn-ghost:hover:not(:disabled),
.btn--ghost:hover:not(:disabled),
.btn-secondary:hover:not(:disabled),
.btn--secondary:hover:not(:disabled) {
  background: var(--bv-surface);
  border-color: var(--bv-border-strong);
}

/* Danger */
.bv-pill--danger,
.btn-danger {
  background: var(--bv-danger);
  color: #fff;
}
.bv-pill--danger:hover:not(:disabled),
.btn-danger:hover:not(:disabled) {
  background: color-mix(in srgb, var(--bv-danger) 85%, black);
}

/* Sizes */
.btn--sm,
.bv-pill--sm {
  padding: 6px 14px;
  font-size: 13px;
}

/* ════════════════════════════════════════════════════════════
   PAGE-SPECIFIC BUTTONS
   ════════════════════════════════════════════════════════════ */

/* Profile */
.pf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 46px;
  padding: 0 24px;
  border-radius: 8px;
  border: 0;
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.pf-btn--y {
  background: var(--bv-accent);
  color: #000;
}
.pf-btn--y:hover:not(:disabled) { background: var(--bv-accent-hover); }
.pf-btn--g {
  background: var(--bv-bg-elevated);
  color: var(--bv-text);
  border: 1px solid var(--bv-border);
}
.pf-btn--g:hover:not(:disabled) {
  border-color: var(--bv-accent);
  color: var(--bv-accent);
}
.pf-btn--out {
  background: var(--bv-bg-elevated);
  color: var(--bv-danger);
  border: 1px solid color-mix(in srgb, var(--bv-danger) 30%, transparent);
}
.pf-btn--out:hover:not(:disabled) {
  background: color-mix(in srgb, var(--bv-danger) 8%, transparent);
  border-color: var(--bv-danger);
}
.pf-btn--full { width: 100%; }
.pf-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* Deposit */
.dp-chip {
  padding: 8px 16px;
  background: var(--bv-surface);
  color: var(--bv-text);
  border: 1px solid var(--bv-border);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}
.dp-chip:hover {
  border-color: var(--bv-accent);
  color: var(--bv-accent);
}
.dp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 20px;
  background: var(--bv-accent);
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.dp-btn:hover:not(:disabled) { background: var(--bv-accent-hover); }
.dp-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* Transfer */
.tf-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--bv-accent);
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.tf-btn:hover:not(:disabled) { background: var(--bv-accent-hover); }
.tf-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* Withdraw */
.wd-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--bv-accent);
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.wd-btn:hover:not(:disabled) { background: var(--bv-accent-hover); }
.wd-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* KYC detail */
.kd-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--bv-border);
  background: var(--bv-bg-elevated);
  color: var(--bv-text);
  transition: all 0.15s;
}
.kd-btn:hover:not(:disabled) {
  border-color: var(--bv-accent);
  color: var(--bv-accent);
}
.kd-btn--ok {
  background: var(--bv-success);
  color: #fff;
  border-color: var(--bv-success);
}
.kd-btn--ok:hover:not(:disabled) {
  background: color-mix(in srgb, var(--bv-success) 85%, black);
  border-color: color-mix(in srgb, var(--bv-success) 85%, black);
  color: #fff;
}
.kd-btn--no {
  background: var(--bv-danger);
  color: #fff;
  border-color: var(--bv-danger);
}
.kd-btn--no:hover:not(:disabled) {
  background: color-mix(in srgb, var(--bv-danger) 85%, black);
  border-color: color-mix(in srgb, var(--bv-danger) 85%, black);
  color: #fff;
}
.kd-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  color: var(--bv-text-muted);
  border: none;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.15s;
}
.kd-back:hover { color: var(--bv-text); }

/* Project new */
.pn-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: var(--bv-accent);
  color: #000;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.pn-btn:hover:not(:disabled) { background: var(--bv-accent-hover); }
.pn-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.pn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: transparent;
  color: var(--bv-text-muted);
  border: none;
  font-size: 13px;
  cursor: pointer;
  transition: color 0.15s;
}
.pn-back:hover { color: var(--bv-text); }

/* Card lift effect */
.bv-card-lift {
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.bv-card-lift:hover {
  transform: translateY(-2px);
  border-color: var(--bv-border-strong);
  box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.2);
}
`;

export function ThemeStyles() {
  return <style dangerouslySetInnerHTML={{ __html: THEME_CSS }} />;
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  const t =
    theme ||
    localStorage.getItem('bv-theme') ||
    (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', t);
}

/* ============================================================
 * SECTION 2 — ADMIN GATING
 * ============================================================ */

export function useIsAdmin() {
  const { user } = useAuth();
  return !!user?.roles?.some((r) => r === 'ADMIN' || r === 'SUPER_ADMIN');
}

export function AdminRoute({ children, fallback = '/dashboard' }) {
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin();
  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to={fallback} replace />;
  return children;
}

export function useIsSuperAdmin() {
  const { user } = useAuth();
  return !!user?.roles?.includes('SUPER_ADMIN');
}

export function SuperAdminRoute({ children, fallback = '/admin' }) {
  const { user, loading } = useAuth();
  const isSuper = useIsSuperAdmin();
  if (loading) return null;
  if (!user || !isSuper) return <Navigate to={fallback} replace />;
  return children;
}

/* ============================================================
 * SECTION 3 — KYC LOCK + SESSION MANAGEMENT
 * ============================================================ */

const KycLockContext = createContext({ locked: false, kycStatus: null });

export function KycLockProvider({ children }) {
  const { user } = useAuth();
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    if (!user) {
      setKycStatus(null);
      return;
    }
    if (user.kyc?.status) {
      setKycStatus(user.kyc.status);
      return;
    }
    fetch('/api/kyc/me', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((r) => r.json())
      .then((d) => setKycStatus(d?.data?.status || null))
      .catch(() => {});
  }, [user]);

  const locked = kycStatus === 'APPROVED';
  const value = useMemo(() => ({ locked, kycStatus }), [locked, kycStatus]);
  return <KycLockContext.Provider value={value}>{children}</KycLockContext.Provider>;
}

export function useKycLock() {
  return useContext(KycLockContext);
}

export function LockedField({ children, hint = 'Contact support to change this field.' }) {
  const { locked } = useKycLock();
  if (!locked) return children;
  return (
    <div
      style={{
        position: 'relative',
        opacity: 0.6,
        filter: 'grayscale(0.15)',
      }}
    >
      <div style={{ pointerEvents: 'none' }}>{children}</div>
      <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', marginTop: 4 }}>
        🔒 {hint}
      </div>
    </div>
  );
}

export function ChangePasswordForm() {
  const [oldPassword, setOld] = useState('');
  const [newPassword, setNew] = useState('');
  const [status, setStatus] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setStatus('saving');
    try {
      const r = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          refreshToken: localStorage.getItem('refreshToken') || null,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || 'Failed');
      setStatus('ok');
      setOld('');
      setNew('');
    } catch (err) {
      setStatus(err.message);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <input
        type="password"
        placeholder="Current password"
        value={oldPassword}
        onChange={(e) => setOld(e.target.value)}
        required
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="New password (min 8 chars)"
        value={newPassword}
        onChange={(e) => setNew(e.target.value)}
        minLength={8}
        required
        style={inputStyle}
      />
      <button type="submit" disabled={status === 'saving'} style={btnPrimary}>
        {status === 'saving' ? 'Saving…' : 'Change Password'}
      </button>
      {status && status !== 'saving' && status !== 'ok' && (
        <span style={{ color: 'var(--bv-danger)', fontSize: 12 }}>{status}</span>
      )}
      {status === 'ok' && (
        <span style={{ color: 'var(--bv-success)', fontSize: 12 }}>Password updated ✓</span>
      )}
    </form>
  );
}

export function ActiveSessionsPanel() {
  const [sessions, setSessions] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const load = useCallback(async () => {
    setErr(null);
    try {
      const r = await fetch('/api/auth/sessions', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'x-refresh-token': localStorage.getItem('refreshToken') || '',
        },
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || 'Failed to load sessions');
      setSessions(d?.data || []);
    } catch (e) {
      setErr(e.message);
      setSessions([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function logoutOthers() {
    if (!confirm('Log out of all other devices?')) return;
    setBusy(true);
    try {
      const r = await fetch('/api/auth/logout-others', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') || null }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.message || 'Failed');
      await load();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h4 style={{ margin: 0, fontSize: 14 }}>Active Sessions</h4>
      {err && <div style={{ fontSize: 12, color: 'var(--bv-danger)' }}>{err}</div>}
      {!err && sessions.length === 0 && (
        <div style={{ fontSize: 12, color: 'var(--bv-text-muted)' }}>No other sessions.</div>
      )}
      {sessions.map((s) => (
        <div
          key={s.id}
          style={{
            fontSize: 12,
            color: 'var(--bv-text-muted)',
            padding: 8,
            border: '1px solid var(--bv-border)',
            borderRadius: 6,
          }}
        >
          {s.userAgent || 'Unknown device'}
          {s.current && ' (this device)'} · {new Date(s.createdAt).toLocaleString()}
        </div>
      ))}
      <button onClick={logoutOthers} disabled={busy} style={btnGhost}>
        {busy ? 'Logging out…' : 'Log out of all other devices'}
      </button>
    </div>
  );
}

/* ============================================================
 * SECTION 4 — COUNTRY SELECT + GEOLOCATION
 * ============================================================ */

export const COUNTRIES = [
  { code: 'NG', name: 'Nigeria', dial: '+234' },
  { code: 'GH', name: 'Ghana', dial: '+233' },
  { code: 'KE', name: 'Kenya', dial: '+254' },
  { code: 'ZA', name: 'South Africa', dial: '+27' },
  { code: 'US', name: 'United States', dial: '+1' },
  { code: 'GB', name: 'United Kingdom', dial: '+44' },
  { code: 'CA', name: 'Canada', dial: '+1' },
  { code: 'IN', name: 'India', dial: '+91' },
  { code: 'AE', name: 'United Arab Emirates', dial: '+971' },
  { code: 'EG', name: 'Egypt', dial: '+20' },
];

export function useGeoCountry(fallback = 'NG') {
  const [code, setCode] = useState(fallback);
  useEffect(() => {
    let cancelled = false;
    fetch('https://ipapi.co/json/')
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const c = (d.country_code || '').toUpperCase();
        if (c && COUNTRIES.some((x) => x.code === c)) setCode(c);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return [code, setCode];
}

export function CountrySelect({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>
      {COUNTRIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.name} ({c.dial})
        </option>
      ))}
    </select>
  );
}

/* ============================================================
 * SECTION 5 — NOTIFICATIONS
 * ============================================================ */

export function useNotifications(pollMs = 30000) {
  const [items, setItems] = useState([]);
  const unread = items.filter((n) => !n.read).length;

  const load = useCallback(async () => {
    const r = await fetch('/api/notifications', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!r.ok) return;
    const d = await r.json();
    setItems(d?.data || []);
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, pollMs);
    return () => clearInterval(id);
  }, [load, pollMs]);

  const markRead = useCallback(async (id) => {
    await fetch(`/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  return { items, unread, reload: load, markRead };
}

export function NotificationBell() {
  const { items, unread, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={btnGhost}
        aria-label="Notifications"
        aria-expanded={open}
      >
        🔔 {unread > 0 && <sup style={{ color: 'var(--bv-danger)' }}>{unread}</sup>}
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 42,
            right: 0,
            width: 300,
            maxHeight: 400,
            overflowY: 'auto',
            background: 'var(--bv-bg-elevated)',
            border: '1px solid var(--bv-border)',
            borderRadius: 8,
            padding: 8,
            zIndex: 200,
          }}
        >
          {items.length === 0 && (
            <div style={{ fontSize: 12, color: 'var(--bv-text-muted)' }}>No notifications.</div>
          )}
          {items.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              style={{
                padding: 8,
                borderRadius: 6,
                cursor: 'pointer',
                background: n.read ? 'transparent' : 'var(--bv-surface)',
                marginBottom: 4,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</div>
              <div style={{ fontSize: 12, color: 'var(--bv-text-muted)' }}>{n.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * SECTION 6 — FLOATING AI CHAT
 * ============================================================ */

export function FloatingAIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I can help with BraveVest questions.' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setBusy(true);
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.text }],
          })),
        }),
      });
      const d = await r.json();
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: d?.data?.reply || d?.reply || 'Sorry, no answer.' },
      ]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', text: 'Network error.' }]);
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--bv-accent)',
          color: '#000',
          border: 'none',
          cursor: 'pointer',
          fontSize: 22,
          zIndex: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,.3)',
        }}
        aria-label="Open assistant"
      >
        💬
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        width: 340,
        height: 480,
        background: 'var(--bv-bg-elevated)',
        border: '1px solid var(--bv-border)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 500,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: 12,
          borderBottom: '1px solid var(--bv-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <strong style={{ fontSize: 14 }}>BraveVest Assistant</strong>
        <button onClick={() => setOpen(false)} style={btnGhost} aria-label="Close">
          ✕
        </button>
      </div>
      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: 12, fontSize: 13 }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 8,
              padding: 8,
              borderRadius: 8,
              background: m.role === 'user' ? 'var(--bv-surface)' : 'transparent',
              border: m.role === 'assistant' ? '1px solid var(--bv-border)' : 'none',
            }}
          >
            {m.text}
          </div>
        ))}
        {busy && <div style={{ fontSize: 12, color: 'var(--bv-text-muted)' }}>Thinking…</div>}
      </div>
      <div style={{ display: 'flex', borderTop: '1px solid var(--bv-border)' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask anything…"
          style={{ ...inputStyle, flex: 1, border: 'none', borderRadius: 0 }}
        />
        <button onClick={send} disabled={busy} style={{ ...btnPrimary, borderRadius: 0 }}>
          Send
        </button>
      </div>
    </div>
  );
}

/* ============================================================
 * Shared styles
 * ============================================================ */
const inputStyle = {
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid var(--bv-border)',
  background: 'var(--bv-bg)',
  color: 'var(--bv-text)',
  fontSize: 13,
  fontFamily: 'inherit',
};
const btnPrimary = {
  padding: '8px 14px',
  borderRadius: 6,
  background: 'var(--bv-accent)',
  color: '#000',
  border: 'none',
  fontWeight: 600,
  cursor: 'pointer',
  fontSize: 13,
};
const btnGhost = {
  padding: '6px 10px',
  borderRadius: 6,
  background: 'transparent',
  color: 'var(--bv-text)',
  border: '1px solid var(--bv-border)',
  cursor: 'pointer',
  fontSize: 12,
};