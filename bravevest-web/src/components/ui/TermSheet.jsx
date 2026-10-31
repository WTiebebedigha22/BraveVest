export default function TermSheet({ title = 'Live Portfolio', ref_no = '№ 0042', children }) {
  return (
    <div className="term-sheet">
      <div className="term-sheet__header">
        <span className="micro-label">{title}</span>
        <span className="mono">{ref_no}</span>
      </div>
      {children}
    </div>
  );
}

export function TermRow({ label, value }) {
  return (
    <div className="term-sheet__row">
      <span className="term-sheet__label">{label}</span>
      <span className="term-sheet__value">{value}</span>
    </div>
  );
}
