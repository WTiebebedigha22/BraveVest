import { Navigate } from 'react-router-dom';
import PageShell from '@/components/shared/PageShell';

// /admin/dashboard is a legacy alias for /admin
export default function AdminDashboardRedirect() {
  return <Navigate to="/admin" replace />;
}
