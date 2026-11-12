import { useMemo, useState } from 'react';
import { TrendingUp, Calendar } from 'lucide-react';

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  background: 'var(--bv-bg)',
  border: '1px solid var(--bv-border)',
  borderRadius: 8,
  fontSize: 16,
  color: 'var(--bv-text)',
  fontFamily: 'inherit',
  outline: 'none',
};

export default function ReturnCalculator({
  minInvestment = 5000,
  annualRate = 14.5,
  tenorMonths = 12,
  payoutFrequency = 'monthly',
}) {
  const [amount, setAmount] = useState(String(minInvestment));
  const [mode, setMode] = useState(tenorMonths <= 12 ? 'monthly' : 'yearly');

  const calc = useMemo(() => {
    const principal = Number(amount) || 0;
    const rate = Number(annualRate) || 0;
    const tenor = Number(tenorMonths) || 12;

    if (mode === 'monthly') {
      const monthlyRate = rate / 100 / 12;
      const monthlyEarnings = principal * monthlyRate;
      const totalEarnings = monthlyEarnings * tenor;
      const maturityValue = principal + totalEarnings;
      return {
        principal,
        monthlyEarnings,
        totalEarnings,
        maturityValue,
        yearlyDuration: Math.max(1, Math.ceil(tenor / 12)),
      };
    }

    const years = tenor / 12;
    const maturityValue = principal * Math.pow(1 + rate / 100, years);
    const totalEarnings = maturityValue - principal;
    return {
      principal,
      monthlyEarnings: years > 0 ? totalEarnings / (years * 12) : 0,
      totalEarnings,
      maturityValue,
      yearlyDuration: Math.max(1, Math.ceil(years)),
    };
  }, [amount, annualRate, tenorMonths, mode]);

  const fmt = (n) => '₦' + Number(n).toLocaleString('en-NG', { maximumFractionDigits: 0 });

  return (
    <div style={{
      background: 'var(--bv-bg-elevated)',
      border: '1px solid var(--bv-border)',
      borderRadius: 16,
      padding: 24,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: 'color-mix(in srgb, var(--bv-accent) 15%, transparent)',
          color: 'var(--bv-accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <TrendingUp size={18} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--bv-text)' }}>
            Return Calculator
          </h3>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--bv-text-muted)' }}>
            Projected earnings based on this project's rate and tenor
          </p>
        </div>
      </div>

      <div style={{
        display: 'inline-flex',
        background: 'var(--bv-surface)',
        border: '1px solid var(--bv-border)',
        borderRadius: 8,
        padding: 3,
        marginBottom: 16,
      }}>
        {['monthly', 'yearly'].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            style={{
              padding: '6px 14px',
              background: mode === m ? 'var(--bv-bg-elevated)' : 'transparent',
              color: mode === m ? 'var(--bv-text)' : 'var(--bv-text-muted)',
              border: 'none',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <label style={{ display: 'grid', gap: 6, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
        <span style={{ color: 'var(--bv-text-muted)' }}>Investment amount (₦)</span>
        <input
          type="number"
          min={minInvestment}
          step={1000}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />
        <span style={{ fontSize: 12, color: 'var(--bv-text-muted)', fontWeight: 400 }}>
          Minimum {fmt(minInvestment)}
        </span>
      </label>

      <div style={{ display: 'grid', gap: 12 }}>
        <div style={{
          padding: 16,
          background: 'var(--bv-surface)',
          border: '1px solid var(--bv-border)',
          borderRadius: 10,
        }}>
          <div style={{ fontSize: 12, color: 'var(--bv-text-muted)', marginBottom: 4 }}>
            {mode === 'monthly' ? 'Monthly earnings' : 'Yearly earnings'}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--bv-success)' }}>
            +{fmt(mode === 'monthly' ? calc.monthlyEarnings : calc.monthlyEarnings * 12)}
          </div>
          <div style={{ fontSize: 11, color: 'var(--bv-text-muted)', marginTop: 4 }}>
            @ {annualRate}% annual rate
          </div>
        </div>

        <div style={{
          padding: 16,
          background: 'var(--bv-surface)',
          border: '1px solid var(--bv-border)',
          borderRadius: 10,
        }}>
          <div style={{ fontSize: 12, color: 'var(--bv-text-muted)', marginBottom: 4 }}>
            Total earnings over {tenorMonths} months
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--bv-success)' }}>
            +{fmt(calc.totalEarnings)}
          </div>
        </div>

        <div style={{
          padding: 16,
          background: 'var(--bv-surface)',
          border: '1px solid var(--bv-border)',
          borderRadius: 10,
        }}>
          <div style={{ fontSize: 12, color: 'var(--bv-text-muted)', marginBottom: 4 }}>
            Total at maturity
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--bv-text)' }}>
            {fmt(calc.maturityValue)}
          </div>
          <div style={{
            fontSize: 11, color: 'var(--bv-text-muted)', marginTop: 4,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Calendar size={11} /> {tenorMonths} months · {calc.yearlyDuration} year{calc.yearlyDuration > 1 ? 's' : ''}
          </div>
        </div>
      </div>

      <p style={{
        fontSize: 11, color: 'var(--bv-text-muted)',
        marginTop: 16, marginBottom: 0, lineHeight: 1.5,
      }}>
        Projections are estimates. Actual returns may vary. Capital at risk.
      </p>
    </div>
  );
}
