import { useEffect, useState } from 'react';
import { connectionState } from '@/api/client';
import './ConnectionBanner.css';

export default function ConnectionBanner() {
  const [online, setOnline] = useState(connectionState.online);
  const [wasOffline, setWasOffline] = useState(false);
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    return connectionState.subscribe((isOnline) => {
      setOnline(isOnline);
      if (!isOnline) {
        setWasOffline(true);
      } else if (wasOffline) {
        setShowBackOnline(true);
        setTimeout(() => setShowBackOnline(false), 3000);
      }
    });
  }, [wasOffline]);

  if (online && !showBackOnline) return null;

  return (
    <div className={'connbanner ' + (online ? 'is-back' : 'is-offline')} role="status" aria-live="polite">
      <span className="connbanner__icon">{online ? '✓' : '⚠'}</span>
      <span className="connbanner__text">
        {online
          ? 'You\'re back online'
          : 'You\'re offline — check your internet connection'}
      </span>
    </div>
  );
}
