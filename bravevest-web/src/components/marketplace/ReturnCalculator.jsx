import { useState, useMemo } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import Button from '@/components/shared/Button';
import './ReturnCalculator.css';

/**
 * Interactive investment calculator.
 * Props:
 *   minInvestment  — minimum amount (NGN)
 *   maxInvestment  — maximum amount (NGN) — optional
 *   returnPct      — expected annual return %
 *   tenorMonths    — investment tenor in months
 *   payoutFreq     — 'monthly' | 'quarterly' | 'annually' | 'bullet'
 *   onInvest       — callback(amount)
 */
export default function ReturnCalculator({
  minInvestment = 50000,
  maxInvestment,
  returnPct = 15,
  tenorMonths = 12,
  payoutFreq = 'quarterly',
  onInvest,
}) {
  const { format } = useCurrency();
  const [amount, setAmount] = useState(minInvestment);

  const calc = useMemo(() => {
    const principal = Number(amount) || 0;
    const rate = Number(returnPct) / 100;
    const years = Number(tenorMonths) / 12;
    const totalReturn = principal * rate * years;
    const totalPayout = principal + totalReturn;

    let periods = 1;
    if (payoutFreq === 'monthly') periods = tenorMonths;
    else if (payoutFreq === 'quarterly') periods = Math.ceil(tenorMonths / 3);
    else if (payoutFreq === 'annually') periods = Math.ceil(tenorMonths / 12);

    const perPeriod = periods > 0 ? totalReturn / periods : 0;

    return { principal, totalReturn, totalPayout, periods, perPeriod, rate };
  }, [amount, returnPct, tenorMonths, payoutFreq]);

  return (
    <div className="rcalc">
      <div className="rcalc__header">
        <div className="rcalc__label">What you could earn</div>
        <div className="rcalc__sub">Adjust the amount to see your projected returns</div>
      </div>

      <div className="rcalc__amount-row">
        <div className="rcalc__amount-label">Investment amount</div>
        <div className="rcalc__amount-value">{format(amount)}</div>
      </div>

      <div className="rcalc__slider">
        <input
          type="range"
          min={minInvestment}
          max={maxInvestment || Math.max(minInvestment * 10, 5000000)}
          step={Math.max(1000, Math.round(minInvestment / 10))}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="rcalc__range"
        />
        <div className="rcalc__range-labels">
          <span>{format(minInvestment)}</span>
          <span>{format(maxInvestment || Math.max(minInvestment * 10, 5000000))}</span>
        </div>
      </div>

      <div className="rcalc__grid">
        <div className="rcalc__cell">
          <div className="rcalc__cell-label">Total return</div>
          <div className="rcalc__cell-value rcalc__cell-value--accent">{format(calc.totalReturn)}</div>
        </div>
        <div className="rcalc__cell">
          <div className="rcalc__cell-label">Total payout</div>
          <div className="rcalc__cell-value">{format(calc.totalPayout)}</div>
        </div>
        <div className="rcalc__cell">
          <div className="rcalc__cell-label">
            {payoutFreq === 'bullet' ? 'Paid at maturity' : `Per ${payoutFreq.slice(0, -2)} payout`}
          </div>
          <div className="rcalc__cell-value">{format(calc.perPeriod)}</div>
        </div>
        <div className="rcalc__cell">
          <div className="rcalc__cell-label">Tenor</div>
          <div className="rcalc__cell-value">{tenorMonths} months</div>
        </div>
      </div>

      {onInvest && (
        <Button variant="primary" size="lg" className="rcalc__cta" onClick={() => onInvest(calc.principal)}>
          Invest {format(calc.principal)} now
        </Button>
      )}

      <div className="rcalc__disclaimer">
        Projected values are estimates. Actual returns may vary based on project performance.
      </div>
    </div>
  );
}
