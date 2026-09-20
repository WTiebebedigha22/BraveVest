import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function RoleRoute({ role, children }) {
  const { user } = useAuth();
  if (!user || user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
}
