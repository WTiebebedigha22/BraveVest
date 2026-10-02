import './PageHeader.css';

export default function PageHeader({ title, subtitle, right, serif = true }) {
  return (
    <header className="page-header">
      <div>
        <h2 className={'page-header__title ' + (serif ? 'serif' : '')}>{title}</h2>
        {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
      </div>
      {right && <div className="page-header__right">{right}</div>}
    </header>
  );
}
