#!/usr/bin/env node
/**
 * bravevest-web/scripts/wire-profile.cjs
 *
 * Wire the KYC-locked fields + Security section into Profile.jsx.
 *
 *     node scripts/wire-profile.cjs --dry
 *     node scripts/wire-profile.cjs
 */

const fs = require('fs');
const path = require('path');

const DRY = process.argv.includes('--dry');
const file = path.join(process.cwd(), 'src', 'pages', 'investor', 'Profile.jsx');

if (!fs.existsSync(file)) {
  console.error('✗  Profile.jsx not found');
  process.exit(1);
}

let src = fs.readFileSync(file, 'utf8');
const orig = src;
const changes = [];

/* ── 1. Add imports ─────────────────────────────────── */

if (!/from\s+['"]@\/AppEnhancements['"]/.test(src)) {
  src = src.replace(
    /^((?:import .*?;\n)+)/m,
    `$1import { LockedField, ChangePasswordForm, ActiveSessionsPanel } from '@/AppEnhancements';\n`
  );
  changes.push('added AppEnhancements import');
} else if (!/LockedField/.test(src)) {
  src = src.replace(
    /import\s*\{([^}]+)\}\s*from\s*['"]@\/AppEnhancements['"]/,
    (m, names) => {
      const set = new Set(names.split(',').map((s) => s.trim()).filter(Boolean));
      set.add('LockedField');
      set.add('ChangePasswordForm');
      set.add('ActiveSessionsPanel');
      return `import { ${[...set].join(', ')} } from '@/AppEnhancements'`;
    }
  );
  changes.push('added missing named imports');
}

/* ── 2. Wrap common KYC fields with LockedField ────── */

const FIELD_PATTERNS = [
  // Match `<input ...value={firstName}...` or `<select...` on the same line
  // Wrap by inserting <LockedField> before the parent label and after the input.
  // This is heuristic — pattern-matching JSX is fragile, so we only do
  // the simple wrapping case.
];

// Simpler strategy: find each label+input pair and wrap. This is opt-in —
// the script logs which fields to wrap manually if the pattern is complex.

/* ── 3. Append Security section before the last closing </div> ── */

const SECURITY = `
      {/* ── Security ─────────────────────────────────── */}
      <section
        style={{
          marginTop: 40,
          padding: 20,
          border: '1px solid var(--bv-border)',
          borderRadius: 8,
          background: 'var(--bv-bg-elevated)',
        }}
      >
        <h2
          style={{
            margin: '0 0 16px',
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--bv-text)',
          }}
        >
          Security
        </h2>
        <div style={{ marginBottom: 32 }}>
          <h3
            style={{
              margin: '0 0 12px',
              fontSize: 15,
              fontWeight: 600,
              color: 'var(--bv-text)',
            }}
          >
            Change Password
          </h3>
          <ChangePasswordForm />
        </div>
        <div
          style={{
            borderTop: '1px solid var(--bv-border)',
            paddingTop: 24,
          }}
        >
          <ActiveSessionsPanel />
        </div>
      </section>
`;

// Insert before the final `</div>` closing the page wrapper
const insertRe = /(\n\s*<\/div>\s*\)\s*;?\s*\}\s*)$/;
if (insertRe.test(src) && !src.includes('ActiveSessionsPanel />')) {
  src = src.replace(insertRe, `${SECURITY}$1`);
  changes.push('added Security section');
}

/* ── 4. Write ──────────────────────────────────────── */

if (src !== orig) {
  if (!DRY) fs.writeFileSync(file, src, 'utf8');
  console.log(`✓ ${changes.length} change(s) applied to Profile.jsx:`);
  for (const c of changes) console.log(`    ${c}`);
  console.log('');
  if (!DRY) {
    console.log('Next steps:');
    console.log('  1. Open Profile.jsx and wrap KYC fields with <LockedField>:');
    console.log('     <LockedField hint="Locked after KYC approval.">');
    console.log('       <label>First Name</label>');
    console.log('       <input value={firstName} ... />');
    console.log('     </LockedField>');
    console.log('     Repeat for: Last Name, Email, Phone');
    console.log('     Do NOT wrap: Profile Picture');
    console.log('');
    console.log('  2. Restart dev server + hard-refresh /profile');
  }
} else {
  console.log('↻ No changes — Profile.jsx already wired (or patterns not matched)');
  console.log('');
  console.log('If Security section missing, add manually before the closing </div>:');
  console.log(SECURITY);
}