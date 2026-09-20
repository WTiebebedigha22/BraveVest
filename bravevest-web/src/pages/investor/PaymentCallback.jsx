import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Button from '@/components/shared/Button';
import Loader from '@/components/shared/Loader';
import { paymentsApi } from '@/api/payments';
import './PaymentCallback.css';

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const reference = params.get('reference') || params.get('trxref');
  const [state, setState] = useState({ status: 'loading', message: '' });

  useEffect(() => {
    if (!reference) {
      setState({ status: 'error', message: 'Missing payment reference.' });
      return;
    }
    paymentsApi
      .verify(reference)
      .then((res) => {
        const ok = res.data?.success;
        setState({
          status: ok ? 'success' : 'error',
          message: ok ? 'Your investment is confirmed.' : (res.data?.transaction?.failureReason || 'Payment was not successful.'),
        });
      })
      .catch((err) => setState({ status: 'error', message: err?.response?.data?.message || 'Verification failed.' }));
  }, [reference]);

  return (
    <div className="container pcb">
      <div className="pcb__card">
        {state.status === 'loading' && <Loader label="Verifying payment" />}
        {state.status === 'success' && (
          <>
            <div className="pcb__icon pcb__icon--ok">✓</div>
            <h1 className="pcb__title">Payment confirmed</h1>
            <p className="pcb__sub">{state.message}</p>
            <div className="pcb__actions">
              <Button variant="primary" onClick={() => navigate('/investments')}>View investment</Button>
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>Dashboard</Button>
            </div>
          </>
        )}
        {state.status === 'error' && (
          <>
            <div className="pcb__icon pcb__icon--err">×</div>
            <h1 className="pcb__title">Payment issue</h1>
            <p className="pcb__sub">{state.message}</p>
            <div className="pcb__actions">
              <Button variant="primary" onClick={() => navigate('/marketplace')}>Back to marketplace</Button>
              <Link to="/wallet" className="pcb__link">View wallet</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
