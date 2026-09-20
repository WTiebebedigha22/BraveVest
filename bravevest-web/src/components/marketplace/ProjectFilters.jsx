import './ProjectFilters.css';

const cats = [
  { v: '', l: 'All' },
  { v: 'REAL_ESTATE', l: 'Real Estate' },
  { v: 'AGRICULTURE', l: 'Agriculture' },
  { v: 'ENERGY', l: 'Energy' },
  { v: 'SME', l: 'SME' },
  { v: 'INFRASTRUCTURE', l: 'Infrastructure' },
];

export default function ProjectFilters({ value, onChange }) {
  return (
    <div className="filters">
      {cats.map((c) => (
        <button
          key={c.v}
          className={`filters__pill ${value === c.v ? 'is-active' : ''}`}
          onClick={() => onChange(c.v)}
        >
          {c.l}
        </button>
      ))}
    </div>
  );
}
