import { createContext, useState, useCallback } from 'react';
import './ToastContext.css';

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const push = useCallback((message, variant = 'info') => {
    const id = Date.now() + Math.random();
    setItems((x) => [...x, { id, message, variant }]);
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 4000);
  }, []);

  const toast = {
    info: (m) => push(m, 'info'),
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toasts">
        {items.map((i) => (
          <div key={i.id} className={`toast toast--${i.variant}`}>{i.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
