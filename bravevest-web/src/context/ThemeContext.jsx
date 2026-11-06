import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', setTheme: () => {}, toggle: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('bv_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  useEffect(() => {
    try { localStorage.setItem('bv_theme', theme); } catch {}
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;

    if (theme === 'dark') {
      document.body.style.background = '#0A0A0A';
      document.body.style.color = '#FFFFFF';
    } else {
      document.body.style.background = '#FAFAFA';
      document.body.style.color = '#0A0A0A';
    }
  }, [theme]);

  const setTheme = (t) => {
    if (t === 'light' || t === 'dark') setThemeState(t);
  };

  const toggle = () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
