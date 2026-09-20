import './Stepper.css';

const steps = ['Personal', 'Identity', 'Address', 'Bank', 'Review'];

export default function Stepper({ current = 1 }) {
  return (
    <div className="stepper">
      {steps.map((s, i) => {
        const n = i + 1;
        const state = n < current ? 'done' : n === current ? 'active' : 'todo';
        return (
          <div key={s} className={`stepper__item is-${state}`}>
            <div className="stepper__dot">{n < current ? '✓' : n}</div>
            <div className="stepper__label">{s}</div>
          </div>
        );
      })}
    </div>
  );
}
