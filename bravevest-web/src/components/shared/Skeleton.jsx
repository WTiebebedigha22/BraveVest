import './Skeleton.css';

export default function Skeleton({ width = '100%', height = 16, radius = 6, className = '' }) {
  return <div className={'skel ' + className} style={{ width, height, borderRadius: radius }} aria-hidden />;
}
Skeleton.ProjectCard = function () {
  return (
    <div className="skel-card">
      <Skeleton height={160} radius={0} />
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Skeleton width="70%" height={18} /><Skeleton width="100%" height={14} /><Skeleton width="90%" height={14} /><Skeleton width="40%" height={22} />
      </div>
    </div>
  );
};
Skeleton.Grid = function ({ count = 3 }) {
  return <div className="grid grid-3">{Array.from({ length: count }).map((_, i) => <Skeleton.ProjectCard key={i} />)}</div>;
};
