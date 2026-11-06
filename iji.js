#!/usr/bin/env node
/**
 * BraveVest — Opportunity submission flow
 *
 * 1. Backend: adds POST /api/projects/submit (any authenticated user)
 * 2. Backend: adds GET /api/admin/projects/pending (admin only)
 * 3. Backend: adds POST /api/admin/projects/:id/approve (admin only)
 * 4. Backend: adds POST /api/admin/projects/:id/reject (admin only)
 * 5. Backend: adds GET /api/projects/mine (user's own submissions)
 * 6. Backend: filters GET /api/projects to only OPEN status
 * 7. Frontend: /opportunities/new page (submit form)
 * 8. Frontend: /opportunities/mine page (my submissions with status)
 * 9. Frontend: Admin Projects page gets "Pending Review" tab
 * 10. Sidebar: adds "Submit Opportunity" + "My Submissions" for investors
 *
 * Usage:
 *   node iji.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const WEB = path.join(ROOT, 'bravevest-web');
const SRC = path.join(WEB, 'src');
const API = path.join(ROOT, 'bravevest-api');
const STAMP = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP = path.join(ROOT, '.bravevest-backup', STAMP);

const C = { g: '\x1b[32m', y: '\x1b[33m', b: '\x1b[36m', x: '\x1b[0m' };
const ok = (m) => console.log(`${C.g}✅${C.x} ${m}`);
const warn = (m) => console.log(`${C.y}⚠️ ${C.x} ${m}`);
const info = (m) => console.log(`${C.b}ℹ️ ${C.x} ${m}`);
const head = (m) => console.log(`\n${C.b}━━ ${m} ━━${C.x}`);

function backup(file) {
  if (!fs.existsSync(file)) return;
  const rel = path.relative(ROOT, file);
  const dest = path.join(BACKUP, rel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(file, dest);
}
function write(file, lines) {
  const rel = path.relative(ROOT, file);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  backup(file);
  fs.writeFileSync(file, lines.join('\n'));
  ok(`wrote ${rel}`);
}
function patch(file, fn, label) {
  const rel = path.relative(ROOT, file);
  if (!fs.existsSync(file)) return warn(`missing: ${rel}`);
  const before = fs.readFileSync(file, 'utf8');
  const after = fn(before);
  if (after === before) return info(`no change: ${rel}`);
  backup(file);
  fs.writeFileSync(file, after);
  ok(`patched ${rel}${label ? ' — ' + label : ''}`);
}

if (!fs.existsSync(SRC)) {
  console.error('❌ bravevest-web/src not found');
  process.exit(1);
}

console.log('\n🎯 BraveVest — Opportunity submission flow\n');

// ═══════════════════════════════════════════════════════════════
head('1. Backend: extending projects routes');

const projectsFile = path.join(API, 'src', 'modules', 'projects', 'projects.routes.js');
if (!fs.existsSync(projectsFile)) {
  warn('projects.routes.js not found');
} else {
  let src = fs.readFileSync(projectsFile, 'utf8');

  // ── Ensure imports ──
  if (!/authRequired/.test(src.split('router.')[0])) {
    const lines = src.split('\n');
    let lastRequire = -1;
    lines.forEach((l, i) => { if (/^const\s+.*=\s*require\(/.test(l.trim())) lastRequire = i; });
    if (lastRequire >= 0) {
      lines.splice(lastRequire + 1, 0, "const { authRequired } = require('../../middleware/auth.middleware');");
      src = lines.join('\n');
    }
  }

  // ── PATCH: GET / should only return OPEN projects ──
  if (/router\.get\(\s*['"]\/['"]/.test(src) && !/PENDING_REVIEW.*status|status:\s*['"]OPEN['"]/.test(src)) {
    src = src.replace(
      /router\.get\(\s*['"]\/['"]\s*,\s*(?:async\s*)?\(/,
      (match) => '// only OPEN projects are visible publicly\nrouter.get(\'/\', async (req, res, next) => {\n  try {\n    const projects = await prisma.project.findMany({\n      where: { status: \'OPEN\' },\n      orderBy: { createdAt: \'desc\' },\n    });\n    res.json(projects);\n  } catch (err) { next(err); }\n});\n\nconst _unused_get_all = ('
    );
    // Remove old handler body — find from "const _unused_get_all" to its closing "});"
    src = src.replace(
      /const _unused_get_all = \([^)]*\)[\s\S]*?\n\}\);/,
      ''
    );
  }

  // ── ADD: GET /mine — user's own submissions ──
  if (!/router\.get\(\s*['"]\/mine['"]/.test(src)) {
    const block = `
/**
 * GET /api/projects/mine
 * Returns projects submitted by the logged-in user (any status).
 */
router.get('/mine', authRequired, async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { createdById: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (err) { next(err); }
});
`;
    src = src.replace(/module\.exports\s*=\s*router;?\s*$/, block + '\nmodule.exports = router;');
    if (!src.includes('module.exports = router')) src += '\nmodule.exports = router;\n';
  }

  // ── ADD: POST /submit — any authenticated user can submit ──
  if (!/router\.post\(\s*['"]\/submit['"]/.test(src)) {
    const block = `
/**
 * POST /api/projects/submit
 * Any authenticated user can submit a new opportunity.
 * Creates as PENDING_REVIEW — admin must approve.
 * Body: { title, summary, description, category, targetAmount, minInvestment, expectedReturnPct, tenorMonths, riskLevel, location? }
 */
router.post('/submit', authRequired, async (req, res, next) => {
  try {
    const {
      title, summary, description, category,
      targetAmount, minInvestment, expectedReturnPct, tenorMonths,
      riskLevel, location,
    } = req.body || {};

    if (!title || !summary || !description || !category) {
      return res.status(400).json({ message: 'title, summary, description, category are required.' });
    }
    if (!targetAmount || !minInvestment || !expectedReturnPct || !tenorMonths) {
      return res.status(400).json({ message: 'targetAmount, minInvestment, expectedReturnPct, tenorMonths are required.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now().toString(36);

    const project = await prisma.project.create({
      data: {
        slug,
        title: title.trim(),
        summary: summary.trim(),
        description: description.trim(),
        category,
        targetAmount: Number(targetAmount),
        minInvestment: Number(minInvestment),
        expectedReturnPct: Number(expectedReturnPct),
        tenorMonths: Number(tenorMonths),
        riskLevel: riskLevel || null,
        location: location || null,
        status: 'PENDING_REVIEW',
        createdById: req.user.id,
      },
    });

    res.status(201).json(project);
  } catch (err) { next(err); }
});
`;
    src = src.replace(/module\.exports\s*=\s*router;?\s*$/, block + '\nmodule.exports = router;');
    if (!src.includes('module.exports = router')) src += '\nmodule.exports = router;\n';
  }

  backup(projectsFile);
  fs.writeFileSync(projectsFile, src);
  ok('patched projects.routes.js — added /mine, /submit, filtered GET / to OPEN');
}

// ═══════════════════════════════════════════════════════════════
head('2. Backend: admin approval routes');

const adminFile = path.join(API, 'src', 'modules', 'admin', 'admin.routes.js');
if (!fs.existsSync(adminFile)) {
  warn('admin.routes.js not found');
} else {
  let src = fs.readFileSync(adminFile, 'utf8');

  if (!/authRequired/.test(src.split('router.')[0])) {
    const lines = src.split('\n');
    let lastRequire = -1;
    lines.forEach((l, i) => { if (/^const\s+.*=\s*require\(/.test(l.trim())) lastRequire = i; });
    if (lastRequire >= 0) {
      lines.splice(lastRequire + 1, 0, "const { authRequired } = require('../../middleware/auth.middleware');");
      src = lines.join('\n');
    }
  }
  const guard = /adminOnly/.test(src) ? 'adminOnly' : '';
  const guardArg = guard ? `, ${guard}` : '';

  // ── ADD: GET /projects/pending ──
  if (!/router\.get\(\s*['"]\/projects\/pending['"]/.test(src)) {
    const block = `
router.get('/projects/pending', authRequired${guardArg}, async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { status: 'PENDING_REVIEW' },
      orderBy: { createdAt: 'asc' },
      include: { createdBy: { select: { email: true, firstName: true, lastName: true } } },
    }).catch(() => prisma.project.findMany({ where: { status: 'PENDING_REVIEW' }, orderBy: { createdAt: 'asc' } }));
    res.json(projects);
  } catch (err) { next(err); }
});
`;
    src = src.replace(/module\.exports\s*=\s*router;?\s*$/, block + '\nmodule.exports = router;');
    if (!src.includes('module.exports = router')) src += '\nmodule.exports = router;\n';
  }

  // ── ADD: POST /projects/:id/approve ──
  if (!/router\.post\(\s*['"]\/projects\/:id\/approve['"]/.test(src)) {
    const block = `
router.post('/projects/:id/approve', authRequired${guardArg}, async (req, res, next) => {
  try {
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { status: 'OPEN' },
    });
    res.json(project);
  } catch (err) { next(err); }
});
`;
    src = src.replace(/module\.exports\s*=\s*router;?\s*$/, block + '\nmodule.exports = router;');
    if (!src.includes('module.exports = router')) src += '\nmodule.exports = router;\n';
  }

  // ── ADD: POST /projects/:id/reject ──
  if (!/router\.post\(\s*['"]\/projects\/:id\/reject['"]/.test(src)) {
    const block = `
router.post('/projects/:id/reject', authRequired${guardArg}, async (req, res, next) => {
  try {
    const { reason } = req.body || {};
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        status: 'CLOSED',
        description: reason ? (project_description_append = reason) : undefined,
      },
    }).catch(async () => {
      // fallback if description append fails
      return prisma.project.update({
        where: { id: req.params.id },
        data: { status: 'CLOSED' },
      });
    });
    res.json(project);
  } catch (err) { next(err); }
});
`.replace('project_description_append = reason', 'undefined');

    src = src.replace(/module\.exports\s*=\s*router;?\s*$/, block + '\nmodule.exports = router;');
    if (!src.includes('module.exports = router')) src += '\nmodule.exports = router;\n';
  }

  backup(adminFile);
  fs.writeFileSync(adminFile, src);
  ok('patched admin.routes.js — added /projects/pending, /:id/approve, /:id/reject');
}

// ═══════════════════════════════════════════════════════════════
head('3. Frontend: Submit Opportunity page');

write(path.join(SRC, 'pages', 'investor', 'SubmitOpportunity.jsx'), [
  "import { useState } from 'react';",
  "import { useNavigate, Link } from 'react-router-dom';",
  "import { ArrowLeft, AlertCircle, CheckCircle, Loader2, Send } from 'lucide-react';",
  "import { apiFetch } from '@/lib/api';",
  "import PortalLayout from '@/components/layout/PortalLayout';",
  "",
  "const CATEGORIES = [",
  "  { value: 'ENERGY', label: 'Energy' },",
  "  { value: 'REAL_ESTATE', label: 'Real Estate' },",
  "  { value: 'AGRICULTURE', label: 'Agriculture' },",
  "  { value: 'SME', label: 'SME' },",
  "  { value: 'INFRASTRUCTURE', label: 'Infrastructure' },",
  "];",
  "",
  "export default function SubmitOpportunity() {",
  "  const nav = useNavigate();",
  "  const [form, setForm] = useState({",
  "    title: '', summary: '', description: '', category: 'SME',",
  "    targetAmount: '', minInvestment: '', expectedReturnPct: '', tenorMonths: '',",
  "    riskLevel: '', location: '',",
  "  });",
  "  const [submitting, setSubmitting] = useState(false);",
  "  const [err, setErr] = useState('');",
  "  const [ok, setOk] = useState('');",
  "",
  "  async function submit(e) {",
  "    e.preventDefault();",
  "    setErr(''); setOk('');",
  "    if (!form.title.trim() || !form.summary.trim() || !form.description.trim()) {",
  "      return setErr('Title, summary, and description are required.');",
  "    }",
  "    if (!form.targetAmount || !form.minInvestment || !form.expectedReturnPct || !form.tenorMonths) {",
  "      return setErr('Amount fields are required.');",
  "    }",
  "    setSubmitting(true);",
  "    try {",
  "      await apiFetch('/projects/submit', { method: 'POST', body: form });",
  "      setOk('Opportunity submitted. An admin will review it within 24 hours.');",
  "      setTimeout(() => nav('/opportunities/mine'), 1500);",
  "    } catch (e) {",
  "      setErr(e?.message || 'Could not submit.');",
  "    } finally {",
  "      setSubmitting(false);",
  "    }",
  "  }",
  "",
  "  const input = { padding: '12px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 14, color: 'var(--text)', outline: 'none', width: '100%', fontFamily: 'inherit' };",
  "  const label = { display: 'grid', gap: 6, fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 16 };",
  "",
  "  return (",
  "    <PortalLayout theme='dark'>",
  "      <section style={{ padding: '32px 20px 96px' }}>",
  "        <div style={{ maxWidth: 720, margin: '0 auto' }}>",
  "          <Link to='/dashboard' style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', textDecoration: 'none', fontSize: 13, marginBottom: 16 }}>",
  "            <ArrowLeft size={14} /> Back to dashboard",
  "          </Link>",
  "          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>",
  "            Submit an opportunity",
  "          </h1>",
  "          <p style={{ color: 'var(--text-muted)', margin: '0 0 32px', fontSize: 15 }}>",
  "            Have a project that needs funding? Submit it for review. An admin will approve or reject within 24 hours. Approved projects appear in the public marketplace.",
  "          </p>",
  "",
  "          <form onSubmit={submit} className='bv-card-lift' style={{ padding: 32, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>",
  "            {err && <div style={{ padding: '10px 12px', background: 'rgba(246,70,93,0.1)', borderRadius: 8, color: '#F6465D', fontSize: 13, marginBottom: 20, display: 'flex', gap: 8 }}><AlertCircle size={16} /> {err}</div>}",
  "            {ok && <div style={{ padding: '10px 12px', background: 'rgba(14,203,129,0.1)', borderRadius: 8, color: '#0ECB81', fontSize: 13, marginBottom: 20, display: 'flex', gap: 8 }}><CheckCircle size={16} /> {ok}</div>}",
  "",
  "            <label style={label}>Project title<input type='text' value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder='e.g., Lagos Solar Fund III' style={input} /></label>",
  "            <label style={label}>One-line summary<input type='text' value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required placeholder='A 30MW solar portfolio across Lagos' style={input} /></label>",
  "            <label style={label}>Full description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={6} placeholder='Collateral, offtaker, sponsor track record, use of funds, timeline...' style={{ ...input, resize: 'vertical', fontFamily: 'inherit' }} /></label>",
  "",
  "            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>",
  "              <label style={label}>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={input}>{CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></label>",
  "              <label style={label}>Risk level<select value={form.riskLevel} onChange={(e) => setForm({ ...form, riskLevel: e.target.value })} style={input}><option value=''>Select</option><option value='A'>A (Low)</option><option value='AA'>AA (Very Low)</option><option value='BBB'>BBB (Medium)</option><option value='BB'>BB (High)</option><option value='B'>B (Very High)</option></select></label>",
  "            </div>",
  "",
  "            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>",
  "              <label style={label}>Target (₦)<input type='number' value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} required placeholder='250000000' style={input} /></label>",
  "              <label style={label}>Min investment (₦)<input type='number' value={form.minInvestment} onChange={(e) => setForm({ ...form, minInvestment: e.target.value })} required placeholder='50000' style={input} /></label>",
  "            </div>",
  "",
  "            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>",
  "              <label style={label}>Annual yield (%)<input type='number' step='0.1' value={form.expectedReturnPct} onChange={(e) => setForm({ ...form, expectedReturnPct: e.target.value })} required placeholder='14.5' style={input} /></label>",
  "              <label style={label}>Tenor (months)<input type='number' value={form.tenorMonths} onChange={(e) => setForm({ ...form, tenorMonths: e.target.value })} required placeholder='18' style={input} /></label>",
  "            </div>",
  "",
  "            <label style={label}>Location (optional)<input type='text' value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder='Lagos, Nigeria' style={input} /></label>",
  "",
  "            <div style={{ padding: 12, background: 'rgba(246,165,0,0.08)', border: '1px solid rgba(246,165,0,0.2)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>",
  "              By submitting, you confirm the details are accurate. Admin review within 24 hours. You can track status in <strong>My Submissions</strong>.",
  "            </div>",
  "",
  "            <button type='submit' disabled={submitting} className='bv-pill bv-pill--primary' style={{ width: '100%', justifyContent: 'center' }}>",
  "              {submitting ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={16} />}",
  "              {submitting ? 'Submitting…' : 'Submit for review'}",
  "            </button>",
  "            <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>",
  "          </form>",
  "        </div>",
  "      </section>",
  "    </PortalLayout>",
  "  );",
  "}",
  ""
]);

// ═══════════════════════════════════════════════════════════════
head('4. Frontend: My Submissions page');

write(path.join(SRC, 'pages', 'investor', 'MySubmissions.jsx'), [
  "import { useEffect, useState } from 'react';",
  "import { Link } from 'react-router-dom';",
  "import { Plus, AlertCircle, Loader2, Clock, CheckCircle, XCircle } from 'lucide-react';",
  "import { apiFetch } from '@/lib/api';",
  "import { useCurrency } from '@/context/CurrencyContext';",
  "import PortalLayout from '@/components/layout/PortalLayout';",
  "",
  "const STATUS = {",
  "  PENDING_REVIEW: { label: 'Pending review', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', Icon: Clock },",
  "  OPEN: { label: 'Approved — live on marketplace', color: '#0ECB81', bg: 'rgba(14,203,129,0.1)', Icon: CheckCircle },",
  "  CLOSED: { label: 'Rejected or closed', color: '#F6465D', bg: 'rgba(246,70,93,0.1)', Icon: XCircle },",
  "  DRAFT: { label: 'Draft', color: '#6B7280', bg: 'rgba(107,114,128,0.1)', Icon: Clock },",
  "  FUNDED: { label: 'Funded', color: '#F6A500', bg: 'rgba(246,165,0,0.1)', Icon: CheckCircle },",
  "};",
  "",
  "export default function MySubmissions() {",
  "  const { format } = useCurrency();",
  "  const [items, setItems] = useState([]);",
  "  const [loading, setLoading] = useState(true);",
  "  const [error, setError] = useState('');",
  "",
  "  useEffect(() => {",
  "    let cancelled = false;",
  "    (async () => {",
  "      try {",
  "        const data = await apiFetch('/projects/mine');",
  "        if (!cancelled) setItems(Array.isArray(data) ? data : []);",
  "      } catch (e) {",
  "        if (!cancelled) setError(e?.message || 'Could not load submissions.');",
  "      } finally {",
  "        if (!cancelled) setLoading(false);",
  "      }",
  "    })();",
  "    return () => { cancelled = true; };",
  "  }, []);",
  "",
  "  return (",
  "    <PortalLayout theme='dark'>",
  "      <section style={{ padding: '32px 20px 96px' }}>",
  "        <div style={{ maxWidth: 900, margin: '0 auto' }}>",
  "          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>",
  "            <div>",
  "              <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>",
  "                My submissions",
  "              </h1>",
  "              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 15 }}>",
  "                Track status of opportunities you have submitted.",
  "              </p>",
  "            </div>",
  "            <Link to='/opportunities/new' className='bv-pill bv-pill--primary'>",
  "              <Plus size={16} /> New submission",
  "            </Link>",
  "          </div>",
  "",
  "          {loading && <div style={{ padding: 48, color: 'var(--text-muted)' }}><Loader2 size={20} /> Loading…</div>}",
  "          {error && <div style={{ padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: '#F6465D' }}>{error}</div>}",
  "          {!loading && !error && items.length === 0 && (",
  "            <div style={{ padding: 48, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>",
  "              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>No submissions yet</h3>",
  "              <p style={{ color: 'var(--text-muted)', marginBottom: 20, fontSize: 14 }}>",
  "                Submit your first opportunity for admin review.",
  "              </p>",
  "              <Link to='/opportunities/new' className='bv-pill bv-pill--primary'>",
  "                <Plus size={16} /> Submit an opportunity",
  "              </Link>",
  "            </div>",
  "          )}",
  "          {!loading && items.length > 0 && (",
  "            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>",
  "              {items.map((p) => {",
  "                const st = STATUS[p.status] || STATUS.PENDING_REVIEW;",
  "                const Icon = st.Icon;",
  "                return (",
  "                  <div key={p.id} className='bv-card-lift' style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>",
  "                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>",
  "                      <div style={{ flex: 1, minWidth: 200 }}>",
  "                        <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: 'var(--text)' }}>{p.title}</h3>",
  "                        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: 1.5 }}>{p.summary}</p>",
  "                        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>",
  "                          {p.category} · Target {format(p.targetAmount)} · {p.expectedReturnPct}% · {p.tenorMonths}mo",
  "                        </div>",
  "                      </div>",
  "                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: st.bg, color: st.color, borderRadius: 6, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>",
  "                        <Icon size={14} />",
  "                        {st.label}",
  "                      </div>",
  "                    </div>",
  "                  </div>",
  "                );",
  "              })}",
  "            </div>",
  "          )}",
  "        </div>",
  "      </section>",
  "    </PortalLayout>",
  "  );",
  "}",
  ""
]);

// ═══════════════════════════════════════════════════════════════
head('5. Frontend: Admin Pending Review page');

write(path.join(SRC, 'pages', 'admin', 'PendingProjects.jsx'), [
  "import { useEffect, useState } from 'react';",
  "import { CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';",
  "import { apiFetch } from '@/lib/api';",
  "import { useCurrency } from '@/context/CurrencyContext';",
  "import PortalLayout from '@/components/layout/PortalLayout';",
  "",
  "export default function PendingProjects() {",
  "  const { format } = useCurrency();",
  "  const [items, setItems] = useState([]);",
  "  const [loading, setLoading] = useState(true);",
  "  const [error, setError] = useState('');",
  "  const [acting, setActing] = useState('');",
  "",
  "  async function load() {",
  "    setLoading(true);",
  "    try {",
  "      const data = await apiFetch('/admin/projects/pending');",
  "      setItems(Array.isArray(data) ? data : []);",
  "    } catch (e) {",
  "      setError(e?.message || 'Could not load pending projects.');",
  "    } finally {",
  "      setLoading(false);",
  "    }",
  "  }",
  "",
  "  useEffect(() => { load(); }, []);",
  "",
  "  async function act(id, action) {",
  "    setActing(id + '-' + action);",
  "    try {",
  "      await apiFetch('/admin/projects/' + id + '/' + action, { method: 'POST', body: {} });",
  "      setItems((prev) => prev.filter((p) => p.id !== id));",
  "    } catch (e) {",
  "      setError(e?.message || 'Action failed.');",
  "    } finally {",
  "      setActing('');",
  "    }",
  "  }",
  "",
  "  return (",
  "    <PortalLayout theme='dark'>",
  "      <section style={{ padding: '32px 20px 96px' }}>",
  "        <div style={{ maxWidth: 1000, margin: '0 auto' }}>",
  "          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, margin: '0 0 8px', color: 'var(--text)' }}>",
  "            Pending review",
  "          </h1>",
  "          <p style={{ color: 'var(--text-muted)', margin: '0 0 24px', fontSize: 15 }}>",
  "            Opportunities submitted by investors. Approve to publish them on the marketplace, or reject.",
  "          </p>",
  "",
  "          {error && <div style={{ padding: 16, background: 'rgba(246,70,93,0.1)', border: '1px solid rgba(246,70,93,0.25)', borderRadius: 12, color: '#F6465D', marginBottom: 24, display: 'flex', gap: 8 }}><AlertCircle size={18} /> {error}</div>}",
  "",
  "          {loading ? (",
  "            <div style={{ padding: 48, color: 'var(--text-muted)', display: 'flex', gap: 12 }}><Loader2 size={20} /> Loading pending projects…</div>",
  "          ) : items.length === 0 ? (",
  "            <div style={{ padding: 48, textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>",
  "              <CheckCircle size={40} color='#0ECB81' style={{ margin: '0 auto 16px' }} />",
  "              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>",
  "                All caught up",
  "              </h3>",
  "              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: 14 }}>",
  "                No projects waiting for review.",
  "              </p>",
  "            </div>",
  "          ) : (",
  "            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>",
  "              {items.map((p) => (",
  "                <div key={p.id} className='bv-card-lift' style={{ padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16 }}>",
  "                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>",
  "                    <div style={{ flex: 1, minWidth: 250 }}>",
  "                      <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px', color: 'var(--text)' }}>{p.title}</h3>",
  "                      <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.5 }}>{p.summary}</p>",
  "                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, fontSize: 13 }}>",
  "                        <div><span style={{ color: 'var(--text-muted)' }}>Category:</span> <strong>{p.category}</strong></div>",
  "                        <div><span style={{ color: 'var(--text-muted)' }}>Target:</span> <strong>{format(p.targetAmount)}</strong></div>",
  "                        <div><span style={{ color: 'var(--text-muted)' }}>Yield:</span> <strong>{p.expectedReturnPct}%</strong></div>",
  "                        <div><span style={{ color: 'var(--text-muted)' }}>Tenor:</span> <strong>{p.tenorMonths}mo</strong></div>",
  "                        <div><span style={{ color: 'var(--text-muted)' }}>Risk:</span> <strong>{p.riskLevel || '—'}</strong></div>",
  "                        <div><span style={{ color: 'var(--text-muted)' }}>Submitted by:</span> <strong>{p.createdBy?.email || p.createdById?.slice(0, 8) || '—'}</strong></div>",
  "                      </div>",
  "                    </div>",
  "                  </div>",
  "                  <details style={{ marginBottom: 16 }}>",
  "                    <summary style={{ cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>",
  "                      View full description",
  "                    </summary>",
  "                    <div style={{ padding: 16, background: 'var(--bg-soft)', borderRadius: 8, marginTop: 12, fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>",
  "                      {p.description}",
  "                    </div>",
  "                  </details>",
  "                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>",
  "                    <button",
  "                      onClick={() => act(p.id, 'approve')}",
  "                      disabled={acting === p.id + '-approve'}",
  "                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#0ECB81', color: '#0A0A0A', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: acting ? 'not-allowed' : 'pointer', opacity: acting === p.id + '-approve' ? 0.6 : 1 }}",
  "                    >",
  "                      {acting === p.id + '-approve' ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle size={16} />}",
  "                      Approve",
  "                    </button>",
  "                    <button",
  "                      onClick={() => act(p.id, 'reject')}",
  "                      disabled={acting === p.id + '-reject'}",
  "                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'rgba(246,70,93,0.1)', color: '#F6465D', border: '1px solid rgba(246,70,93,0.3)', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: acting ? 'not-allowed' : 'pointer', opacity: acting === p.id + '-reject' ? 0.6 : 1 }}",
  "                    >",
  "                      {acting === p.id + '-reject' ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <XCircle size={16} />}",
  "                      Reject",
  "                    </button>",
  "                  </div>",
  "                </div>",
  "              ))}",
  "            </div>",
  "          )}",
  "          <style>{'@keyframes spin { to { transform: rotate(360deg); } }'}</style>",
  "        </div>",
  "      </section>",
  "    </PortalLayout>",
  "  );",
  "}",
  ""
]);

// ═══════════════════════════════════════════════════════════════
head('6. Sidebar: add Submit + My Submissions for investor, Pending Review for admin');

patch(path.join(SRC, 'components', 'layout', 'Sidebar.jsx'), (src) => {
  let out = src;

  // Add investor links
  if (!/\/opportunities\/new/.test(out)) {
    out = out.replace(
      /{ to: '\/investments', label: 'Investments', icon: TrendingUp },/,
      "{ to: '/investments', label: 'Investments', icon: TrendingUp },\n  { to: '/opportunities/new', label: 'Submit Opportunity', icon: Plus },\n  { to: '/opportunities/mine', label: 'My Submissions', icon: FileCheck },"
    );
  }

  // Add admin pending review link
  if (!/\/admin\/projects\/pending/.test(out)) {
    out = out.replace(
      /{ to: '\/admin\/projects', label: 'Projects', icon: FolderOpen },/,
      "{ to: '/admin/projects', label: 'Projects', icon: FolderOpen },\n  { to: '/admin/projects/pending', label: 'Pending Review', icon: Clock },"
    );
  }

  // Add Plus, FileCheck, Clock to imports
  if (!/\bPlus\b/.test(out.split('router.')[0])) {
    out = out.replace(
      /FolderOpen, Settings, Inbox, PieChart, ArrowLeftRight, LogOut, X,/,
      "FolderOpen, Settings, Inbox, PieChart, ArrowLeftRight, LogOut, X,\n  Plus, FileCheck, Clock,"
    );
  }

  return out;
}, 'sidebar: added new links');

// ═══════════════════════════════════════════════════════════════
head('7. Routes: add new pages');

patch(path.join(SRC, 'routes', 'AppRoutes.jsx'), (src) => {
  let out = src;

  // Add lazy imports
  if (!/SubmitOpportunity/.test(out)) {
    out = out.replace(
      /const Dashboard = lazy\(\(\) => import\('@\/pages\/investor\/Dashboard'\)\);/,
      "const SubmitOpportunity = lazy(() => import('@/pages/investor/SubmitOpportunity'));\nconst MySubmissions = lazy(() => import('@/pages/investor/MySubmissions'));\nconst PendingProjects = lazy(() => import('@/pages/admin/PendingProjects'));\nconst Dashboard = lazy(() => import('@/pages/investor/Dashboard'));"
    );
  }

  // Add routes
  if (!/\/opportunities\/new/.test(out)) {
    out = out.replace(
      /<Route path="\/investments" element=\{<Investments \/>\} \/>/,
      '<Route path="/investments" element={<Investments />} />\n        <Route path="/opportunities/new" element={<SubmitOpportunity />} />\n        <Route path="/opportunities/mine" element={<MySubmissions />} />'
    );
  }

  if (!/\/admin\/projects\/pending/.test(out)) {
    out = out.replace(
      /<Route path="\/admin\/projects" element=\{<AdminProjects \/>\} \/>/,
      '<Route path="/admin/projects" element={<AdminProjects />} />\n        <Route path="/admin/projects/pending" element={<PendingProjects />} />'
    );
  }

  return out;
}, 'routes: added 3 new pages');

// ═══════════════════════════════════════════════════════════════
console.log('\n' + '─'.repeat(60));
console.log('\n✅ Opportunity submission flow applied\n');
console.log(`💾 Backup: ${path.relative(ROOT, BACKUP)}\n`);
console.log('What was added:\n');
console.log('  BACKEND:');
console.log('    POST /api/projects/submit           → any user, creates PENDING_REVIEW');
console.log('    GET  /api/projects/mine             → user\'s own submissions');
console.log('    GET  /api/projects                  → only OPEN projects (approved)');
console.log('    GET  /api/admin/projects/pending    → admin queue');
console.log('    POST /api/admin/projects/:id/approve');
console.log('    POST /api/admin/projects/:id/reject\n');
console.log('  FRONTEND:');
console.log('    /opportunities/new        → submission form (investor)');
console.log('    /opportunities/mine       → my submissions with status');
console.log('    /admin/projects/pending   → admin review queue\n');
console.log('  SIDEBAR:');
console.log('    Investor: + Submit Opportunity, My Submissions');
console.log('    Admin:    + Pending Review\n');
console.log('Next:\n');
console.log('  1. Restart backend:');
console.log('       cd bravevest-api && npm run dev\n');
console.log('  2. Restart frontend:');
console.log('       cd bravevest-web');
console.log('       Remove-Item -Recurse -Force node_modules\\.vite');
console.log('       npm run dev\n');
console.log('  3. Test the flow:\n');
console.log('     INVESTOR SIDE (login as investor@demo.bravevest.test):');
console.log('       → Sidebar now has "Submit Opportunity" and "My Submissions"');
console.log('       → Click Submit Opportunity → fill form → submit');
console.log('       → Redirected to My Submissions → see "Pending review" badge\n');
console.log('     ADMIN SIDE (login as admin@demo.bravevest.test):');
console.log('       → Orange banner at top');
console.log('       → Sidebar has "Pending Review"');
console.log('       → Click Pending Review → see the investor\'s submission');
console.log('       → Click Approve → project goes LIVE on /marketplace\n');
console.log('     AFTER APPROVAL:');
console.log('       → Log out, log back in as investor');
console.log('       → Visit /marketplace → approved project is now listed');
console.log('       → Your "My Submissions" shows "Approved — live on marketplace"\n');