import { useEffect, useState } from 'react';
import { connectionState } from '@/api/client';
import './ConnectionBanner.css';

export default function ConnectionBanner() {
  const [online, setOnline] = useState(connectionState.online);
  const [wasOffline, setWasOffline] = useState(false);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => connectionState.subscribe((o) => {
    setOnline(o);
    if (!o) setWasOffline(true);
    else if (wasOffline) { setShowBack(true); setTimeout(() => setShowBack(false), 3000); }
  }), [wasOffline]);

  if (online && !showBack) return null;
  return (
    <div className={'connbanner ' + (online ? 'is-back' : 'is-offline')}>
      <span>{online ? '✓' : '⚠'}</span>
      <span>{online ? "You're back online" : "You're offline — check your internet"}</span>
    </div>
  );
}
