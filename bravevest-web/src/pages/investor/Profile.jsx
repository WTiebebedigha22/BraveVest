import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Shield, AlertTriangle, CheckCircle, KeyRound, Mail, Phone, Landmark, FileText, LogOut, ArrowRight, Copy } from 'lucide-react';
import { api } from '@/api/client';
import { useAuth } from '@/hooks/useAuth';

export default function Profile() {
  const { user, logout } = useAuth();
  const [me, setMe] = useState(null);
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/users/me').then(r => r.data?.user || r.data?.data || r.data).catch(() => null),
      api.get('/api/kyc').then(r => r.data?.data || r.data || null).catch(() => null),
    ]).then(([u, k]) => {
      setMe(u);
      setKyc(k);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-light" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: '#888' }}>
        Loading profile…
      </div>
    );
  }

  const kycStatus = kyc?.status || me?.kycStatus || 'NOT_STARTED';
  const isApproved = kycStatus === 'APPROVED';
  const isPending = kycStatus === 'PENDING' || kycStatus === 'UNDER_REVIEW';
  const isRejected = kycStatus === 'REJECTED';

  const statusMeta = {
    APPROVED:      { label: 'Verified',      color: '#0ECB81', bg: 'rgba(14,203,129,0.1)',  icon: CheckCircle },
    PENDING:       { label: 'Under Review',  color: '#F6A500', bg: 'rgba(246,165,0,0.1)',   icon: AlertTriangle },
    UNDER_REVIEW:  { label: 'Under Review',  color: '#F6A500', bg: 'rgba(246,165,0,0.1)',   icon: AlertTriangle },
    REJECTED:      { label: 'Rejected',      color: '#F6465D', bg: 'rgba(246,70,93,0.1)',   icon: AlertTriangle },
    NOT_STARTED:   { label: 'Not Started',   color: '#888',    bg: '#F5F5F5',               icon: Shield },
  }[kycStatus] || { label: 'Not Started', color: '#888', bg: '#F5F5F5', icon: Shield };
  const StatusIcon = statusMeta.icon;

  return (
    <div className="page-light" style={{ minHeight: '100vh', background: '#FAFAFA', paddingBottom: '64px' }}>
      
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EAEAEA', padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#F6A500', textTransform: 'uppercase', letterSpacing: '0.16em' }}>Account</span>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111', margin: '8px 0 4px' }}>Profile</h1>
          <p style={{ fontSize: '15px', color: '#666', margin: 0 }}>Your verified identity and account settings.</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '900px', paddingTop: '32px' }}>

        {/* ── KYC Status Card ── */}
        <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: '16px', padding: '28px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${statusMeta.color}, transparent)` }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                Identity Verification
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: statusMeta.bg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StatusIcon size={20} color={statusMeta.color} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#111' }}>{statusMeta.label}</div>
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '2px' }}>
                    {isApproved && 'Your identity has been confirmed against official records.'}
                    {isPending && 'Our compliance team is reviewing your submission (1–2 business days).'}
                    {isRejected && 'Your submission did not pass verification.'}
                    {!isApproved && !isPending && !isRejected && 'Complete KYC to unlock deposits, investments, and withdrawals.'}
                  </div>
                </div>
              </div>
            </div>
            {!isApproved && (
              <Link to="/kyc" style={{ padding: '12px 24px', background: '#F6A500', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: '600', textDecoration: 'none' }}>
                {isRejected ? 'Resubmit KYC' : isPending ? 'View Submission' : 'Start KYC'}
              </Link>
            )}
          </div>

          {isRejected && kyc?.rejectionNote && (
            <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(246,70,93,0.05)', borderLeft: '3px solid #F6465D', borderRadius: '4px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F6465D', marginBottom: '6px', fontWeight: '600' }}>
                Rejection Reason
              </div>
              <div style={{ fontSize: '13px', color: '#111', lineHeight: 1.6 }}>{kyc.rejectionNote}</div>
            </div>
          )}

          {isApproved && kyc?.reviewedAt && (
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #EAEAEA', display: 'flex', gap: '40px', fontSize: '13px', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Verified On</div>
                <div style={{ color: '#111', fontWeight: '500' }}>{new Date(kyc.reviewedAt).toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
              </div>
              {kyc.reviewedById && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Approver Reference</div>
                  <div style={{ fontFamily: 'monospace', color: '#111', fontSize: '12px' }}>{kyc.reviewedById.slice(-8)}</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Legal Identity ── */}
        <SectionCard
          title="Legal Identity"
          locked={isApproved}
          footer={isApproved && (
            <>
              <Lock size={12} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              These details were verified against your submitted documents. To update any of them, contact{' '}
              <Link to="/support" style={{ color: '#F6A500', textDecoration: 'underline' }}>support</Link>{' '}
              to initiate re-verification.
            </>
          )}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px 40px' }}>
            <Field label="First Name" value={me?.firstName} locked={isApproved} />
            <Field label="Last Name" value={me?.lastName} locked={isApproved} />
            <Field label="Date of Birth" value={kyc?.dateOfBirth ? new Date(kyc.dateOfBirth).toLocaleDateString('en-NG') : '—'} locked={isApproved} />
            <Field label="Nationality" value={kyc?.nationality || '—'} locked={isApproved} />
            <Field label="ID Type" value={kyc?.idType || '—'} locked={isApproved} />
            <Field label="ID Number" value={kyc?.idNumber ? `•••• •••• ${kyc.idNumber.slice(-4)}` : '—'} locked={isApproved} masked />
          </div>
        </SectionCard>

        {/* ── Contact Info ── */}
        <SectionCard title="Contact Information">
          <div style={{ display: 'grid', gap: '20px' }}>
            <EditableField
              icon={Mail}
              label="Email Address"
              value={me?.email}
              verified={me?.emailVerified}
              note="Changing your email requires re-verification."
            />
            <EditableField
              icon={Phone}
              label="Phone Number"
              value={me?.phone || 'Not set'}
              verified={!!me?.phone}
              note="Changing your phone requires OTP verification."
            />
          </div>
        </SectionCard>

        {/* ── Settlement Account ── */}
        <SectionCard
          title="Settlement Account"
          locked={isApproved}
          footer={isApproved && (
            <>
              <Landmark size={12} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              Payouts to this account have been verified against your legal name. To change the account, contact{' '}
              <Link to="/support" style={{ color: '#F6A500', textDecoration: 'underline' }}>support</Link>.
            </>
          )}
        >
          {kyc?.bankName ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px 40px' }}>
              <Field label="Bank" value={kyc.bankName} locked={isApproved} />
              <Field label="Account Name" value={kyc.accountName} locked={isApproved} />
              <Field label="Account Number" value={kyc.accountNumber ? `•••••${kyc.accountNumber.slice(-4)}` : '—'} masked locked={isApproved} />
            </div>
          ) : (
            <div style={{ fontSize: '14px', color: '#666' }}>
              No settlement account on file. Complete KYC to add one.
            </div>
          )}
        </SectionCard>

        {/* ── Security ── */}
        <SectionCard title="Security">
          <div style={{ display: 'grid', gap: '0' }}>
            <SecurityRow
              icon={KeyRound}
              label="Password"
              description="Change your password regularly for security"
              action="Change"
              href="/settings/password"
            />
            <SecurityRow
              icon={Shield}
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              action="Enable"
              href="/settings/2fa"
              status="Not Enabled"
              statusType="warning"
            />
            <SecurityRow
              icon={FileText}
              label="Active Sessions"
              description="Manage devices signed into your account"
              action="Review"
              href="/settings/sessions"
            />
            <SecurityRow
              icon={FileText}
              label="Download Your Data"
              description="Request a copy of all data we hold on you"
              action="Request"
              href="/settings/data-export"
              last
            />
          </div>
        </SectionCard>

        {/* ── Danger Zone ── */}
        <div style={{ background: '#fff', border: '1px solid rgba(246,70,93,0.3)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <AlertTriangle size={18} color="#F6465D" />
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#F6465D', margin: 0 }}>Account Closure</h3>
          </div>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px', lineHeight: 1.6 }}>
            Account closure is a manual process to ensure the security of your funds. You must first withdraw all balances and close all investments. Then contact support.
          </p>
          <Link to="/support" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', background: 'transparent', color: '#F6465D', border: '1px solid rgba(246,70,93,0.3)', borderRadius: '8px', fontSize: '13px', fontWeight: '600', textDecoration: 'none' }}>
            Contact Support to Close Account <ArrowRight size={14} />
          </Link>
        </div>

        {/* Sign Out */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <button
            onClick={logout}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', color: '#666', border: '1px solid #EAEAEA', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}

/* ── Helpers ── */

function SectionCard({ title, locked, children, footer }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #EAEAEA', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111', margin: 0 }}>{title}</h3>
        {locked && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', background: '#F5F5F5', color: '#666', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
            <Lock size={10} /> Locked
          </span>
        )}
      </div>
      {children}
      {footer && (
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #EAEAEA', fontSize: '12px', color: '#666', lineHeight: 1.6 }}>
          {footer}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, locked, masked }) {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: masked ? 'monospace' : 'inherit', fontSize: '14px', color: value && value !== '—' ? '#111' : '#AAA', fontWeight: '500' }}>
        {value || '—'}
        {locked && <Lock size={12} color="#AAA" />}
      </div>
    </div>
  );
}

function EditableField({ icon: Icon, label, value, verified, note }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderTop: '1px solid #EAEAEA' }}>
      <div style={{ width: '40px', height: '40px', background: '#F5F5F5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color="#666" strokeWidth={1.75} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
          {verified && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 8px', background: 'rgba(14,203,129,0.1)', color: '#0ECB81', borderRadius: '4px', fontSize: '10px', fontWeight: '600' }}>
              <CheckCircle size={10} /> Verified
            </span>
          )}
        </div>
        <div style={{ fontSize: '14px', color: '#111', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{note}</div>
      </div>
      <button style={{ padding: '8px 16px', background: 'transparent', color: '#111', border: '1px solid #EAEAEA', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>
        Change
      </button>
    </div>
  );
}

function SecurityRow({ icon: Icon, label, description, action, href, status, statusType, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderTop: '1px solid #EAEAEA', borderBottom: last ? '1px solid #EAEAEA' : 'none' }}>
      <div style={{ width: '40px', height: '40px', background: '#F5F5F5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={18} color="#666" strokeWidth={1.75} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', color: '#111', fontWeight: '600' }}>{label}</div>
        <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{description}</div>
      </div>
      {status && (
        <span style={{ padding: '4px 10px', background: statusType === 'warning' ? 'rgba(246,70,93,0.1)' : '#F5F5F5', color: statusType === 'warning' ? '#F6465D' : '#666', borderRadius: '4px', fontSize: '11px', fontWeight: '600', whiteSpace: 'nowrap' }}>
          {status}
        </span>
      )}
      <Link to={href} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '8px 14px', background: 'transparent', color: '#111', border: '1px solid #EAEAEA', borderRadius: '6px', fontSize: '12px', fontWeight: '600', textDecoration: 'none', whiteSpace: 'nowrap' }}>
        {action} <ArrowRight size={12} />
      </Link>
    </div>
  );
}