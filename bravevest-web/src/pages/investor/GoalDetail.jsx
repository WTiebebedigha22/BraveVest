import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';
import Loader from '@/components/shared/Loader';
import Currency from '@/components/shared/Currency';
import ProjectCard from '@/components/marketplace/ProjectCard';
import { goalsApi } from '@/api/goals';
import './GoalDetail.css';

export default function GoalDetail() {
  const { id } = useParams();
  const [goal, setGoal] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      goalsApi.list(),
      goalsApi.recommend(id),
    ])
      .then(([goals, recs]) => {
        setGoal(goals.find((g) => g.id === id) || null);
        setRecommendations(recs || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-5"><Loader /></div>;
  if (!goal) return <div className="text-center py-5">Goal not found. <Link to="/goals">← Back</Link></div>;

  return (
    <>
      <Link to="/goals" className="goald-back">← All goals</Link>
      <AdminPageHeader
        eyebrow="Goal"
        title={goal.name}
        subtitle={'Target ' + new Date(goal.targetDate).toLocaleDateString()}
      />

      <div className="goald-stats mb-4">
        <div className="goald-stat">
          <div className="goald-stat__label">Target</div>
          <div className="goald-stat__value"><Currency value={goal.targetAmount} /></div>
        </div>
        <div className="goald-stat">
          <div className="goald-stat__label">Current</div>
          <div className="goald-stat__value"><Currency value={goal.currentAmount} /></div>
        </div>
        <div className="goald-stat">
          <div className="goald-stat__label">Progress</div>
          <div className="goald-stat__value">
            {Number(goal.targetAmount) > 0 ? Math.round((Number(goal.currentAmount) / Number(goal.targetAmount)) * 100) : 0}%
          </div>
        </div>
      </div>

      <AdminCard padded={false}>
        <AdminCard.Header
          title="Recommended projects"
          subtitle="Matched to your timeline and risk profile"
        />
        <AdminCard.Body>
          {recommendations.length === 0 ? (
            <div className="text-muted">No matching projects right now. <Link to="/marketplace">Browse marketplace →</Link></div>
          ) : (
            <div className="grid grid-3">
              {recommendations.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </AdminCard.Body>
      </AdminCard>
    </>
  );
}
