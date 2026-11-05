import { useEffect, useRef } from 'react';

export function useAutoSave(key, value) {
  const timer = useRef();
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    }, 500);
    return () => clearTimeout(timer.current);
  }, [key, value]);
}

export function loadSaved(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
