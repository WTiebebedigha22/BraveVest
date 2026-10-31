export default function Stat({ label, value, gold = false, size = 'big' }) {
  return (
    <div>
      <div className="micro-label" style={{ marginBottom: '16px' }}>
        {label}
      </div>
      <div className={`numeral numeral--${size}${gold ? ' numeral--gold' : ''}`}>
        {value}
      </div>
    </div>
  );
}
