import { useEffect } from 'react';

const SITE_NAME = 'BraveVest';
const SITE_URL  = 'https://wtiebebedigha22.github.io/BraveVest';

/**
 * Set <title>, meta description, canonical, and OG/Twitter tags per page.
 * Safe to call from any route component. Cleans up on unmount by restoring
 * the previous values so back-navigation doesn't leak title/desc.
 */
export function useSEO({
  title,
  description,
  canonical,
  image,
  type = 'website',
  noIndex = false,
}) {
  useEffect(() => {
    const prevTitle = document.title;
    const prevDesc = getMeta('name', 'description');
    const prevCanonical = getLink('canonical');
    const prevRobots = getMeta('name', 'robots');

    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME + ' — Access Verified Investment Opportunities';

    if (description) setMeta('name', 'description', description);
    if (canonical) setLink('canonical', SITE_URL + canonical);
    if (noIndex) setMeta('name', 'robots', 'noindex, nofollow');

    // OG + Twitter mirror
    setMeta('property', 'og:title', title || SITE_NAME);
    setMeta('property', 'og:description', description || '');
    setMeta('property', 'og:url', SITE_URL + (canonical || '/'));
    setMeta('property', 'og:type', type);
    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('name', 'twitter:image', image);
    }
    setMeta('name', 'twitter:title', title || SITE_NAME);
    setMeta('name', 'twitter:description', description || '');

    return () => {
      document.title = prevTitle;
      if (prevDesc) setMeta('name', 'description', prevDesc);
      if (prevCanonical) setLink('canonical', prevCanonical);
      if (prevRobots) setMeta('name', 'robots', prevRobots);
    };
  }, [title, description, canonical, image, type, noIndex]);
}

function setMeta(attr, key, value) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function getMeta(attr, key) {
  const el = document.head.querySelector(`meta[${attr}="${key}"]`);
  return el ? el.getAttribute('content') : '';
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function getLink(rel) {
  const el = document.head.querySelector(`link[rel="${rel}"]`);
  return el ? el.getAttribute('href') : '';
}
