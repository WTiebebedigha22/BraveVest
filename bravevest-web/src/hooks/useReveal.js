import { useEffect, useRef } from 'react';

/**
 * Attaches an IntersectionObserver to the element ref and toggles
 * the `is-visible` class when it enters the viewport.
 */
export default function useReveal({ threshold = 0.15, once = true } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return ref;
}
