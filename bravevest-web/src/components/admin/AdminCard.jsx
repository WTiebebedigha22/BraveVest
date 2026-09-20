import './AdminCard.css';

export default function AdminCard({ children, className = '', padded = true }) {
  return (
    <div className={`acard ${padded ? 'acard--pad' : ''} ${className}`}>
      {children}
    </div>
  );
}

AdminCard.Header = function AdminCardHeader({ title, subtitle, right }) {
  return (
    <div className="acard__header">
      <div>
        <div className="acard__title">{title}</div>
        {subtitle && <div className="acard__subtitle">{subtitle}</div>}
      </div>
      {right && <div className="acard__right">{right}</div>}
    </div>
  );
};

AdminCard.Body = function AdminCardBody({ children, className = '' }) {
  return <div className={`acard__body ${className}`}>{children}</div>;
};
