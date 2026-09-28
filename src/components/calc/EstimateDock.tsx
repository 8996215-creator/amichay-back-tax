import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useCalculator } from '@/state/calculator';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { RefundBar } from '@/components/ui/RefundBar';
import { Button } from '@/components/ui/Button';

/** Mobile-only floating glass bar so the estimate stays visible while scrolling the form. */
interface Props {
  onContact: () => void;
  onShowResult?: () => void;
  hidden?: boolean;
}

export function EstimateDock({ onContact, onShowResult, hidden = false }: Props) {
  const { estimate, inputs } = useCalculator();
  return (
    <motion.div
      className="fixed inset-x-3 bottom-3 z-30 lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)', pointerEvents: hidden ? 'none' : 'auto' }}
      initial={{ y: 24, opacity: 0 }}
      animate={hidden ? { y: 24, opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: hidden ? 0 : 0.2 }}
      aria-hidden={hidden}
    >
      <div className="glass rounded-[22px] p-2.5 shadow-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onShowResult}
            className="min-w-0 flex-1 rounded-2xl px-1.5 py-1 text-start transition-colors hover:bg-ink/5 active:bg-ink/5"
            aria-label="הצגת פירוט ההערכה"
          >
            <p className="flex items-center gap-1 text-[11px] font-medium text-ink-3">
              הערכה ל-{inputs.taxYear} <ChevronDown className="size-3" aria-hidden="true" />
            </p>
            <AnimatedNumber value={estimate.refund} className="block text-2xl font-bold leading-tight text-ink" />
            {!estimate.nothingFound && <div className="mt-1.5"><RefundBar withheld={estimate.withheld} refund={estimate.refund} compact /></div>}
          </button>
          <Button onClick={onContact} className="shrink-0">להתחיל</Button>
        </div>
      </div>
    </motion.div>
  );
}
