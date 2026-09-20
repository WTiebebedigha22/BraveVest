/* eslint-disable */
// Google Analytics 4 wrapper — safe in SSR/no-window and when GA4_ID is empty.

const GA4_ID = 'G-XXXXXXXXXX';

let loaded = false;

function isReal() {
  return GA4_ID && !GA4_ID.startsWith('G-XXX') && typeof window !== 'undefined';
}

export function initAnalytics() {
  if (loaded || !isReal()) return;
  loaded = true;

  // Insert gtag script
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID, { send_page_view: false }); // we send manually
}

/** Send a page_view — call on every route change. */
export function trackPageView(path, title) {
  if (!isReal()) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
    page_location: window.location.href,
  });
}

/** Generic event — sign_up, login, invest, kyc_submitted, etc. */
export function trackEvent(name, params = {}) {
  if (!isReal()) {
    if (import.meta.env.DEV) console.debug('[analytics:event]', name, params);
    return;
  }
  window.gtag('event', name, params);
}

export const Analytics = {
  signUp:        (method) => trackEvent('sign_up', { method }),
  login:         (method) => trackEvent('login', { method }),
  logout:        () => trackEvent('logout'),
  kycStarted:    (step) => trackEvent('kyc_started', { step }),
  kycStep:       (step) => trackEvent('kyc_step_completed', { step }),
  kycSubmitted:  () => trackEvent('kyc_submitted'),
  projectView:   (slug, title) => trackEvent('view_item', { item_id: slug, item_name: title, item_category: 'investment' }),
  investStart:   (slug, amount) => trackEvent('begin_checkout', { item_id: slug, value: amount, currency: 'NGN' }),
  investSuccess: (slug, amount) => trackEvent('purchase', { item_id: slug, value: amount, currency: 'NGN' }),
  paymentInit:   (ref, amount) => trackEvent('payment_initiated', { transaction_id: ref, value: amount, currency: 'NGN' }),
  currencySwitch:(code) => trackEvent('currency_switch', { currency: code }),
  search:        (term) => trackEvent('search', { search_term: term }),
  share:         (method, content) => trackEvent('share', { method, content_type: content }),
};
