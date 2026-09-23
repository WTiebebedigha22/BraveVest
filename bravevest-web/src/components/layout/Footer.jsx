import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__mark" />
          <span className="footer__wordmark">BraveVest</span>
          <p className="text-muted mt-2">Curated investment opportunities. Made for Nigeria.</p>
        </div>
        <div className="footer__cols">
          <div>
            <div className="footer__h">Product</div>
            <a>Marketplace</a>
            <a>How It Works</a>
            <a>Pricing</a>
          </div>
          <div>
            <div className="footer__h">Company</div>
            <a>About</a>
            <a>Careers</a>
            <a>Contact</a>
          </div>
          <div>
            <div className="footer__h">Legal</div>
            <a>Terms</a>
            <a>Privacy</a>
            <a>Disclosures</a>
          </div>
        </div>
      </div>
      <div className="footer__base container">
        <span>© {new Date().getFullYear()} BraveVest. All rights reserved.</span>
        <span>Dev_Rei</span>
      </div>
    </footer>
  );
}
