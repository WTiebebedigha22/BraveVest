import { useEffect, useRef, useState } from 'react';

export function useCountUp(target, duration = 400) {
  const [value, setValue] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const start = prev.current;
    const delta = target - start;
    const t0 = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      setValue(start + delta * p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else prev.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}
