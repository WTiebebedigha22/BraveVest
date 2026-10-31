export default function Button({
  children,
  variant = 'primary',
  as = 'button',
  className = '',
  ...props
}) {
  const cls = ['btn', `btn--${variant}`, className].filter(Boolean).join(' ');
  const Tag = as;
  return (
    <Tag className={cls} {...props}>
      <span>{children}</span>
    </Tag>
  );
}
