import { useId, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';

interface ToggleCardProps {
  title: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: ReactNode;
  children?: ReactNode; // disclosed when checked
}

/** A checkbox styled as an option card. State is carried by the check mark and the border, not color alone. */
export function ToggleCard({ title, description, checked, onChange, icon, children }: ToggleCardProps) {
  const id = useId();
  const reduce = useReducedMotion();
  return (
    <div className={`glass-card rounded-2xl transition-[border-color,transform] active:scale-[0.99] ${checked ? 'border-accent!' : 'hover:border-line-strong!'}`}>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 p-4 sm:p-5">
        <input
          id={id}
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        <span
          aria-hidden="true"
          className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-lg border-2 transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${checked ? 'border-accent bg-accent text-on-accent' : 'border-line-strong bg-surface'}`}
        >
          <Check className={`size-4 transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} strokeWidth={3} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2 text-[15px] font-semibold text-ink">
            {icon && <span className="text-ink-2">{icon}</span>}
            {title}
          </span>
          {description && <span className="mt-1 block text-sm leading-snug text-ink-3">{description}</span>}
        </span>
      </label>
      <AnimatePresence initial={false}>
        {checked && children && (
          <motion.div
            key="disclosure"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-line px-4 pb-4 pt-4 sm:px-5 sm:pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
