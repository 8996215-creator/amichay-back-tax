import { useId } from 'react';
import { Minus, Plus } from 'lucide-react';

interface StepperProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  suffix?: string;
}

export function Stepper({ label, value, min = 0, max = 99, onChange, suffix }: StepperProps) {
  const id = useId();
  const btn = 'grid size-10 place-items-center rounded-full bg-surface-2 text-ink transition-colors hover:bg-line disabled:opacity-40';
  return (
    <div className="flex items-center justify-between gap-4">
      <label id={id} className="text-[15px] text-ink">{label}</label>
      <div role="group" aria-labelledby={id} className="flex items-center gap-1">
        <button type="button" className={btn} onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="פחות">
          <Minus className="size-4" />
        </button>
        <output className="tnum min-w-10 text-center text-lg font-semibold text-ink" aria-live="polite">
          {value}{suffix ? ` ${suffix}` : ''}
        </output>
        <button type="button" className={btn} onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="יותר">
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
