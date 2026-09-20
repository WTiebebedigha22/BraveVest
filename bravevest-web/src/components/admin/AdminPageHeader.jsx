import './AdminPageHeader.css';

export default function AdminPageHeader({ eyebrow, title, subtitle, right }) {
  return (
    <header className="aph">
      <div className="aph__left">
        {eyebrow && <div className="aph__eyebrow">{eyebrow}</div>}
        <h1 className="aph__title">{title}</h1>
        {subtitle && <p className="aph__subtitle">{subtitle}</p>}
      </div>
      {right && <div className="aph__right">{right}</div>}
    </header>
  );
}
