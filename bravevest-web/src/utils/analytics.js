const GA4_ID = import.meta.env.VITE_GA4_ID || '';
let loaded = false;
function isReal() { return GA4_ID && !GA4_ID.startsWith('G-XXX') && typeof window !== 'undefined'; }

export function initAnalytics() {
  if (loaded || !isReal()) return;
  loaded = true;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID, { send_page_view: false });
}

export function trackPageView(path, title) {
  if (!isReal()) return;
  window.gtag('event', 'page_view', { page_path: path, page_title: title || document.title });
}

export function trackEvent(name, params = {}) {
  if (!isReal()) return;
  window.gtag('event', name, params);
}

export const Analytics = {
  signUp: (m) => trackEvent('sign_up', { method: m }),
  login: (m) => trackEvent('login', { method: m }),
  projectView: (slug, title) => trackEvent('view_item', { item_id: slug, item_name: title, item_category: 'investment' }),
  investStart: (slug, amount) => trackEvent('begin_checkout', { item_id: slug, value: amount, currency: 'NGN' }),
  investSuccess: (slug, amount) => trackEvent('purchase', { item_id: slug, value: amount, currency: 'NGN' }),
  search: (term) => trackEvent('search', { search_term: term }),
};
