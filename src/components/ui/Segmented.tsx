import { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface Option<T extends string | number> { value: T; label: string }

interface SegmentedProps<T extends string | number> {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
  hideLabel?: boolean;
  size?: 'sm' | 'md';
  onNavy?: boolean;
}

export function Segmented<T extends string | number>({ label, value, options, onChange, hideLabel, size = 'md', onNavy = false }: SegmentedProps<T>) {
  const id = useId();
  const reduce = useReducedMotion();
  // Six tax years do not fit one row on a phone; wrap into a 3-column grid there.
  const many = options.length > 4;
  return (
    <div>
      <p id={id} className={hideLabel ? 'sr-only' : `mb-1.5 text-[15px] font-medium ${onNavy ? 'text-on-navy' : 'text-ink'}`}>{label}</p>
      <div role="radiogroup" aria-labelledby={id} className={`w-full p-1 ${many ? 'grid grid-cols-3 gap-y-1 rounded-3xl sm:flex sm:rounded-full' : 'inline-flex rounded-full'} ${onNavy ? 'bg-white/10' : 'bg-surface-2'}`}>
        {options.map(o => {
          const on = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(o.value)}
              className={`relative min-w-0 flex-1 rounded-full font-medium transition-colors ${size === 'sm' ? 'h-9 px-2 text-sm sm:px-3' : 'h-11 px-2 text-[15px] sm:px-4'} ${on ? (onNavy ? 'text-ink' : 'text-on-navy') : onNavy ? 'text-on-navy-2 hover:text-on-navy' : 'text-ink-2 hover:text-ink'}`}
            >
              {on && (
                <motion.span
                  layoutId={`${id}-thumb`}
                  className={`absolute inset-0 rounded-full shadow-1 ${onNavy ? 'bg-surface' : 'bg-navy'}`}
                  transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative z-10">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
