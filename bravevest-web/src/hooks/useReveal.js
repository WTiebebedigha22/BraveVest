import { useEffect, useRef } from 'react';

// Automatically adds .reveal to children when they enter the viewport
export function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.classList.add('reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

// Apply reveal to all sections and cards automatically
export function useAutoReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    const els = document.querySelectorAll('section, .card, .reveal-target');
    els.forEach((el, i) => {
      if (el.classList.contains('is-visible')) return;
      el.classList.add('reveal');
      if (i < 8) el.classList.add('reveal-delay-' + Math.min(4, i));
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}
