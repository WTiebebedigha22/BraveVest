import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { paymentsApi } from '@/api/investments';

export default function PaymentCallback() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your payment…');

  useEffect(() => {
    const reference = params.get('reference') || params.get('trxref');
    if (!reference) {
      setStatus('error');
      setMessage('No payment reference found.');
      return;
    }
    paymentsApi.verify(reference)
      .then((result) => {
        if (result.status === 'SUCCESS' || result.status === 'success') {
          setStatus('success');
          setMessage('Payment confirmed. Your investment is now active.');
        } else {
          setStatus('pending');
          setMessage('Payment status: ' + (result.status || 'unknown') + '. This may take a few moments.');
        }
      })
      .catch((e) => {
        setStatus('error');
        setMessage(e?.response?.data?.message || 'Could not verify payment.');
      });
  }, [params]);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '24px', background: 'var(--bybit-black)' }}>
      <div className="card" style={{ maxWidth: '440px', width: '100%', textAlign: 'center', padding: '40px 24px' }}>
        {status === 'verifying' && <Loader size={48} color="var(--bybit-orange)" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />}
        {status === 'success' && <CheckCircle size={48} color="var(--bybit-green)" style={{ margin: '0 auto 16px' }} />}
        {status === 'error' && <XCircle size={48} color="var(--bybit-red)" style={{ margin: '0 auto 16px' }} />}
        {status === 'pending' && <Loader size={48} color="var(--bybit-yellow)" style={{ margin: '0 auto 16px' }} />}

        <h2 style={{ margin: '0 0 8px', fontSize: '20px' }}>
          {status === 'verifying' && 'Verifying…'}
          {status === 'success' && 'Payment Successful'}
          {status === 'error' && 'Payment Failed'}
          {status === 'pending' && 'Payment Pending'}
        </h2>
        <p style={{ color: 'var(--bybit-text-muted)', fontSize: '14px', marginBottom: '24px' }}>{message}</p>

        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button onClick={() => nav('/investments')} className="btn btn--primary">My Investments</button>
          <button onClick={() => nav('/dashboard')} className="btn btn--outline">Dashboard</button>
        </div>
      </div>
    </div>
  );
}
