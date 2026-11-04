import { HashRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import ConnectionBanner from '@/components/shared/ConnectionBanner';
import AppRoutes from '@/routes/AppRoutes';
import { ThemeProvider } from '@/context/ThemeContext';

export default function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <CurrencyProvider>
          <ThemeProvider>
        <AuthProvider>
            <AppRoutes />
            <ConnectionBanner />
          </AuthProvider>
      </ThemeProvider>
        </CurrencyProvider>
      </ToastProvider>
    </HashRouter>
  );
}
