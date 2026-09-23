import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '@/components/shared/Modal';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { investmentsApi } from '@/api/investments';
import { paymentsApi } from '@/api/payments';
import { formatNaira } from '@/utils/format';
import { useToast } from '@/hooks/useToast';
import './InvestModal.css';

export default function InvestModal({ open, onClose, project, defaultAmount, onSuccess }) {
  const nav = useNavigate();
  const toast = useToast();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && project) {
      const initial = defaultAmount || Number(project.minInvestment) || '';
      setAmount(initial ? String(initial) : '');
      setError('');
    }
  }, [open, project, defaultAmount]);

  if (!project) return null;

  const min = Number(project.minInvestment);
  const max = Number(project.targetAmount) - Number(project.raisedAmount);
  const expectedReturn = amount ? (Number(amount) * Number(project.expectedReturnPct)) / 100 : 0;

  async function submit() {
    setError('');
    const num = Number(amount);
    if (!num || num < min) { setError('Minimum investment is ' + formatNaira(min)); return; }
    if (num > max) { setError('Only ' + formatNaira(max) + ' left to fund'); return; }

    setLoading(true);
    try {
      const inv = await investmentsApi.create({ projectId: project.id, amount: num });
      const payment = await paymentsApi.initialize(inv.data.id);
      if (payment.data?.authorizationUrl) {
        window.location.href = payment.data.authorizationUrl;
      } else {
        toast.success('Investment created — awaiting payment');
        onSuccess?.();
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Unable to start investment';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={'Invest in ' + project.title}>
      <div className="invest-modal">
        <Input
          label="Amount (₦)"
          type="number"
          min={min}
          max={max}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          hint={'Min ' + formatNaira(min) + ' · Remaining ' + formatNaira(max)}
          error={error}
        />
        <div className="invest-modal__summary">
          <div className="invest-modal__row">
            <span>Expected return</span>
            <strong className="invest-modal__accent">{formatNaira(expectedReturn)}</strong>
          </div>
          <div className="invest-modal__row">
            <span>Return rate</span>
            <strong>{Number(project.expectedReturnPct).toFixed(1)}% p.a.</strong>
          </div>
          <div className="invest-modal__row">
            <span>Tenor</span>
            <strong>{project.tenorMonths} months</strong>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" onClick={submit} disabled={loading}>
          {loading ? 'Starting…' : 'Continue to payment'}
        </Button>
      </div>
    </Modal>
  );
}
