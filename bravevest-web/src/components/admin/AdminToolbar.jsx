import './AdminToolbar.css';

export default function AdminToolbar({ children, right }) {
  return (
    <div className="atoolbar">
      <div className="atoolbar__left">{children}</div>
      {right && <div className="atoolbar__right">{right}</div>}
    </div>
  );
}

AdminToolbar.Search = function AdminToolbarSearch({ value, onChange, placeholder = 'Search…' }) {
  return (
    <div className="atoolbar__search">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

AdminToolbar.Pill = function AdminToolbarPill({ active, onClick, children }) {
  return (
    <button className={`atoolbar__pill ${active ? 'is-active' : ''}`} onClick={onClick}>
      {children}
    </button>
  );
};
