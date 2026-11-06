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

// Light mode only — purge any persisted dark preference
try {
  localStorage.removeItem('theme');
  localStorage.removeItem('bravevest-theme');
  localStorage.removeItem('darkMode');
} catch {}
document.documentElement.removeAttribute('data-theme');
document.documentElement.classList.remove('dark');
document.documentElement.style.colorScheme = 'light';
document.documentElement.style.background = '#fafafa';
document.documentElement.style.color = '#1a1a1a';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize premium animations after render
setTimeout(() => {
  initScrollReveal();
  initParallax();
}, 100);
