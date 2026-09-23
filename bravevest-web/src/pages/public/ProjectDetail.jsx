import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '@/components/shared/Loader';
import Button from '@/components/shared/Button';
import Currency from '@/components/shared/Currency';
import InvestModal from '@/components/marketplace/InvestModal';
import ReturnCalculator from '@/components/marketplace/ReturnCalculator';
import RiskDisclosure from '@/components/marketplace/RiskDisclosure';
import TrustBadges from '@/components/shared/TrustBadges';
import { projectsApi } from '@/api/projects';
import { useAuth } from '@/hooks/useAuth';
import { useSEO } from '@/hooks/useSEO';
import { Analytics } from '@/utils/analytics';
import './ProjectDetail.css';

const categoryLabel = {
  REAL_ESTATE: 'Real Estate', AGRICULTURE: 'Agriculture', ENERGY: 'Energy',
  SME: 'SME', INFRASTRUCTURE: 'Infrastructure',
};

export default function ProjectDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [investOpen, setInvestOpen] = useState(false);
  const [prefillAmount, setPrefillAmount] = useState(null);

  useEffect(() => {
    setLoading(true);
    projectsApi
      .get(slug)
      .then((data) => {
        setProject(data.data);
        Analytics.projectView(slug, data.data?.title);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useSEO({
    title: project ? project.title : 'Project',
    description: project ? project.summary : 'View this investment opportunity on BraveVest.',
    canonical: '/#/marketplace/' + slug,
    type: 'article',
  });

  if (loading) return <div className="container text-center py-5"><Loader /></div>;
  if (notFound || !project) {
    return (
      <div className="container text-center py-5">
        <h2>Project not found</h2>
        <p className="text-muted mt-2">It may have been closed or moved.</p>
        <Link to="/marketplace" className="mt-3" style={{ display: 'inline-block', textDecoration: 'underline' }}>
          ← Back to marketplace
        </Link>
      </div>
    );
  }

  const canInvest = user && user.kycStatus === 'APPROVED' && project.status === 'OPEN';

  return (
    <div className="container pd">
      <div className="pd__back"><Link to="/marketplace">← Marketplace</Link></div>

      <div className="pd__grid">
        <div className="pd__main">
          <div className="pd__hero">
            {project.coverImage && <img src={project.coverImage} alt={project.title} />}
            <span className="pd__cat">{categoryLabel[project.category] || project.category}</span>
          </div>

          <h1 className="pd__title">{project.title}</h1>
          <p className="pd__summary">{project.summary}</p>

          <div className="pd__divider" />

          <RiskDisclosure level={project.riskLevel || 'medium'} />
          <TrustBadges />

          <h3 className="pd__section-h">About this opportunity</h3>
          <p className="pd__body">{project.description}</p>

          <div className="pd__meta-grid">
            <div><div className="pd__meta-label">Location</div><div className="pd__meta-value">{project.location || '—'}</div></div>
            <div><div className="pd__meta-label">Risk</div><div className="pd__meta-value">{project.riskLevel || '—'}</div></div>
            <div><div className="pd__meta-label">Tenor</div><div className="pd__meta-value">{project.tenorMonths} months</div></div>
            <div><div className="pd__meta-label">Payout</div><div className="pd__meta-value">{project.payoutFrequency || 'On maturity'}</div></div>
          </div>

          <div className="pd__calculator">
            <h3 className="pd__section-h">Calculate your returns</h3>
            <ReturnCalculator
              minInvestment={Number(project.minInvestment)}
              maxInvestment={Number(project.targetAmount) - Number(project.raisedAmount)}
              returnPct={Number(project.expectedReturnPct)}
              tenorMonths={Number(project.tenorMonths)}
              payoutFreq={project.payoutFrequency || 'bullet'}
              onInvest={(amount) => {
                setPrefillAmount(amount);
                setInvestOpen(true);
              }}
            />
          </div>
        </div>

        <aside className="pd__side">
          <div className="pd__stat-card">
            <div className="pd__stat-row">
              <div>
                <div className="pd__stat-label">Projected return</div>
                <div className="pd__stat-big">{Number(project.expectedReturnPct).toFixed(1)}% <small>p.a.</small></div>
              </div>
              <div className="pd__stat-badge">{project.percentFunded}% funded</div>
            </div>

            <div className="pd__progress"><div className="pd__progress-bar" style={{ width: project.percentFunded + '%' }} /></div>

            <div className="pd__stat-pair">
              <div>
                <div className="pd__stat-label">Raised</div>
                <div className="pd__stat-mid"><Currency value={project.raisedAmount} /></div>
              </div>
              <div>
                <div className="pd__stat-label">Target</div>
                <div className="pd__stat-mid"><Currency value={project.targetAmount} /></div>
              </div>
            </div>

            <div className="pd__stat-pair">
              <div>
                <div className="pd__stat-label">Minimum</div>
                <div className="pd__stat-mid"><Currency value={project.minInvestment} /></div>
              </div>
              <div>
                <div className="pd__stat-label">Investors</div>
                <div className="pd__stat-mid">{project._count?.investments ?? 0}</div>
              </div>
            </div>

            {user ? (
              canInvest ? (
                <Button variant="primary" size="lg" onClick={() => { setPrefillAmount(null); setInvestOpen(true); }}>
                  Invest now
                </Button>
              ) : user.kycStatus !== 'APPROVED' ? (
                <>
                  <div className="pd__notice">Complete KYC to invest.</div>
                  <Button as={Link} to="/kyc" variant="primary" size="lg">Continue KYC</Button>
                </>
              ) : (
                <Button variant="secondary" size="lg" disabled>Project not open</Button>
              )
            ) : (
              <>
                <div className="pd__notice">Sign in to invest.</div>
                <Button as={Link} to="/login" variant="primary" size="lg">Sign in</Button>
              </>
            )}
          </div>
        </aside>
      </div>

      <InvestModal
        open={investOpen}
        onClose={() => { setInvestOpen(false); setPrefillAmount(null); }}
        project={project}
        defaultAmount={prefillAmount}
        onSuccess={() => setInvestOpen(false)}
      />
    </div>
  );
}
