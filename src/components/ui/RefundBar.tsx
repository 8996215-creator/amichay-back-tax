import { motion, useReducedMotion } from 'motion/react';
import { formatILS } from '@/lib/format';

interface Props {
  withheld: number;
  refund: number;
  onNavy?: boolean;
  compact?: boolean;
}

/**
 * The signature element: tax withheld as a row of rounded navy blocks, the part
 * coming back in orange. Same geometry as the logo. Widths are proportional.
 */
export function RefundBar({ withheld, refund, onNavy = false, compact = false }: Props) {
  const reduce = useReducedMotion();
  const total = Math.max(withheld, 1);
  const refundPct = Math.min(100, (refund / total) * 100);
  const keptPct = 100 - refundPct;
  const transition = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 140, damping: 26 };
  const h = compact ? 'h-3' : 'h-4';
  const kept = onNavy ? 'bg-white/20' : 'bg-navy';
  const label = onNavy ? 'text-on-navy-2' : 'text-ink-3';
  const value = onNavy ? 'text-on-navy' : 'text-ink';

  return (
    <div role="img" aria-label={`מתוך ${formatILS(withheld)} מס ששולם, כ-${formatILS(refund)} עשויים לחזור`}>
      <div className={`flex w-full gap-1 ${h}`}>
        <motion.div
          className={`rounded-full ${kept}`}
          initial={false}
          animate={{ width: `${keptPct}%` }}
          transition={transition}
          style={{ minWidth: keptPct > 0 ? 8 : 0 }}
        />
        <motion.div
          className="rounded-full bg-accent"
          initial={false}
          animate={{ width: `${refundPct}%` }}
          transition={transition}
          style={{ minWidth: refundPct > 0 ? 8 : 0 }}
        />
      </div>
      {!compact && (
        <div className="mt-2.5 flex justify-between text-sm">
          <span className={label}>
            מס ששולם השנה <span className={`tnum font-semibold ${value}`}>{formatILS(withheld)}</span>
          </span>
          <span className={label}>
            חוזר אליך <span className="tnum font-semibold text-accent">{formatILS(refund)}</span>
          </span>
        </div>
      )}
    </div>
  );
}
