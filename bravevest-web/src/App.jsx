import { HashRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import RouteTracker from '@/components/RouteTracker';
import AppRoutes from '@/routes/AppRoutes';

/*
  HashRouter — GitHub Pages is static (no server rewrites).
  URLs look like: https://wtiebebedigha22.github.io/BraveVest/#/marketplace/foo
*/
export default function App() {
  return (
    <HashRouter>
      <RouteTracker />
      <ToastProvider>
        <CurrencyProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </CurrencyProvider>
      </ToastProvider>
    </HashRouter>
  );
}
