import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Shield,
  Clock,
  TrendingUp,
  Users,
  Target,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
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

const CATEGORY_LABEL = {
  REAL_ESTATE: 'Real Estate',
  AGRICULTURE: 'Agriculture',
  ENERGY: 'Energy',
  SME: 'SME',
  INFRASTRUCTURE: 'Infrastructure',
};

const STATUS_META = {
  OPEN: { label: 'Open for investment', tone: 'success' },
  FUNDED: { label: 'Fully funded', tone: 'info' },
  CLOSED: { label: 'Closed', tone: 'muted' },
  DRAFT: { label: 'Coming soon', tone: 'muted' },
};

function formatRisk(level) {
  if (!level) return '—';
  const map = { low: 'Low', medium: 'Medium', high: 'High' };
  return map[String(level).toLowerCase()] || level;
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [investOpen, setInvestOpen] = useState(false);
  const [prefillAmount, setPrefillAmount] = useState(null);

  /* ---------- Data fetch ---------- */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setError(false);

    projectsApi
      .get(slug)
      .then((data) => {
        if (cancelled) return;
        setProject(data.data);
        Analytics.projectView(slug, data.data?.title);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.response?.status === 404) setNotFound(true);
        else setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  /* ---------- SEO ---------- */
  useSEO({
    title: project ? project.title : 'Project',
    description: project
      ? project.summary
      : 'View this investment opportunity on BraveVest.',
    canonical: '/#/marketplace/' + slug,
    type: 'article',
  });

  /* ---------- Derived values (safe before returns) ---------- */
  const target = Number(project?.targetAmount) || 0;
  const raised = Number(project?.raisedAmount) || 0;
  const remaining = Math.max(target - raised, 0);
  const percentFunded = Math.min(
    Math.max(Number(project?.percentFunded) || (target ? (raised / target) * 100 : 0), 0),
    100
  );
  const minInvestment = Number(project?.minInvestment) || 0;
  const expectedReturn = Number(project?.expectedReturnPct) || 0;
  const tenorMonths = Number(project?.tenorMonths) || 0;
  const investorCount = project?._count?.investments ?? 0;

  const canInvest =
    user &&
    user.kycStatus === 'APPROVED' &&
    project?.status === 'OPEN' &&
    remaining > 0;

  const isFullyFunded = project?.status === 'FUNDED' || (target > 0 && raised >= target);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="pd-loading">
        <style>{`
          .pd-loading {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 48px 16px;
          }
        `}</style>
        <Loader />
      </div>
    );
  }

  /* ---------- Error / Not found ---------- */
  if (notFound || error || !project) {
    return (
      <div className="pd-error">
        <style>{`
          .pd-error {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 48px 20px;
            text-align: center;
            background: #fafbfc;
          }
          .pd-error__icon {
            width: 64px;
            height: 64px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #eef0f4;
            color: #5b6472;
            margin-bottom: 20px;
          }
          .pd-error__title {
            font-size: clamp(22px, 3.5vw, 28px);
            font-weight: 700;
            color: #0a1628;
            margin: 0 0 8px;
            letter-spacing: -0.01em;
          }
          .pd-error__text {
            color: #5b6472;
            font-size: 15px;
            margin: 0 0 24px;
            max-width: 44ch;
            line-height: 1.55;
          }
          .pd-error__link {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 11px 18px;
            border-radius: 8px;
            background: #0a1628;
            color: #fff;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            transition: background 0.15s ease;
            -webkit-tap-highlight-color: transparent;
          }
          .pd-error__link:hover { background: #1a2842; }
          .pd-error__link:focus-visible {
            outline: 2px solid #b8860b;
            outline-offset: 2px;
          }
        `}</style>
        <div className="pd-error__icon">
          <AlertCircle size={28} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <h1 className="pd-error__title">
          {error ? 'Something went wrong' : 'Project not found'}
        </h1>
        <p className="pd-error__text">
          {error
            ? 'We could not load this project. Please try again in a moment.'
            : 'This project may have been closed or moved.'}
        </p>
        <Link to="/marketplace" className="pd-error__link">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to marketplace
        </Link>
      </div>
    );
  }

  /* ---------- Status badge ---------- */
  const statusMeta = STATUS_META[project.status] || { label: project.status, tone: 'muted' };

  return (
    <div className="pd">
      <style>{`
        /* ---------- Base ---------- */
        .pd {
          --pd-bg: #fafbfc;
          --pd-card: #ffffff;
          --pd-text: #0a1628;
          --pd-muted: #5b6472;
          --pd-border: #e6e8ec;
          --pd-border-strong: #d4d8df;
          --pd-gold: #b8860b;
          --pd-gold-soft: rgba(184, 134, 11, 0.10);
          --pd-success: #0a8a5c;
          --pd-success-soft: rgba(10, 138, 92, 0.10);
          --pd-info: #1d4ed8;
          --pd-info-soft: rgba(29, 78, 216, 0.10);
          --pd-shadow: 0 1px 2px rgba(10, 22, 40, 0.04), 0 4px 12px rgba(10, 22, 40, 0.04);

          background: var(--pd-bg);
          min-height: 100vh;
          color: var(--pd-text);
          font-family: var(--font-sans, system-ui, -apple-system, sans-serif);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          padding: clamp(16px, 3vw, 32px) 0 clamp(40px, 6vw, 64px);
        }
        .pd *,
        .pd *::before,
        .pd *::after { box-sizing: border-box; }

        .pd__container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 24px);
          width: 100%;
        }

        /* ---------- Back link ---------- */
        .pd__back {
          margin-bottom: clamp(16px, 2.5vw, 24px);
        }
        .pd__back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--pd-muted);
          text-decoration: none;
          padding: 6px 10px 6px 6px;
          border-radius: 8px;
          transition: color 0.15s ease, background 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }
        .pd__back-link:hover {
          color: var(--pd-text);
          background: rgba(10, 22, 40, 0.04);
        }
        .pd__back-link:focus-visible {
          outline: 2px solid var(--pd-gold);
          outline-offset: 2px;
        }

        /* ---------- Grid ---------- */
        .pd__grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 380px;
          gap: clamp(24px, 3vw, 40px);
          align-items: start;
        }
        @media (max-width: 960px) {
          .pd__grid { grid-template-columns: 1fr; }
        }

        /* ---------- Hero image ---------- */
        .pd__hero {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 16 / 9;
          background: linear-gradient(135deg, #e8ecf1 0%, #d4dae3 100%);
          margin-bottom: clamp(20px, 3vw, 28px);
          box-shadow: var(--pd-shadow);
        }
        .pd__hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .pd__hero-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9aa3af;
          font-size: 13px;
          font-weight: 500;
        }
        .pd__cat {
          position: absolute;
          top: 16px;
          left: 16px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: var(--pd-text);
          font-size: 12px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 9999px;
          letter-spacing: 0.01em;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
        }
        .pd__status {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 9999px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .pd__status--success { color: var(--pd-success); }
        .pd__status--info { color: var(--pd-info); }
        .pd__status--muted { color: var(--pd-muted); }

        /* ---------- Title / summary ---------- */
        .pd__title {
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
          margin: 0 0 12px;
          color: var(--pd-text);
          text-wrap: balance;
        }
        .pd__summary {
          font-size: clamp(15px, 1.8vw, 17px);
          line-height: 1.6;
          color: var(--pd-muted);
          margin: 0 0 clamp(24px, 3vw, 32px);
          max-width: 68ch;
        }

        /* ---------- Section headers ---------- */
        .pd__divider {
          height: 1px;
          background: var(--pd-border);
          margin: clamp(24px, 3vw, 32px) 0;
        }
        .pd__section-h {
          font-size: clamp(17px, 2vw, 20px);
          font-weight: 700;
          color: var(--pd-text);
          margin: 0 0 16px;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }
        .pd__body {
          font-size: 15px;
          line-height: 1.7;
          color: var(--pd-text);
          margin: 0 0 clamp(24px, 3vw, 32px);
          white-space: pre-line;
          max-width: 72ch;
        }

        /* ---------- Meta grid ---------- */
        .pd__meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          margin-bottom: clamp(24px, 3vw, 32px);
          padding: 20px;
          background: var(--pd-card);
          border: 1px solid var(--pd-border);
          border-radius: 12px;
        }
        .pd__meta-item { min-width: 0; }
        .pd__meta-label {
          font-size: 11.5px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--pd-muted);
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .pd__meta-value {
          font-size: 15px;
          font-weight: 600;
          color: var(--pd-text);
          line-height: 1.35;
          word-break: break-word;
        }

        /* ---------- Calculator ---------- */
        .pd__calculator {
          padding: clamp(20px, 3vw, 28px);
          background: var(--pd-card);
          border: 1px solid var(--pd-border);
          border-radius: 12px;
          box-shadow: var(--pd-shadow);
        }

        /* ---------- Sidebar ---------- */
        .pd__side {
          position: sticky;
          top: 24px;
        }
        @media (max-width: 960px) {
          .pd__side { position: static; }
        }

        .pd__stat-card {
          background: var(--pd-card);
          border: 1px solid var(--pd-border);
          border-radius: 16px;
          padding: clamp(20px, 3vw, 28px);
          box-shadow: var(--pd-shadow);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .pd__stat-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .pd__stat-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--pd-muted);
          margin-bottom: 6px;
          line-height: 1.3;
        }
        .pd__stat-big {
          font-size: clamp(28px, 3.5vw, 36px);
          font-weight: 700;
          color: var(--pd-text);
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .pd__stat-big small {
          font-size: 0.5em;
          font-weight: 500;
          color: var(--pd-muted);
          margin-left: 2px;
        }
        .pd__stat-badge {
          font-size: 12px;
          font-weight: 600;
          color: var(--pd-success);
          background: var(--pd-success-soft);
          padding: 5px 10px;
          border-radius: 9999px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .pd__progress {
          height: 8px;
          background: var(--pd-bg);
          border-radius: 9999px;
          overflow: hidden;
          position: relative;
        }
        .pd__progress-bar {
          height: 100%;
          background: linear-gradient(90deg, var(--pd-gold) 0%, #d4af37 100%);
          border-radius: 9999px;
          transition: width 0.4s ease;
        }

        .pd__stat-pair {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--pd-border);
        }
        .pd__stat-mid {
          font-size: 16px;
          font-weight: 700;
          color: var(--pd-text);
          line-height: 1.2;
          font-variant-numeric: tabular-nums;
        }

        .pd__notice {
          font-size: 13px;
          line-height: 1.5;
          color: var(--pd-muted);
          padding: 10px 12px;
          background: var(--pd-bg);
          border: 1px solid var(--pd-border);
          border-radius: 8px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .pd__notice svg {
          flex-shrink: 0;
          margin-top: 1px;
          color: var(--pd-muted);
        }

        .pd__cta {
          margin-top: 4px;
        }

        /* ---------- Mobile ---------- */
        @media (max-width: 640px) {
          .pd__hero { aspect-ratio: 4 / 3; border-radius: 12px; }
          .pd__cat, .pd__status { top: 12px; font-size: 11px; padding: 5px 10px; }
          .pd__cat { left: 12px; }
          .pd__status { right: 12px; }
          .pd__meta-grid { padding: 16px; }
          .pd__stat-pair { gap: 12px; }
        }

        /* ---------- Reduced motion ---------- */
        @media (prefers-reduced-motion: reduce) {
          .pd *, .pd *::before, .pd *::after {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
          }
        }

        /* ---------- Dark mode ---------- */
        @media (prefers-color-scheme: dark) {
          .pd {
            --pd-bg: #0a1020;
            --pd-card: #131c30;
            --pd-text: #f2f4f8;
            --pd-muted: #9aa6b8;
            --pd-border: #1f2a42;
            --pd-border-strong: #2d3a55;
            --pd-gold: #e0bd47;
            --pd-gold-soft: rgba(224, 189, 71, 0.12);
            --pd-success: #2dd4a0;
            --pd-success-soft: rgba(45, 212, 160, 0.12);
            --pd-info: #60a5fa;
            --pd-info-soft: rgba(96, 165, 250, 0.12);
            --pd-shadow: 0 1px 2px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.25);
          }
          .pd__hero { background: linear-gradient(135deg, #1a2338 0%, #131c30 100%); }
          .pd__hero-placeholder { color: #6b7688; }
          .pd__cat, .pd__status {
            background: rgba(19, 28, 48, 0.95);
            color: var(--pd-text);
          }
          .pd__status--success { color: var(--pd-success); }
          .pd__status--info { color: var(--pd-info); }
          .pd__status--muted { color: var(--pd-muted); }
          .pd__back-link:hover { background: rgba(255, 255, 255, 0.05); }
        }
      `}</style>

      <div className="pd__container">
        {/* ---------- Back ---------- */}
        <div className="pd__back">
          <Link to="/marketplace" className="pd__back-link">
            <ArrowLeft size={16} aria-hidden="true" />
            Marketplace
          </Link>
        </div>

        <div className="pd__grid">
          {/* ---------- Main column ---------- */}
          <div className="pd__main">
            {/* Hero */}
            <div className="pd__hero">
              {project.coverImage ? (
                <img
                  src={project.coverImage}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="pd__hero-placeholder">No image available</div>
              )}
              <span className="pd__cat">
                {CATEGORY_LABEL[project.category] || project.category}
              </span>
              {statusMeta && (
                <span className={`pd__status pd__status--${statusMeta.tone}`}>
                  {statusMeta.label}
                </span>
              )}
            </div>

            {/* Title / summary */}
            <h1 className="pd__title">{project.title}</h1>
            {project.summary && <p className="pd__summary">{project.summary}</p>}

            <div className="pd__divider" />

            <RiskDisclosure level={project.riskLevel || 'medium'} />
            <TrustBadges />

            {project.description && (
              <>
                <h2 className="pd__section-h">About this opportunity</h2>
                <p className="pd__body">{project.description}</p>
              </>
            )}

            {/* Meta */}
            <div className="pd__meta-grid">
              <div className="pd__meta-item">
                <div className="pd__meta-label">
                  <MapPin size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Location
                </div>
                <div className="pd__meta-value">{project.location || '—'}</div>
              </div>
              <div className="pd__meta-item">
                <div className="pd__meta-label">
                  <Shield size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Risk
                </div>
                <div className="pd__meta-value">{formatRisk(project.riskLevel)}</div>
              </div>
              <div className="pd__meta-item">
                <div className="pd__meta-label">
                  <Clock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Tenor
                </div>
                <div className="pd__meta-value">{tenorMonths} months</div>
              </div>
              <div className="pd__meta-item">
                <div className="pd__meta-label">
                  <TrendingUp size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Payout
                </div>
                <div className="pd__meta-value">{project.payoutFrequency || 'On maturity'}</div>
              </div>
            </div>

            {/* Calculator */}
            <div className="pd__calculator">
              <h2 className="pd__section-h">Calculate your returns</h2>
              <ReturnCalculator
                minInvestment={minInvestment}
                maxInvestment={remaining}
                returnPct={expectedReturn}
                tenorMonths={tenorMonths}
                payoutFreq={project.payoutFrequency || 'bullet'}
                onInvest={(amount) => {
                  setPrefillAmount(amount);
                  setInvestOpen(true);
                }}
              />
            </div>
          </div>

          {/* ---------- Sidebar ---------- */}
          <aside className="pd__side" aria-label="Investment summary">
            <div className="pd__stat-card">
              <div className="pd__stat-row">
                <div>
                  <div className="pd__stat-label">Projected return</div>
                  <div className="pd__stat-big">
                    {expectedReturn.toFixed(1)}%<small>p.a.</small>
                  </div>
                </div>
                <div
                  className="pd__stat-badge"
                  aria-label={`${percentFunded.toFixed(0)} percent funded`}
                >
                  {percentFunded.toFixed(0)}% funded
                </div>
              </div>

              <div
                className="pd__progress"
                role="progressbar"
                aria-valuenow={Math.round(percentFunded)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Funding progress"
              >
                <div
                  className="pd__progress-bar"
                  style={{ width: `${percentFunded}%` }}
                />
              </div>

              <div className="pd__stat-pair">
                <div>
                  <div className="pd__stat-label">Raised</div>
                  <div className="pd__stat-mid">
                    <Currency value={raised} />
                  </div>
                </div>
                <div>
                  <div className="pd__stat-label">Target</div>
                  <div className="pd__stat-mid">
                    <Currency value={target} />
                  </div>
                </div>
              </div>

              <div className="pd__stat-pair">
                <div>
                  <div className="pd__stat-label">Minimum</div>
                  <div className="pd__stat-mid">
                    <Currency value={minInvestment} />
                  </div>
                </div>
                <div>
                  <div className="pd__stat-label">Investors</div>
                  <div className="pd__stat-mid">{investorCount}</div>
                </div>
              </div>

              {/* CTA logic */}
              <div className="pd__cta">
                {!user ? (
                  <>
                    <div className="pd__notice">
                      <Lock size={14} aria-hidden="true" />
                      <span>Sign in to invest in this project.</span>
                    </div>
                    <Button
                      as={Link}
                      to="/login"
                      variant="primary"
                      size="lg"
                      style={{ width: '100%' }}
                    >
                      Sign in
                    </Button>
                  </>
                ) : canInvest ? (
                  <Button
                    variant="primary"
                    size="lg"
                    style={{ width: '100%' }}
                    onClick={() => {
                      setPrefillAmount(null);
                      setInvestOpen(true);
                    }}
                  >
                    Invest now
                  </Button>
                ) : isFullyFunded ? (
                  <div className="pd__notice">
                    <CheckCircle2
                      size={14}
                      aria-hidden="true"
                      style={{ color: 'var(--pd-success)' }}
                    />
                    <span>This project has reached its funding target.</span>
                  </div>
                ) : user.kycStatus !== 'APPROVED' ? (
                  <>
                    <div className="pd__notice">
                      <AlertCircle size={14} aria-hidden="true" />
                      <span>Complete KYC to invest.</span>
                    </div>
                    <Button
                      as={Link}
                      to="/kyc"
                      variant="primary"
                      size="lg"
                      style={{ width: '100%' }}
                    >
                      Continue KYC
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="secondary"
                    size="lg"
                    disabled
                    style={{ width: '100%' }}
                  >
                    Project not open
                  </Button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <InvestModal
        open={investOpen}
        onClose={() => {
          setInvestOpen(false);
          setPrefillAmount(null);
        }}
        project={project}
        defaultAmount={prefillAmount}
        onSuccess={() => setInvestOpen(false)}
      />
    </div>
  );
}