import PageHeader from '@/components/shared/PageHeader';
import { useAuth } from '@/hooks/useAuth';
export default function Profile() {
  const { user } = useAuth();
  return (
    <>
      <PageHeader title="Profile" subtitle="Your account details." />
      <div className="dash-card" style={{ maxWidth: 480 }}>
        <div style={{ marginBottom: 12 }}><strong>{user?.firstName} {user?.lastName}</strong></div>
        <div className="text-muted" style={{ fontSize: 13 }}>{user?.email}</div>
        <div className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>Role: {user?.role}</div>
      </div>
    </>
  );
}
