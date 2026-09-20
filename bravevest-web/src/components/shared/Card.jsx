import './Card.css';

export default function Card({ children, className = '', ...rest }) {
  return <div className={`card ${className}`} {...rest}>{children}</div>;
}
Card.Header = ({ children, className = '' }) => <div className={`card__header ${className}`}>{children}</div>;
Card.Body = ({ children, className = '' }) => <div className={`card__body ${className}`}>{children}</div>;
Card.Footer = ({ children, className = '' }) => <div className={`card__footer ${className}`}>{children}</div>;
