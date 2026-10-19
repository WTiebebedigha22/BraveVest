import { useCallback, useEffect, useState } from 'react';
import { kycApi } from '@/api/kyc';

export function useKyc() {
  const [profile, setProfile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const r = await kycApi.get();
      setProfile(r?.profile ?? r);
      setDocuments(r?.documents ?? []);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  const saveStep = useCallback(async (step, payload) => {
    const updated = await kycApi.saveStep(step, payload);
    setProfile(updated);
    return updated;
  }, []);

  const upload = useCallback(async (file, type) => {
    const doc = await kycApi.upload(file, type);
    setDocuments((d) => [doc, ...d]);
    return doc;
  }, []);

  const submit = useCallback(async () => {
    const updated = await kycApi.submit();
    setProfile(updated);
    return updated;
  }, []);

  return { profile, documents, loading, error, refetch, saveStep, upload, submit };
}
