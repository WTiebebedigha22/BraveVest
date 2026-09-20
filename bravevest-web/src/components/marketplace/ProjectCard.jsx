import { Link } from 'react-router-dom';
import Currency from '@/components/shared/Currency';
import './ProjectCard.css';

const categoryLabel = {
  REAL_ESTATE: 'Real Estate',
  AGRICULTURE: 'Agriculture',
  ENERGY: 'Energy',
  SME: 'SME',
  INFRASTRUCTURE: 'Infrastructure',
};

export default function ProjectCard({ project }) {
  const {
    slug, title, summary, category, coverImage,
    percentFunded = 0, expectedReturnPct, minInvestment,
  } = project;

  return (
    <Link to={`/marketplace/${slug}`} className="pcard">
      <div className="pcard__media">
        {coverImage ? (
          <img src={coverImage} alt={title} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        ) : null}
        <span className="pcard__cat">{categoryLabel[category] || category}</span>
      </div>
      <div className="pcard__body">
        <h3 className="pcard__title">{title}</h3>
        <p className="pcard__summary">{summary}</p>

        <div className="pcard__divider" />

        <div className="pcard__grid">
          <div>
            <div className="pcard__label">Target Return</div>
            <div className="pcard__stat pcard__stat--accent">{Number(expectedReturnPct).toFixed(1)}% <small>p.a.</small></div>
          </div>
          <div>
            <div className="pcard__label">Minimum</div>
            <div className="pcard__stat"><Currency value={minInvestment} /></div>
          </div>
        </div>

        <div className="pcard__progress">
          <div className="pcard__progress-bar" style={{ width: `${percentFunded}%` }} />
        </div>
        <div className="pcard__meta">
          <span>{percentFunded}% funded</span>
          <span>View details →</span>
        </div>
      </div>
    </Link>
  );
}
