import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="page-light" style={{ minHeight: '100vh', background: '#FAFAFA', display: 'grid', placeItems: 'center', padding: '120px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: '560px', width: '100%' }}>
        
        {/* Eyebrow */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '24px' }}>
          <span style={{ width: '20px', height: '2px', background: '#F6A500' }} />
          Error 404
          <span style={{ width: '20px', height: '2px', background: '#F6A500' }} />
        </div>

        {/* Big numeral */}
        <div style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(120px, 20vw, 180px)',
          fontWeight: '800',
          lineHeight: 1,
          letterSpacing: '-0.06em',
          color: '#F6A500',
          marginBottom: '16px',
          textShadow: '0 20px 60px rgba(246, 165, 0, 0.15)',
        }}>
          404
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Page not <em style={{ fontStyle: 'italic', color: '#F6A500' }}>found.</em>
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.6, maxWidth: '420px', margin: '0 auto 40px' }}>
          The page you're looking for has been moved, renamed, or never existed. Let's get you back on track.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px',
              background: '#F6A500', color: '#fff',
              border: 'none', borderRadius: '8px',
              fontSize: '15px', fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            <Home size={16} /> Return Home
          </Link>
          <button
            onClick={() => window.history.back()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px',
              background: '#fff', color: '#111',
              border: '1px solid #EAEAEA', borderRadius: '8px',
              fontSize: '15px', fontWeight: '600',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div style={{ marginTop: '64px', paddingTop: '32px', borderTop: '1px solid #EAEAEA' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
            Popular Pages
          </div>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/marketplace" style={{ fontSize: '14px', color: '#111', textDecoration: 'none', fontWeight: '500' }}>
              Markets
            </Link>
            <Link to="/how-it-works" style={{ fontSize: '14px', color: '#111', textDecoration: 'none', fontWeight: '500' }}>
              How It Works
            </Link>
            <Link to="/faq" style={{ fontSize: '14px', color: '#111', textDecoration: 'none', fontWeight: '500' }}>
              FAQ
            </Link>
            <Link to="/support" style={{ fontSize: '14px', color: '#111', textDecoration: 'none', fontWeight: '500' }}>
              Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}