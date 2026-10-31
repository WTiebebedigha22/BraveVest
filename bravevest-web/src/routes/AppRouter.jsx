import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';

// Public
import Home from '@/pages/public/Home';
import Marketplace from '@/pages/public/Marketplace';
import About from '@/pages/public/About';
import FAQ from '@/pages/public/FAQ';
import HowItWorks from '@/pages/public/HowItWorks';

// Wallet
import Deposit from '@/pages/wallet/Deposit';
import Withdraw from '@/pages/wallet/Withdraw';

// Auth
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

// Investor
import Dashboard from '@/pages/investor/Dashboard';

// Admin
import AdminDashboard from '@/pages/admin/AdminDashboard';

function Protected({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '64px', textAlign: 'center', color: '#888' }}>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.some((r) => (user.roles || [user.role]).includes(r))) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Public */}
        <Route index element={<Home />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="about" element={<About />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="how-it-works" element={<HowItWorks />} />

        {/* Wallet (Protected) */}
        <Route
          path="wallet/deposit"
          element={
            <Protected>
              <Deposit />
            </Protected>
          }
        />
        <Route
          path="wallet/withdraw"
          element={
            <Protected>
              <Withdraw />
            </Protected>
          }
        />

        {/* Investor (Protected) */}
        <Route
          path="dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />

        {/* Admin (Protected) */}
        <Route
          path="admin"
          element={
            <Protected roles={['ADMIN']}>
              <AdminDashboard />
            </Protected>
          }
        />
      </Route>

      {/* Auth — no navbar/footer */}
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
