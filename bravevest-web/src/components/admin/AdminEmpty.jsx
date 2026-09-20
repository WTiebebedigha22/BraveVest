import './AdminEmpty.css';

export default function AdminEmpty({ icon, title, body, action }) {
  return (
    <div className="aempty">
      {icon && <div className="aempty__icon">{icon}</div>}
      <div className="aempty__title">{title}</div>
      {body && <p className="aempty__body">{body}</p>}
      {action && <div className="aempty__action">{action}</div>}
    </div>
  );
}
