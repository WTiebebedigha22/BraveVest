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
  --bv-surface-2: #232A33;
  --bv-border: #2B313A;
  --bv-border-strong: #3A414A;
  --bv-border-soft: #232830;
  --bv-text: #F0F3F6;
  --bv-text-muted: #848E9C;
  --bv-text-dim: #6B7280;
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
  /* ── Backgrounds — three-layer depth like dark mode ── */
  --bv-bg: #EEF1F5;                /* soft cool grey canvas */
  --bv-bg-elevated: #FFFFFF;       /* pure white cards — they float */
  --bv-surface: #F5F7FA;           /* inputs, hover fills */
  --bv-surface-2: #E8EDF2;         /* pressed, zebra, active */

  /* ── Borders — soft, not stark ── */
  --bv-border: #D9DEE5;
  --bv-border-strong: #BCC3CC;
  --bv-border-soft: #E8ECF1;

  /* ── Text — softer than pure black, matches dark mode's slate feel ── */
  --bv-text: #0B0E11;
  --bv-text-muted: #5F6873;
  --bv-text-dim: #8B95A1;
  --text-main: #0B0E11;
  --text-primary: #0B0E11;
  --text-secondary: #3A414B;
  --text-muted: #5F6873;
  --text-body: #0B0E11;
  --text-heading: #000000;
  --text-dim: #6B7280;

  /* ── Accent + semantic — deeper for light bg ── */
  --bv-accent: #B07C00;
  --bv-accent-hover: #8A5F00;
  --bv-danger: #C9252C;
  --bv-success: #0A8F5C;
  --bv-info: #2563EB;
  --bv-info-text: #1E40AF;
  --bv-warning: #B45309;
  --bv-warning-text: #854D0E;
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
   BUTTON SYSTEM
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
  transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  border: none;
  text-decoration: none;
  white-space: nowrap;
}
.bv-pill:disabled,
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

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

.bv-pill--danger,
.btn-danger {
  background: var(--bv-danger);
  color: #fff;
}
.bv-pill--danger:hover:not(:disabled),
.btn-danger:hover:not(:disabled) {
  background: color-mix(in srgb, var(--bv-danger) 85%, black);
}

.btn--sm,
.bv-pill--sm {
  padding: 6px 14px;
  font-size: 13px;
}

/* ════════════════════════════════════════════════════════════
   PAGE-SPECIFIC BUTTONS
   ════════════════════════════════════════════════════════════ */

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
.pf-btn--y { background: var(--bv-accent); color: #000; }
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
.dp-chip:hover { border-color: var(--bv-accent); color: var(--bv-accent); }
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
.kd-btn:hover:not(:disabled) { border-color: var(--bv-accent); color: var(--bv-accent); }
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

.bv-card-lift {
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.bv-card-lift:hover {
  transform: translateY(-2px);
  border-color: var(--bv-border-strong);
  box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.2);
}

/* ════════════════════════════════════════════════════════════
   PREMIUM LIGHT MODE — depth inspired by dark theme
   Scoped to [data-theme="light"] so dark mode is untouched
   ════════════════════════════════════════════════════════════ */

/* ── Cards: float on grey canvas with two-layer shadow ── */
[data-theme="light"] .bv-card,
[data-theme="light"] .market-card,
[data-theme="light"] .pf-card,
[data-theme="light"] .bv-kpi-card,
[data-theme="light"] .bv-stat-card {
  background: #FFFFFF;
  border: 1px solid var(--bv-border);
  box-shadow:
    0 1px 2px rgba(11, 14, 17, 0.04),
    0 1px 3px rgba(11, 14, 17, 0.06);
  transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
}
[data-theme="light"] .bv-card:hover,
[data-theme="light"] .market-card:hover {
  box-shadow:
    0 4px 8px rgba(11, 14, 17, 0.06),
    0 8px 20px rgba(11, 14, 17, 0.10);
  transform: translateY(-1px);
}

/* ── Inputs: inset shadow + gold focus ring ── */
[data-theme="light"] input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),
[data-theme="light"] textarea,
[data-theme="light"] select {
  background: #FFFFFF;
  border: 1px solid var(--bv-border);
  box-shadow: inset 0 1px 2px rgba(11, 14, 17, 0.03);
}
[data-theme="light"] input:focus,
[data-theme="light"] textarea:focus,
[data-theme="light"] select:focus {
  border-color: var(--bv-accent);
  box-shadow:
    inset 0 1px 2px rgba(11, 14, 17, 0.03),
    0 0 0 3px rgba(176, 124, 0, 0.15);
}

/* ── Gold button glow ── */
[data-theme="light"] .bv-pill--primary:hover:not(:disabled),
[data-theme="light"] .btn--primary:hover:not(:disabled),
[data-theme="light"] .dp-btn:hover:not(:disabled),
[data-theme="light"] .tf-btn:hover:not(:disabled),
[data-theme="light"] .wd-btn:hover:not(:disabled),
[data-theme="light"] .pn-btn:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(176, 124, 0, 0.25);
}

/* ── Table zebra + header ── */
[data-theme="light"] tbody tr:nth-child(even) {
  background: #F9FAFB;
}
[data-theme="light"] tbody tr:hover {
  background: var(--bv-surface-2);
}
[data-theme="light"] thead {
  background: #F5F7FA;
  border-bottom: 1px solid var(--bv-border);
}
[data-theme="light"] thead th {
  color: var(--bv-text-muted);
  font-weight: 600;
}

/* ── Sidebar gradient ── */
[data-theme="light"] .bv-sidebar {
  background: linear-gradient(180deg, #FAFBFC 0%, #FFFFFF 40%);
  border-right: 1px solid var(--bv-border);
}
[data-theme="light"] .bv-sidebar.admin-mode {
  background: linear-gradient(
    180deg,
    rgba(176, 124, 0, 0.04) 0%,
    #FFFFFF 40%
  );
}
[data-theme="light"] .bv-sidebar a:hover {
  background: var(--bv-surface);
}
[data-theme="light"] .bv-sidebar a.active {
  background: var(--bv-surface-2);
  color: var(--bv-accent);
}

/* ── Portal header / ticker ── */
[data-theme="light"] .bv-portal-header,
[data-theme="light"] .bv-page-shell-ticker {
  background: var(--bv-bg-elevated);
  border-bottom: 1px solid var(--bv-border-soft);
}

/* ── Chips / ghost pills ── */
[data-theme="light"] .bv-pill--ghost,
[data-theme="light"] .btn-ghost,
[data-theme="light"] .bv-chip {
  background: var(--bv-surface);
  border-color: var(--bv-border);
}
[data-theme="light"] .bv-pill--ghost:hover,
[data-theme="light"] .btn-ghost:hover,
[data-theme="light"] .bv-chip:hover {
  background: var(--bv-surface-2);
}

/* ── Modals ── */
[data-theme="light"] .bv-modal-overlay {
  background: rgba(11, 14, 17, 0.4);
  backdrop-filter: blur(4px);
}
[data-theme="light"] .bv-modal {
  background: #FFFFFF;
  border: 1px solid var(--bv-border);
  box-shadow:
    0 20px 40px rgba(11, 14, 17, 0.12),
    0 8px 16px rgba(11, 14, 17, 0.08);
}
[data-theme="light"] .bv-modal-header {
  background: #F9FAFB;
  border-bottom: 1px solid var(--bv-border);
}
[data-theme="light"] .bv-modal-body {
  background: #FFFFFF;
}
[data-theme="light"] .bv-modal-footer {
  background: #F9FAFB;
  border-top: 1px solid var(--bv-border);
}

/* ── Dropdowns ── */
[data-theme="light"] .bv-dropdown,
[data-theme="light"] .bv-menu {
  background: #FFFFFF;
  border: 1px solid var(--bv-border);
  box-shadow:
    0 8px 24px rgba(11, 14, 17, 0.10),
    0 2px 6px rgba(11, 14, 17, 0.06);
}
[data-theme="light"] .bv-dropdown-item:hover,
[data-theme="light"] .bv-menu-item:hover {
  background: var(--bv-surface);
}

/* ── Tabs ── */
[data-theme="light"] .bv-tabs {
  border-bottom: 1px solid var(--bv-border);
  background: transparent;
}
[data-theme="light"] .bv-tab {
  color: var(--bv-text-muted);
}
[data-theme="light"] .bv-tab:hover {
  background: var(--bv-surface);
  color: var(--bv-text);
}
[data-theme="light"] .bv-tab.active {
  background: var(--bv-bg-elevated);
  border: 1px solid var(--bv-border);
  border-bottom-color: var(--bv-bg-elevated);
  color: var(--bv-text);
}

/* ── Badges ── */
[data-theme="light"] .bv-badge {
  background: var(--bv-surface);
  border: 1px solid var(--bv-border);
  color: var(--bv-text-muted);
}
[data-theme="light"] .bv-badge--gold {
  background: color-mix(in srgb, var(--bv-accent) 10%, #FFFFFF);
  border-color: color-mix(in srgb, var(--bv-accent) 25%, #FFFFFF);
  color: var(--bv-accent);
}
[data-theme="light"] .bv-badge--success {
  background: color-mix(in srgb, var(--bv-success) 10%, #FFFFFF);
  border-color: color-mix(in srgb, var(--bv-success) 25%, #FFFFFF);
  color: var(--bv-success);
}
[data-theme="light"] .bv-badge--danger {
  background: color-mix(in srgb, var(--bv-danger) 8%, #FFFFFF);
  border-color: color-mix(in srgb, var(--bv-danger) 20%, #FFFFFF);
  color: var(--bv-danger);
}

/* ── Empty states ── */
[data-theme="light"] .bv-empty-state,
[data-theme="light"] .market-empty {
  background: #F9FAFB;
  border: 1px dashed var(--bv-border);
  color: var(--bv-text-muted);
}

/* ── Placeholders ── */
[data-theme="light"] input::placeholder,
[data-theme="light"] textarea::placeholder {
  color: var(--bv-text-dim);
}

/* ── Progress bars ── */
[data-theme="light"] .bv-progress-track,
[data-theme="light"] [role="progressbar"] {
  background: var(--bv-surface);
}

/* ── Skeleton ── */
[data-theme="light"] .bv-skeleton,
[data-theme="light"] .skel {
  background: linear-gradient(
    90deg,
    #F5F7FA 0%,
    #E8EDF2 50%,
    #F5F7FA 100%
  );
}

/* ── Alerts ── */
[data-theme="light"] .bv-alert {
  background: var(--bv-surface);
  border: 1px solid var(--bv-border);
  border-left: 4px solid var(--bv-accent);
}
[data-theme="light"] .bv-alert--danger {
  border-left-color: var(--bv-danger);
  background: color-mix(in srgb, var(--bv-danger) 5%, var(--bv-surface));
}
[data-theme="light"] .bv-alert--success {
  border-left-color: var(--bv-success);
  background: color-mix(in srgb, var(--bv-success) 5%, var(--bv-surface));
}
[data-theme="light"] .bv-alert--warning {
  border-left-color: var(--bv-warning);
  background: color-mix(in srgb, var(--bv-warning) 5%, var(--bv-surface));
}
[data-theme="light"] .bv-alert--info {
  border-left-color: var(--bv-info);
  background: color-mix(in srgb, var(--bv-info) 5%, var(--bv-surface));
}

/* ── Card header/footer ── */
[data-theme="light"] .bv-card-header,
[data-theme="light"] .bv-card-footer {
  background: #F9FAFB;
  border-color: var(--bv-border-soft);
}

/* ── Code blocks ── */
[data-theme="light"] pre,
[data-theme="light"] code {
  background: var(--bv-surface);
  color: var(--bv-text);
  border: 1px solid var(--bv-border-soft);
}

/* ── Page header gradient ── */
[data-theme="light"] .pf-top,
[data-theme="light"] .bv-page-top {
  background: linear-gradient(180deg, #F5F7FA 0%, #EEF1F5 100%);
  border-bottom: 1px solid var(--bv-border-soft);
}

/* ── Dividers ── */
[data-theme="light"] hr {
  border: 0;
  border-top: 1px solid var(--bv-border-soft);
  margin: 20px 0;
}
[data-theme="light"] .bv-divider {
  border-top: 1px solid var(--bv-border-soft);
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
      setMessages((m) => [...m, { role: 'assistant', text: 'Network error. Please try again.' }]);
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 500,
          boxShadow: '0 4px 20px rgba(0,0,0,.3)',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 6px 28px rgba(240,185,11,.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,.3)';
        }}
        aria-label="Open assistant"
        title="Ask BraveVest Assistant"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        width: 360,
        height: 520,
        maxWidth: 'calc(100vw - 40px)',
        maxHeight: 'calc(100vh - 40px)',
        background: 'var(--bv-bg-elevated)',
        border: '1px solid var(--bv-border)',
        borderRadius: 14,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 500,
        overflow: 'hidden',
        boxShadow: '0 12px 48px rgba(0,0,0,.4)',
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid var(--bv-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bv-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'var(--bv-accent)',
              color: '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--bv-text)' }}>
              BraveVest Assistant
            </div>
            <div style={{ fontSize: 11, color: 'var(--bv-text-muted)' }}>
              {busy ? 'Thinking…' : 'Online'}
            </div>
          </div>
        </div>
        <button
          onClick={() => setOpen(false)}
          style={{
            background: 'transparent',
            border: '1px solid var(--bv-border)',
            color: 'var(--bv-text)',
            borderRadius: 6,
            padding: 6,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 14,
          fontSize: 13,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '10px 14px',
              borderRadius: 12,
              background: m.role === 'user' ? 'var(--bv-accent)' : 'var(--bv-surface)',
              color: m.role === 'user' ? '#000' : 'var(--bv-text)',
              border: m.role === 'assistant' ? '1px solid var(--bv-border)' : 'none',
              lineHeight: 1.5,
              wordBreak: 'break-word',
            }}
          >
            {m.text}
          </div>
        ))}
        {busy && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '10px 14px',
              borderRadius: 12,
              background: 'var(--bv-surface)',
              border: '1px solid var(--bv-border)',
              color: 'var(--bv-text-muted)',
              fontSize: 12,
              fontStyle: 'italic',
            }}
          >
            Thinking…
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          borderTop: '1px solid var(--bv-border)',
          padding: 10,
          gap: 8,
          background: 'var(--bv-bg)',
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Ask anything about BraveVest…"
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid var(--bv-border)',
            background: 'var(--bv-bg-elevated)',
            color: 'var(--bv-text)',
            fontSize: 13,
            fontFamily: 'inherit',
            outline: 'none',
          }}
        />
        <button
          onClick={send}
          disabled={busy || !input.trim()}
          style={{
            padding: '10px 16px',
            borderRadius: 8,
            background: input.trim() ? 'var(--bv-accent)' : 'var(--bv-surface)',
            color: input.trim() ? '#000' : 'var(--bv-text-muted)',
            border: 'none',
            fontWeight: 700,
            fontSize: 13,
            cursor: input.trim() && !busy ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
          }}
        >
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