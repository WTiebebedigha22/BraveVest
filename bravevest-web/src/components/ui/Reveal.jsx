import useReveal from '../../hooks/useReveal';

export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  className = '',
  ...props
}) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
      {...props}
    >
      {children}
    </Tag>
  );
}
