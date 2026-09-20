import { useCurrency } from '@/context/CurrencyContext';
import './SuccessStats.css';

/* Bar heights relative to max. Values in NGN base. */
const BARS = [
  { year: '2021/22', value: 18500000000, color: '#ffffff', textDark: true, height: 22 },
  { year: '2022/23', value: 32000000000, color: '#ffffff', textDark: true, height: 38 },
  { year: '2023/24', value: 55300000000, color: '#C9A6F2', textDark: true, height: 62 },
  { year: '2024/25', value: 78600000000, color: '#B3D941', textDark: true, height: 88 },
];

export default function SuccessStats() {
  const { formatCompact } = useCurrency();

  return (
    <section className="success">
      <div className="container success__inner">
        <div className="success__head">
          <div>
            <h2 className="success__title">
              BraveVest Success Till<br />Today —
            </h2>
            <p className="success__sub">
              Some previous stats of Growth / Year
            </p>
          </div>
          <div className="success__big">
            {formatCompact(184400000000)}
          </div>
        </div>

        <div className="success__chart">
          {BARS.map((b) => (
            <div key={b.year} className="success__col">
              <div className="success__year">{b.year}</div>
              <div className="success__bar-wrap">
                <div
                  className="success__bar"
                  style={{
                    background: b.color,
                    height: `${b.height}%`,
                    color: b.textDark ? '#0F0F10' : '#fff',
                  }}
                >
                  <span className="success__bar-value">{formatCompact(b.value)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
