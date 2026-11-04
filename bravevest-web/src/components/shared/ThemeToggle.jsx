import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '36px', height: '36px', borderRadius: '8px',
        background: 'var(--bv-surface)', border: '1px solid var(--bv-border)',
        color: 'var(--bv-text)', cursor: 'pointer', transition: 'all 0.2s',
      }}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
