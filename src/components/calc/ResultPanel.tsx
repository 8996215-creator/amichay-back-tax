import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, FileText, Info } from 'lucide-react';
import { useCalculator } from '@/state/calculator';
import { feeRate } from '@/lib/tax';
import { formatILS } from '@/lib/format';
import { business } from '@/content/business';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { RefundBar } from '@/components/ui/RefundBar';
import { Mascot } from '@/components/ui/Mascot';

interface Props { onContact: () => void }

export function ResultPanel({ onContact }: Props) {
  const { inputs, estimate, untouched } = useCalculator();
  const rate = feeRate(inputs, business.fees.standard, business.fees.reservist);
  const fee = Math.round(estimate.refund * rate / 100);
  const positives = estimate.breakdown.filter(b => b.amount > 0);

  return (
    <Card tone="navy" padding="lg" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -bottom-20 -start-16 size-64 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />
      <AnimatePresence initial={false}>
        {(untouched || estimate.nothingFound) && (
          <motion.div
            key={untouched ? 'start' : 'ok'}
            className="pointer-events-none absolute end-5 top-5 sm:end-8 sm:top-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
          >
            <Mascot name={untouched ? 'calc-start' : 'calc-ok'} className="h-20 w-auto sm:h-24" />
          </motion.div>
        )}
      </AnimatePresence>
      <p className="pe-24 text-sm font-medium text-on-navy-2 sm:pe-28">הערכת החזר לשנת {inputs.taxYear}</p>

      <div className="mt-2 flex items-baseline gap-2">
        <AnimatedNumber value={estimate.refund} className="text-[44px] font-bold leading-none tracking-tight sm:text-[52px]" />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {untouched ? (
          <motion.p key="pristine" className="mt-3 text-[15px] leading-relaxed text-on-navy-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            עדיין לא סימנת כלום. עדכנו את השכר והחודשים וסמנו מה קרה השנה, וההערכה תתעדכן כאן מיד.
          </motion.p>
        ) : estimate.nothingFound ? (
          <motion.p key="none" className="mt-3 text-[15px] leading-relaxed text-on-navy-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            לפי הנתונים שסימנת, נראה שהמס נוכה כמו שצריך. אם יש טופס 106, נבדוק לעומק בלי עלות.
          </motion.p>
        ) : (
          <motion.p key="some" className="mt-3 text-[15px] leading-relaxed text-on-navy-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            מתוך כ-{formatILS(estimate.withheld)} מס שנוכה מהשכר, נראה שחלק לא היה צריך להיגבות.
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-6">
        <RefundBar withheld={estimate.withheld} refund={estimate.refund} onNavy />
      </div>

      {positives.length > 0 && (
        <ul className="mt-6 divide-y divide-white/10 text-[15px]">
          {positives.map(b => (
            <li key={b.key} className="flex items-center justify-between py-2.5">
              <span className="text-on-navy-2">{b.label}</span>
              <span className="tnum font-medium">{formatILS(b.amount)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 rounded-2xl bg-white/[0.06] p-4 text-sm leading-relaxed text-on-navy-2 rim">
        <div className="flex items-center justify-between">
          <span>העמלה שלנו ({rate}% מההחזר בפועל)</span>
          <span className="tnum font-medium text-on-navy">{formatILS(fee)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span>נשאר אצלך</span>
          <span className="tnum font-semibold text-on-navy">{formatILS(Math.max(0, estimate.refund - fee))}</span>
        </div>
        {inputs.reservist && <p className="mt-2 text-xs text-on-navy-2">עמלה מופחתת למשרתי מילואים.</p>}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button variant="primary" size="lg" onClick={onContact}>
          {estimate.nothingFound ? 'בכל זאת, בדקו לי' : 'להתחיל בבדיקה'}
          <ArrowLeft className="size-4" />
        </Button>
        <Button variant="onNavy" size="lg" to="/upload">
          <FileText className="size-4" /> יש לי טופס 106
        </Button>
      </div>

      <p className="mt-5 flex gap-2 text-xs leading-relaxed text-on-navy-2">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <span>
          זו הערכה בלבד על בסיס הנתונים שהוזנו, ואינה מהווה ייעוץ מס או התחייבות לסכום כלשהו. ההחזר הסופי נקבע על ידי רשות המסים.
        </span>
      </p>
    </Card>
  );
}
