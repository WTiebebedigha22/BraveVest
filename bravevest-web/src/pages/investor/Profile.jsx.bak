import { useEffect, useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';
import Loader from '@/components/shared/Loader';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { usersApi } from '@/api/users';
import './Profile.css';

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [edit, setEdit] = useState({ firstName: '', lastName: '', phone: '', image: '' });
  const [saving, setSaving] = useState(false);

  // Password form state
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    usersApi
      .me()
      .then((data) => {
        setProfile(data);
        setEdit({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          image: data.image || '',
        });
      })
      .catch(() => toast.error('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const dirty = profile && (
    edit.firstName !== (profile.firstName || '') ||
    edit.lastName !== (profile.lastName || '') ||
    edit.phone !== (profile.phone || '') ||
    edit.image !== (profile.image || '')
  );

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        firstName: edit.firstName.trim(),
        lastName: edit.lastName.trim(),
        phone: edit.phone.trim() || null,
        image: edit.image.trim() || null,
      };
      const updated = await usersApi.update(payload);
      setProfile(updated);
      // Sync AuthContext so the sidebar/initials update everywhere
      setUser((prev) => ({
        ...prev,
        firstName: updated.firstName,
        lastName: updated.lastName,
        phone: updated.phone,
        image: updated.image,
      }));
      toast.success('Profile updated');
    } catch (err) {
      const details = err?.response?.data?.details;
      const first = details && Object.keys(details)[0];
      toast.error(
        (err?.response?.data?.message || 'Failed to update') +
        (first ? ` — ${details[first][0]}` : '')
      );
    } finally {
      setSaving(false);
    }
  }

  async function changePassword(e) {
    e.preventDefault();
    if (pw.next !== pw.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    setChangingPw(true);
    try {
      await usersApi.changePassword(pw.current, pw.next);
      setPw({ current: '', next: '', confirm: '' });
      toast.success('Password changed — sign in again on other devices');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  }

  if (loading) return <div className="text-center py-5"><Loader /></div>;
  if (!profile) return <div className="text-center py-5">Profile unavailable.</div>;

  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <>
      <AdminPageHeader
        eyebrow="Account"
        title="Profile"
        subtitle="Your personal details and security"
      />

      {/* Identity header */}
      <div className="profile-hero">
        <div className="profile-hero__avatar">
          {profile.image ? (
            <img src={profile.image} alt="Avatar" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="profile-hero__meta">
          <div className="profile-hero__name">{profile.firstName} {profile.lastName}</div>
          <div className="profile-hero__email">{profile.email}</div>
          <div className="profile-hero__badges">
            <span className="profile-badge">{profile.role}</span>
            <span className={`profile-badge ${profile.kyc?.status === 'APPROVED' ? 'is-ok' : 'is-warn'}`}>
              KYC {profile.kyc?.status?.replace(/_/g, ' ') || 'Not started'}
            </span>
            {profile.emailVerified && <span className="profile-badge is-ok">Email verified</span>}
          </div>
        </div>
      </div>

      <div className="profile-grid">
        {/* Personal details */}
        <AdminCard padded={false}>
          <AdminCard.Header title="Personal details" subtitle="Visible to you only" />
          <AdminCard.Body>
            <form onSubmit={saveProfile}>
              <div className="profile-row">
                <Input
                  label="First name"
                  value={edit.firstName}
                  onChange={(e) => setEdit({ ...edit, firstName: e.target.value })}
                  required
                />
                <Input
                  label="Last name"
                  value={edit.lastName}
                  onChange={(e) => setEdit({ ...edit, lastName: e.target.value })}
                  required
                />
              </div>

              <Input
                label="Phone"
                value={edit.phone}
                onChange={(e) => setEdit({ ...edit, phone: e.target.value })}
                hint="Nigerian format e.g. 08012345678"
                placeholder="08012345678"
              />

              <Input
                label="Avatar URL"
                value={edit.image}
                onChange={(e) => setEdit({ ...edit, image: e.target.value })}
                hint="Paste a link to a square image (optional)"
                placeholder="https://…"
              />

              <div className="profile-readonly">
                <div className="profile-readonly__label">Email</div>
                <div className="profile-readonly__value">{profile.email}</div>
                <div className="profile-readonly__hint">Email changes require support contact</div>
              </div>

              <div className="profile-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEdit({
                    firstName: profile.firstName || '',
                    lastName: profile.lastName || '',
                    phone: profile.phone || '',
                    image: profile.image || '',
                  })}
                  disabled={!dirty || saving}
                >
                  Reset
                </Button>
                <Button type="submit" variant="primary" disabled={!dirty || saving}>
                  {saving ? 'Saving…' : 'Save changes'}
                </Button>
              </div>
            </form>
          </AdminCard.Body>
        </AdminCard>

        {/* Password */}
        <AdminCard padded={false}>
          <AdminCard.Header title="Security" subtitle="Change your password" />
          <AdminCard.Body>
            <form onSubmit={changePassword}>
              <Input
                label="Current password"
                type="password"
                value={pw.current}
                onChange={(e) => setPw({ ...pw, current: e.target.value })}
                required
                autoComplete="current-password"
              />
              <Input
                label="New password"
                type="password"
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
                required
                hint="Min 8 chars · uppercase · lowercase · number"
                autoComplete="new-password"
              />
              <Input
                label="Confirm new password"
                type="password"
                value={pw.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                required
                autoComplete="new-password"
              />

              <div className="profile-actions">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={changingPw || !pw.current || !pw.next || !pw.confirm}
                >
                  {changingPw ? 'Changing…' : 'Change password'}
                </Button>
              </div>

              <div className="profile-notice">
                <strong>Heads up:</strong> changing your password signs you out of every other device.
                This session stays active.
              </div>
            </form>
          </AdminCard.Body>
        </AdminCard>
      </div>
    </>
  );
}
