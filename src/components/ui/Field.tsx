import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  prefix?: string;
}

const inputBase =
  'w-full rounded-xl border bg-surface px-4 text-[16px] text-ink placeholder:text-ink-3 ' +
  'transition-[border-color,box-shadow] focus:outline-none focus:border-navy focus:ring-4 focus:ring-navy/10 ' +
  'aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/15';

export function Field({ label, error, hint, prefix, className = '', id: idProp, ...rest }: FieldProps) {
  const auto = useId();
  const id = idProp ?? auto;
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute inset-y-0 start-4 grid place-items-center text-ink-3">{prefix}</span>}
        <input
          id={id}
          className={`${inputBase} h-12 ${prefix ? 'ps-10' : ''}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
      </div>
      {error ? (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-sm text-danger">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-ink-3">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextArea({ label, error, hint, className = '', id: idProp, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; hint?: string }) {
  const auto = useId();
  const id = idProp ?? auto;
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <textarea id={id} className={`${inputBase} min-h-24 py-3`} aria-invalid={error ? true : undefined} {...rest} />
      {error ? <p role="alert" className="mt-1.5 text-sm text-danger">{error}</p> : hint ? <p className="mt-1.5 text-sm text-ink-3">{hint}</p> : null}
    </div>
  );
}

export function NumberField({ label, value, onChange, min = 0, max = 10_000_000, step = 100, hint, className = '' }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; hint?: string; className?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 end-4 grid place-items-center text-ink-3">₪</span>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={value === 0 ? '' : value}
          placeholder="0"
          onChange={e => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}
          className={`${inputBase} tnum h-12 pe-10 text-end`}
          dir="ltr"
        />
      </div>
      {hint && <p className="mt-1.5 text-sm text-ink-3">{hint}</p>}
    </div>
  );
}
