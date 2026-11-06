import { useEffect } from 'react';

export function useScrollFade() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.bv-fade-up').forEach((el) => observer.observe(el));
    const mutation = new MutationObserver(() => {
      document.querySelectorAll('.bv-fade-up:not(.is-visible)').forEach((el) => observer.observe(el));
    });
    mutation.observe(document.body, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutation.disconnect(); };
  }, []);
}
