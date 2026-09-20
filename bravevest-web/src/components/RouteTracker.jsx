import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, trackPageView } from '@/utils/analytics';
import { FbAnalytics } from '@/utils/firebaseAnalytics';

export default function RouteTracker() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => { initAnalytics(); }, []);

  useEffect(() => {
    const path = pathname + search + hash;
    const t = setTimeout(() => {
      trackPageView(path);
      FbAnalytics.pageView(path, document.title);
    }, 60);
    return () => clearTimeout(t);
  }, [pathname, search, hash]);

  return null;
}
