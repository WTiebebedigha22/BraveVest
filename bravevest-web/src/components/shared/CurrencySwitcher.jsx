import { useState, useRef, useEffect } from 'react';
import { CURRENCIES, useCurrency } from '@/context/CurrencyContext';
import './CurrencySwitcher.css';

export default function CurrencySwitcher() {
  const { code, setCode } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="cur" ref={ref}>
      <button className="cur__btn" onClick={() => setOpen(!open)} aria-label="Change currency">
        <span className="cur__symbol">{CURRENCIES[code].symbol}</span>
        <span className="cur__code">{code}</span>
        <span className="cur__caret">▾</span>
      </button>

      {open && (
        <div className="cur__menu">
          {Object.values(CURRENCIES).map((c) => (
            <button
              key={c.code}
              className={`cur__item ${c.code === code ? 'is-active' : ''}`}
              onClick={() => { setCode(c.code); setOpen(false); }}
            >
              <span className="cur__item-symbol">{c.symbol}</span>
              <span className="cur__item-code">{c.code}</span>
              <span className="cur__item-label">{c.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
