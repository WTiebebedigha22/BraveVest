import { useEffect, useState } from 'react';
import { connectionState } from '@/api/client';

export function useOnlineStatus() {
  const [online, setOnline] = useState(connectionState.online);
  useEffect(() => connectionState.subscribe(setOnline), []);
  return online;
}
