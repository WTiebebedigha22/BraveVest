import './Input.css';

export default function Input({ label, error, hint, ...rest }) {
  return (
    <label className="input">
      {label && <span className="input__label">{label}</span>}
      <input className={`input__field ${error ? 'is-error' : ''}`} {...rest} />
      {error ? <span className="input__error">{error}</span>
        : hint ? <span className="input__hint">{hint}</span> : null}
    </label>
  );
}
