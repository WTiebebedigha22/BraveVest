import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/global.css';
import './assets/styles/responsive.css';
import './assets/styles/premium.css';
import { initScrollReveal, initParallax } from './utils/scroll-reveal';


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
