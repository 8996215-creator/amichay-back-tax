import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_INPUTS, estimateRefund, type CalculatorInputs, type Estimate } from '@/lib/tax';

const STORAGE_KEY = 'landers-tax.calculator.v1';

interface CalculatorValue {
  inputs: CalculatorInputs;
  estimate: Estimate;
  /** True until the visitor changes anything from the defaults. */
  pristine: boolean;
  /** True while no situation has been marked yet (salary, year and gender alone do not count). */
  untouched: boolean;
  set: <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => void;
  patch: (partial: Partial<CalculatorInputs>) => void;
  reset: () => void;
}

const Ctx = createContext<CalculatorValue | null>(null);

function load(): CalculatorInputs {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_INPUTS;
    const parsed = JSON.parse(raw) as Partial<CalculatorInputs>;
    return { ...DEFAULT_INPUTS, ...parsed };
  } catch {
    return DEFAULT_INPUTS;
  }
}

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [inputs, setInputs] = useState<CalculatorInputs>(load);

  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(inputs)); } catch { /* private mode */ }
  }, [inputs]);

  const estimate = useMemo(() => estimateRefund(inputs), [inputs]);
  const pristine = useMemo(() => JSON.stringify(inputs) === JSON.stringify(DEFAULT_INPUTS), [inputs]);
  const untouched = useMemo(() => {
    const profile: (keyof CalculatorInputs)[] = ['monthlySalary', 'taxYear', 'gender'];
    return (Object.keys(DEFAULT_INPUTS) as (keyof CalculatorInputs)[])
      .filter(k => !profile.includes(k))
      .every(k => inputs[k] === DEFAULT_INPUTS[k]);
  }, [inputs]);

  const value = useMemo<CalculatorValue>(() => ({
    inputs,
    estimate,
    pristine,
    untouched,
    set: (key, v) => setInputs(prev => ({ ...prev, [key]: v })),
    patch: partial => setInputs(prev => ({ ...prev, ...partial })),
    reset: () => setInputs(DEFAULT_INPUTS),
  }), [inputs, estimate, pristine, untouched]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCalculator(): CalculatorValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCalculator must be used inside CalculatorProvider');
  return ctx;
}
