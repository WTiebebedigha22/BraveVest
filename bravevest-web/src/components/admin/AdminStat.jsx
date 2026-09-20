import './AdminStat.css';

export default function AdminStat({ label, value, hint, delta, icon, accent }) {
  return (
    <div className={`astat ${accent ? 'astat--' + accent : ''}`}>
      <div className="astat__top">
        <div className="astat__label">{label}</div>
        {icon && <div className="astat__icon">{icon}</div>}
      </div>
      <div className="astat__value">{value}</div>
      <div className="astat__bottom">
        {delta && (
          <span className={`astat__delta ${delta.dir === 'down' ? 'is-down' : ''}`}>
            {delta.dir === 'down' ? '▼' : '▲'} {delta.value}
          </span>
        )}
        {hint && <span className="astat__hint">{hint}</span>}
      </div>
    </div>
  );
}
