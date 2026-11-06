import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TickerBar from './TickerBar';
import { useScrollFade } from '@/hooks/useScrollFade';

export default function PageShell({
  children,
  theme = 'dark',
  ticker = false,
  navbar = true,
  footer = true,
}) {
  useScrollFade();

  return (
    <div
      className={theme === 'dark' ? 'bv-dark' : 'bv-light'}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {navbar && <Navbar />}
      {ticker && <TickerBar />}
      <main style={{ flex: 1 }}>{children}</main>
      {footer && <Footer />}
    </div>
  );
}
