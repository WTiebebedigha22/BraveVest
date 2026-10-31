import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" style={{ display: 'inline-block', marginBottom: '16px', textDecoration: 'none' }}>
              <img
                src="/icons/logo-dark.png"
                alt="BraveVest"
                style={{ height: '32px', width: 'auto', display: 'block' }}
              />
            </Link>
            <p className="footer__tagline">Private credit and structured lending for institutional borrowers and discerning investors.</p>
          </div>
          <div>
            <div className="footer__h">Product</div>
            <div className="footer__links">
              <Link to="/marketplace">Markets</Link>
              <Link to="/how-it-works">How It Works</Link>
              <Link to="/faq">FAQ</Link>
            </div>
          </div>
          <div>
            <div className="footer__h">Company</div>
            <div className="footer__links">
              <Link to="/about">About</Link>
              <Link to="/support">Contact</Link>
              <Link to="/dashboard">Investor Portal</Link>
            </div>
          </div>
          <div>
            <div className="footer__h">Legal</div>
            <div className="footer__links">
              <Link to="/terms">Terms</Link>
              <Link to="/privacy">Privacy</Link>
              <Link to="/disclosures">Disclosures</Link>
              <Link to="/risk-disclosure">Risk Disclosure</Link>
            </div>
          </div>
        </div>
        <div className="footer__base">
          <div>© {new Date().getFullYear()} BraveVest. All rights reserved.</div>
          <div>SEC-Aligned · CBN-Regulated Partners</div>
        </div>
      </div>
    </footer>
  );
}
