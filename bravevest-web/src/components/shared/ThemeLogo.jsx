import { useEffect, useState } from 'react';

/**
 * ThemeLogo — swaps between dark and light logo images based on
 * the [data-theme] attribute on <html>.
 *
 * The Navbar and Footer should NOT use this — they stay dark regardless
 * of theme. Use ThemeLogo on auth pages, dashboard layout, and anywhere
 * else that needs a theme-aware logo.
 */
export function ThemeLogo({
  alt = 'BraveVest',
  className,
  height = 30,
  darkSrc = '/icons/logo-dark.png',
  lightSrc = '/icons/logo-light.png',
}) {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'dark';
    return document.documentElement.getAttribute('data-theme') || 'dark';
  });

  useEffect(() => {
    if (typeof MutationObserver === 'undefined') return;
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'dark');
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => obs.disconnect();
  }, []);

  return (
    <img
      src={theme === 'light' ? lightSrc : darkSrc}
      alt={alt}
      className={className}
      style={{ height, width: 'auto', display: 'block' }}
    />
  );
}

export default ThemeLogo;
