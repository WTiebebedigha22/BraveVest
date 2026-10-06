import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'bv.onboarded';
type Ctx = { seen: boolean; ready: boolean; markSeen: () => void; reset: () => void };
const OnbCtx = createContext<Ctx | null>(null);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [seen, setSeen] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    (async () => {
      try { setSeen((await AsyncStorage.getItem(KEY)) === '1'); } catch {}
      setReady(true);
    })();
  }, []);
  const markSeen = useCallback(() => { setSeen(true); AsyncStorage.setItem(KEY, '1').catch(() => {}); }, []);
  const reset = useCallback(() => { setSeen(false); AsyncStorage.removeItem(KEY).catch(() => {}); }, []);
  return <OnbCtx.Provider value={{ seen, ready, markSeen, reset }}>{children}</OnbCtx.Provider>;
}
export function useOnboarding() {
  const v = useContext(OnbCtx);
  if (!v) throw new Error('useOnboarding must be used within OnboardingProvider');
  return v;
}
