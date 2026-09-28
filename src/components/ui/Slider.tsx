import { useId } from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  hint?: string;
  marks?: { value: number; label: string }[];
  onNavy?: boolean;
}

export function Slider({ label, value, min, max, step = 1, onChange, format = v => String(v), hint, marks, onNavy = false }: SliderProps) {
  const fg = onNavy ? 'text-on-navy' : 'text-ink';
  const muted = onNavy ? 'text-on-navy-2' : 'text-ink-3';
  const id = useId();
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className={`text-[15px] font-medium ${fg}`}>{label}</label>
        <output htmlFor={id} className={`tnum text-lg font-semibold ${fg}`}>{format(value)}</output>
      </div>
      <input
        id={id}
        type="range"
        className={`lt-range ${onNavy ? 'on-navy' : ''}`}
        style={{ '--fill': `${pct}%` } as React.CSSProperties}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        aria-valuetext={format(value)}
      />
      {marks && (
        <div className={`tnum mt-0.5 flex justify-between text-xs ${muted}`} aria-hidden="true">
          {marks.map(m => <span key={m.value}>{m.label}</span>)}
        </div>
      )}
      {hint && <p className={`mt-2 text-sm ${muted}`}>{hint}</p>}
    </div>
  );
}
