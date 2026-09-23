import './Skeleton.css';

/**
 * Skeleton loading placeholders.
 * Usage:
 *   <Skeleton width="60%" height={24} />
 *   <Skeleton.ProjectCard />
 *   <Skeleton.StatCard />
 *   <Skeleton.TableRow />
 */
export default function Skeleton({ width = '100%', height = 16, radius = 6, className = '' }) {
  return (
    <div
      className={'skel ' + className}
      style={{ width, height, borderRadius: radius }}
      aria-hidden
    />
  );
}

Skeleton.ProjectCard = function SkeletonProjectCard() {
  return (
    <div className="skel-card">
      <Skeleton height={160} radius={0} />
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Skeleton width="70%" height={18} />
        <Skeleton width="100%" height={14} />
        <Skeleton width="90%" height={14} />
        <Skeleton width="40%" height={22} />
      </div>
    </div>
  );
};

Skeleton.StatCard = function SkeletonStatCard() {
  return (
    <div className="skel-stat">
      <Skeleton width="50%" height={11} />
      <Skeleton width="80%" height={28} style={{ marginTop: 12 }} />
      <Skeleton width="40%" height={11} style={{ marginTop: 8 }} />
    </div>
  );
};

Skeleton.TableRow = function SkeletonTableRow({ cols = 4 }) {
  return (
    <div className="skel-row" style={{ gridTemplateColumns: 'repeat(' + cols + ', 1fr)' }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} height={14} width={i === 0 ? '80%' : '60%'} />
      ))}
    </div>
  );
};

Skeleton.Grid = function SkeletonGrid({ count = 3, Component = Skeleton.ProjectCard }) {
  return (
    <div className="grid grid-3">
      {Array.from({ length: count }).map((_, i) => <Component key={i} />)}
    </div>
  );
};
