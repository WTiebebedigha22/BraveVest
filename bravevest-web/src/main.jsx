import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/global.css';
import './assets/styles/theme-overrides.css';
import './assets/styles/pop.css';
import './assets/styles/responsive.css';
import './assets/styles/premium.css';
import './styles/light-lock.css';
import { initScrollReveal, initParallax } from './utils/scroll-reveal';
import './styles/auth-light.css';
import './styles/light-only.css';
import './styles/dashboard-light.css';
import './styles/theme-tokens.css';
import { ThemeStyles, applyTheme } from './AppEnhancements';

// Apply saved (or device) theme on first paint — do NOT wipe it.
applyTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeStyles />
    <App />
  </React.StrictMode>
);

setTimeout(() => {
  initScrollReveal();
  initParallax();
}, 100);