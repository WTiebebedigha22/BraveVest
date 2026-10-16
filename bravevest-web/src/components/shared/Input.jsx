import './Input.css';

export default function Input({
  label,
  prefix,
  error,
  hint,
  className = '',
  ...rest
}) {
  return (
    <label className={`input ${className}`}>
      {label && <span className="input__label">{label}</span>}
      <span className={`input__wrap${prefix ? ' input__wrap--has-prefix' : ''}${error ? ' input__wrap--error' : ''}`}>
        {prefix && <span className="input__prefix">{prefix}</span>}
        <input className="input__field" {...rest} />
      </span>
      {error
        ? <span className="input__error" role="alert">{error}</span>
        : hint && <span className="input__hint">{hint}</span>}
    </label>
  );
}
