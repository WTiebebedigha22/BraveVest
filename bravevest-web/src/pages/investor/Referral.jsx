import { useEffect, useState } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';
import AdminStat from '@/components/admin/AdminStat';
import Loader from '@/components/shared/Loader';
import Button from '@/components/shared/Button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { referralsApi } from '@/api/referrals';
import './Referral.css';

export default function Referral() {
  const { user } = useAuth();
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    referralsApi.me()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const code = user?.email
    ? 'BV-' + user.email.split('@')[0].toUpperCase().slice(0, 8)
    : 'BV-YOURCODE';

  const link = typeof window !== 'undefined'
    ? window.location.origin + '/#/register?ref=' + code
    : '';

  function copyCode() {
    navigator.clipboard?.writeText(code);
    toast.success('Referral code copied');
  }
  function copyLink() {
    navigator.clipboard?.writeText(link);
    toast.success('Referral link copied');
  }
  function share() {
    if (navigator.share) {
      navigator.share({
        title: 'Join BraveVest',
        text: 'Invest in verified opportunities across real estate, agriculture and energy.',
        url: link,
      }).catch(() => {});
    } else {
      copyLink();
    }
  }

  if (loading) return <div className="text-center py-5"><Loader /></div>;

  return (
    <>
      <AdminPageHeader
        eyebrow="Referrals"
        title="Invite friends, earn rewards"
        subtitle="Every investor you refer earns you a bonus once they make their first investment"
      />

      <div className="ref-hero">
        <div className="ref-hero__mesh" aria-hidden />
        <div className="ref-hero__inner">
          <div className="ref-hero__label">Your referral code</div>
          <div className="ref-hero__code">{code}</div>
          <div className="ref-hero__actions">
            <Button variant="primary" size="md" onClick={copyCode}>Copy code</Button>
            <Button variant="secondary" size="md" onClick={copyLink}>Copy link</Button>
            <Button variant="secondary" size="md" onClick={share}>Share</Button>
          </div>
        </div>
      </div>

      <div className="ref-grid-3 mb-4">
        <AdminStat label="Investors referred" value={stats?.referred || 0} hint="All-time" />
        <AdminStat label="Rewards earned" value={'₦' + (stats?.earned || 0).toLocaleString()} hint="Paid out" accent="green" />
        <AdminStat label="Pending rewards" value={'₦' + (stats?.pending || 0).toLocaleString()} hint="Awaiting confirmation" accent="gold" />
      </div>

      <AdminCard padded={false} className="mb-4">
        <AdminCard.Header title="How it works" subtitle="Three steps" />
        <AdminCard.Body>
          <ol className="ref-steps">
            <li>
              <span className="ref-steps__n">1</span>
              <div>
                <div className="ref-steps__title">Share your link</div>
                <div className="ref-steps__body">Send your unique code or link to friends, family, or your network.</div>
              </div>
            </li>
            <li>
              <span className="ref-steps__n">2</span>
              <div>
                <div className="ref-steps__title">They register and invest</div>
                <div className="ref-steps__body">They complete KYC and make their first confirmed investment.</div>
              </div>
            </li>
            <li>
              <span className="ref-steps__n">3</span>
              <div>
                <div className="ref-steps__title">You get rewarded</div>
                <div className="ref-steps__body">Your bonus is credited to your wallet within 7 days.</div>
              </div>
            </li>
          </ol>
        </AdminCard.Body>
      </AdminCard>

      <AdminCard padded={false}>
        <AdminCard.Header title="Reward tiers" subtitle="More referrals, bigger rewards" />
        <AdminCard.Body>
          <div className="ref-tiers">
            {(stats?.tiers || [
              { threshold: 1, amount: 5000 },
              { threshold: 3, amount: 20000 },
              { threshold: 5, amount: 50000 },
            ]).map((r) => (
              <div key={r.threshold} className="ref-tier">
                <div className="ref-tier__tier">Refer {r.threshold} investor{r.threshold > 1 ? 's' : ''}</div>
                <div className="ref-tier__reward">₦{r.amount.toLocaleString()}</div>
                <div className="ref-tier__note">Credited after their first confirmed investment</div>
              </div>
            ))}
          </div>
        </AdminCard.Body>
      </AdminCard>

      <div className="ref-note">
        Rewards are credited to your BraveVest wallet. Terms apply.
      </div>
    </>
  );
}
