import { useEffect, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useCalculator } from '@/state/calculator';
import { Container } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { CalculatorForm } from '@/components/calc/CalculatorForm';
import { ResultPanel } from '@/components/calc/ResultPanel';
import { EstimateDock } from '@/components/calc/EstimateDock';
import { LeadSheet } from '@/components/calc/LeadSheet';

export default function Calculator() {
  const { inputs, estimate, reset } = useCalculator();
  const [leadOpen, setLeadOpen] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const [resultVisible, setResultVisible] = useState(false);

  // On phones the full result sits under the form; hide the floating dock once it is on screen.
  useEffect(() => {
    const el = resultRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setResultVisible(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Container className="pb-40 pt-10 sm:pt-14 lg:pb-20">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold tracking-wide text-ink-3">בדיקת זכאות</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-ink sm:text-5xl">כמה מס שילמת יותר מדי?</h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-2">
            דקה אחת, בלי פרטים מזהים. ההערכה מתעדכנת בזמן אמת בזמן שממלאים.
          </p>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <CalculatorForm />
            <Button variant="ghost" onClick={reset} className="mt-8 text-ink-2">
              <RotateCcw className="size-4" /> איפוס הנתונים
            </Button>
          </div>
          <div ref={resultRef} id="result" className="min-w-0 scroll-mt-24 lg:sticky lg:top-24">
            <ResultPanel onContact={() => setLeadOpen(true)} />
          </div>
        </div>
      </Container>

      <EstimateDock
        hidden={resultVisible}
        onContact={() => setLeadOpen(true)}
        onShowResult={() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      />
      <LeadSheet
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        source="calculator"
        estimate={estimate.refund}
        taxYear={inputs.taxYear}
        inputs={inputs}
      />
    </>
  );
}
