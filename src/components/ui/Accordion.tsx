import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export interface QA { q: string; a: string }

export function Accordion({ items }: { items: QA[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();
  const reduce = useReducedMotion();
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-surface">
      {items.map((it, i) => {
        const on = open === i;
        const btnId = `${base}-b${i}`;
        const panelId = `${base}-p${i}`;
        return (
          <div key={i}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={on}
                aria-controls={panelId}
                onClick={() => setOpen(on ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-[16px] font-semibold text-ink transition-colors hover:bg-surface-2 sm:px-6"
              >
                <span>{it.q}</span>
                <ChevronDown className={`size-5 shrink-0 text-ink-3 transition-transform duration-300 ${on ? 'rotate-180' : ''}`} />
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-[15px] leading-relaxed text-ink-2 sm:px-6">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
