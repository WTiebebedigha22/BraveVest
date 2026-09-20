// src/utils/firebaseAnalytics.js — Firebase Analytics events (disabled-safe)

import { analytics } from '@/lib/firebase';

export function fbTrack(name, params = {}) {
  if (!analytics) return;
  import('firebase/analytics').then(({ logEvent }) => {
    try { logEvent(analytics, name, params); } catch { /* best-effort */ }
  });
}

export const FbAnalytics = {
  pageView:      (path, title) => fbTrack('page_view', { page_path: path, page_title: title }),
  signUp:        (method) => fbTrack('sign_up', { method }),
  login:         (method) => fbTrack('login', { method }),
  kycSubmitted:  () => fbTrack('kyc_submitted'),
  investStart:   (slug, amount) => fbTrack('begin_checkout', { item_id: slug, value: amount, currency: 'NGN' }),
  investSuccess: (slug, amount) => fbTrack('purchase', { item_id: slug, value: amount, currency: 'NGN' }),
};
