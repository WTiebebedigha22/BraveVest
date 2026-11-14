import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * AdminShell — INNER layout for admin pages.
 * The page itself must wrap this in <PageShell>.
 *
 * Usage:
 *   <PageShell>
 *     <AdminShell title="..." description="..." actions={...} breadcrumbs={[...]}>
 *       {content}
 *     </AdminShell>
 *   </PageShell>
 */
export default function AdminShell({ title, description, actions, children, breadcrumbs }) {
  return (
    <div style={{ padding: '24px 20px 96px', maxWidth: 1400, margin: '0 auto' }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, color: 'var(--bv-text-muted)', marginBottom: 12,
        }}>
          <Link to="/admin" style={{ color: 'inherit', textDecoration: 'none' }}>Admin</Link>
          {breadcrumbs.map((b, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ChevronRight size={12} />
              {b.to ? (
                <Link to={b.to} style={{ color: 'inherit', textDecoration: 'none' }}>{b.label}</Link>
              ) : (
                <span style={{ color: 'var(--bv-text)' }}>{b.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        gap: 16, flexWrap: 'wrap', marginBottom: 24,
      }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: '0 0 6px', color: 'var(--bv-text)' }}>
            {title}
          </h1>
          {description && (
            <p style={{ fontSize: 14, color: 'var(--bv-text-muted)', margin: 0 }}>
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {actions}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}
