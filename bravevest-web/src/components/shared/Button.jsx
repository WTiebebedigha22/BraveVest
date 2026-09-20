import './Button.css';

export default function Button({
  children, variant = 'primary', size = 'md', as = 'button', className = '', ...rest
}) {
  const Comp = as;
  return (
    <Comp className={`btn btn--${variant} btn--${size} ${className}`} {...rest}>
      {children}
    </Comp>
  );
}
