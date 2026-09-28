import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/** Frosted sheet: bottom sheet on phones, centered dialog on wider screens. Functional layer, so it gets the glass. */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  // Callers usually pass a fresh arrow each render; keep the latest without re-running the open effect
  // (re-running it stole focus back to the first control on every keystroke).
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onCloseRef.current(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    // Focus the first field in the body; fall back to the first button there, then the panel itself.
    requestAnimationFrame(() => {
      const first =
        bodyRef.current?.querySelector<HTMLElement>('input:not([type="checkbox"]), select, textarea') ??
        bodyRef.current?.querySelector<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])') ??
        panelRef.current;
      first?.focus();
    });
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      prev?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
          <motion.button
            type="button"
            aria-label="סגירה"
            className="absolute inset-0 bg-ink/40"
            style={{ backgroundColor: 'var(--scrim)' }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            tabIndex={-1}
            className="glass relative w-full max-w-lg rounded-t-3xl outline-none sm:rounded-3xl"
            initial={reduce ? { opacity: 0 } : { y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          >
            <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-ink/20 sm:hidden" aria-hidden="true" />
            <div className="flex items-center justify-between px-6 pt-4 sm:pt-6">
              <h2 id="sheet-title" className="text-xl font-bold text-ink">{title}</h2>
              <button type="button" onClick={onClose} aria-label="סגירה" className="grid size-10 place-items-center rounded-full text-ink-2 hover:bg-ink/5">
                <X className="size-5" />
              </button>
            </div>
            <div ref={bodyRef} className="max-h-[80dvh] overflow-y-auto px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
