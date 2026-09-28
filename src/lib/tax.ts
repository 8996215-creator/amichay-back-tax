/**
 * Landers Tax estimate engine.
 *
 * This is an ESTIMATE, not tax advice. The engine models the mechanics that
 * most often produce a refund for salaried employees in Israel:
 *
 *  1. Employers withhold tax monthly as if the month's salary repeats all year.
 *     Anyone who worked part of the year, or whose income was uneven, is taxed
 *     annually on less than the employer assumed, and the difference comes back.
 *  2. Income taxed at source without the person's credit points (unemployment
 *     benefits, reserve pay paid directly by the National Insurance Institute,
 *     a second employer without tax coordination) is usually over-withheld.
 *  3. Credit points and credits the employer never applied (new child not
 *     reported on form 101, discharged soldier, degree, child with a learning
 *     disability, donations, independent pension deposits, qualifying locality).
 *
 * Credits are non-refundable: they can only reduce tax actually owed, so the
 * engine caps them against the computed liability. Bracket tables and point
 * values are the published figures for each year. Where the law depends on
 * details we do not ask for (exact child ages, locality tier, service length),
 * the most common case is used and marked as such.
 */

export type TaxYear = 2020 | 2021 | 2022 | 2023 | 2024 | 2025;
export const TAX_YEARS: TaxYear[] = [2025, 2024, 2023, 2022, 2021, 2020];

export interface CalculatorInputs {
  taxYear: TaxYear;
  gender: 'male' | 'female';
  monthlySalary: number;      // gross, NIS
  monthsWorked: number;       // 1..12
  changedEmployer: boolean;   // moved jobs without tax coordination
  unemploymentMonths: number; // months of unemployment benefits (0..12)
  reservist: boolean;         // served in the reserves this year
  reserveDays: number;        // days served
  reservePaidDirectly: boolean; // NII paid reserve pay directly (not via employer)
  newChildren: number;        // children born/adopted and not updated on form 101
  dischargedSoldier: boolean; // discharged from IDF / national service within 36 months
  finishedDegree: boolean;    // finished a first degree the year before
  childWithLearningDisability: boolean;
  donations: number;          // annual donations to recognised institutions, NIS
  pensionDeposits: number;    // independent deposits to pension / provident fund, NIS
  qualifyingLocality: boolean; // lived in a qualifying locality and employer did not apply it
}

export const DEFAULT_INPUTS: CalculatorInputs = {
  taxYear: 2024,
  gender: 'male',
  monthlySalary: 14000,
  monthsWorked: 12,
  changedEmployer: false,
  unemploymentMonths: 0,
  reservist: false,
  reserveDays: 0,
  reservePaidDirectly: false,
  newChildren: 0,
  dischargedSoldier: false,
  finishedDegree: false,
  childWithLearningDisability: false,
  donations: 0,
  pensionDeposits: 0,
  qualifyingLocality: false,
};

interface YearTable {
  /** Monthly bracket ceilings, NIS. The last bracket is open-ended. */
  monthlyCeilings: number[];
  rates: number[];
  /** Monthly value of one credit point, NIS. */
  pointValue: number;
  /** Minimum donation that qualifies for a credit (section 46). */
  donationFloor: number;
}

/** Published brackets. 2024 and 2025 were frozen at the 2024 figures. */
const TABLES: Record<TaxYear, YearTable> = {
  2020: { monthlyCeilings: [6330, 9100, 14630, 20330, 42030, 54130], rates: [0.10, 0.14, 0.20, 0.31, 0.35, 0.47, 0.50], pointValue: 219, donationFloor: 190 },
  2021: { monthlyCeilings: [6290, 9030, 14490, 20140, 41910, 53970], rates: [0.10, 0.14, 0.20, 0.31, 0.35, 0.47, 0.50], pointValue: 218, donationFloor: 190 },
  2022: { monthlyCeilings: [6450, 9240, 14840, 20620, 42910, 55270], rates: [0.10, 0.14, 0.20, 0.31, 0.35, 0.47, 0.50], pointValue: 223, donationFloor: 190 },
  2023: { monthlyCeilings: [6790, 9730, 15620, 21710, 45180, 58190], rates: [0.10, 0.14, 0.20, 0.31, 0.35, 0.47, 0.50], pointValue: 235, donationFloor: 200 },
  2024: { monthlyCeilings: [7010, 10060, 16150, 22440, 46690, 60130], rates: [0.10, 0.14, 0.20, 0.31, 0.35, 0.47, 0.50], pointValue: 242, donationFloor: 207 },
  2025: { monthlyCeilings: [7010, 10060, 16150, 22440, 46690, 60130], rates: [0.10, 0.14, 0.20, 0.31, 0.35, 0.47, 0.50], pointValue: 242, donationFloor: 207 },
};

/** Base credit points for an Israeli resident employee: 2 + 0.25 travel, women +0.5. */
function basePoints(gender: CalculatorInputs['gender']): number {
  return gender === 'female' ? 2.75 : 2.25;
}

/** Progressive tax on an amount using the year's brackets scaled by `periods` (1 = monthly, 12 = annual). */
function progressiveTax(amount: number, table: YearTable, periods: number): number {
  if (amount <= 0) return 0;
  let tax = 0;
  let lower = 0;
  for (let i = 0; i < table.rates.length; i++) {
    const upper = i < table.monthlyCeilings.length ? table.monthlyCeilings[i] * periods : Infinity;
    if (amount <= lower) break;
    const slice = Math.min(amount, upper) - lower;
    tax += slice * table.rates[i];
    lower = upper;
  }
  return tax;
}

export interface BreakdownItem {
  key: string;
  label: string;
  amount: number; // NIS contribution to the estimate (may be 0)
}

export interface Estimate {
  /** Estimated refund, rounded to the nearest 10 NIS, never negative. */
  refund: number;
  /** Total tax the engine believes was withheld during the year. */
  withheld: number;
  /** Tax actually owed for the year after all credits. */
  liability: number;
  /** Annual gross income used in the model. */
  annualIncome: number;
  /** Per-factor contribution, largest first. Zero-contribution factors are omitted. */
  breakdown: BreakdownItem[];
  /** True when nothing in the inputs indicates over-withholding. */
  nothingFound: boolean;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function compute(inputs: CalculatorInputs): { refund: number; withheld: number; liability: number; annualIncome: number } {
  const t = TABLES[inputs.taxYear];
  const salary = clamp(inputs.monthlySalary, 0, 500000);
  const monthsWorked = clamp(Math.round(inputs.monthsWorked), 0, 12);
  const base = basePoints(inputs.gender) * t.pointValue; // monthly

  // 1. Employer withholding: monthly brackets on the monthly salary, minus base credit points.
  const monthlyTax = Math.max(0, progressiveTax(salary, t, 1) - base);
  let withheld = monthlyTax * monthsWorked;
  let income = salary * monthsWorked;

  // 1b. Job change without coordination: half a month's salary is typically taxed at the top
  //     rate with no credit points before the new employer's paperwork catches up. (Common case.)
  if (inputs.changedEmployer && monthsWorked > 1) {
    const uncoordinated = salary * 0.5;
    withheld += Math.max(0, uncoordinated * 0.47 - monthlyTax * 0.5);
  }

  // 2. Income taxed at source without credit points.
  const unemploymentMonths = clamp(Math.round(inputs.unemploymentMonths), 0, 12 - monthsWorked);
  if (unemploymentMonths > 0) {
    // Unemployment benefit: roughly 70% of the previous salary, capped near the average wage x1.
    const benefit = Math.min(salary * 0.7, 12500);
    income += benefit * unemploymentMonths;
    withheld += progressiveTax(benefit, t, 1) * unemploymentMonths;
  }

  if (inputs.reservist && inputs.reservePaidDirectly && inputs.reserveDays > 0) {
    // Reserve pay from the NII: at least the statutory daily minimum, otherwise salary-based.
    const days = clamp(inputs.reserveDays, 0, 365);
    const daily = Math.max(salary / 30, 310);
    const total = daily * days;
    const months = Math.max(1, Math.ceil(days / 30));
    income += total;
    withheld += progressiveTax(total / months, t, 1) * months;
  }

  // 3. Annual liability with every credit the person is entitled to.
  const grossTax = progressiveTax(income, t, 12);
  let credits = base * 12;

  const pointsPerYear = t.pointValue * 12;
  if (inputs.newChildren > 0) credits += clamp(inputs.newChildren, 0, 6) * 1.5 * pointsPerYear; // birth-year points
  if (inputs.dischargedSoldier) credits += 2 * pointsPerYear;      // full service; partial service gets 1
  if (inputs.finishedDegree) credits += 1 * pointsPerYear;         // first degree, one year
  if (inputs.childWithLearningDisability) credits += 2 * pointsPerYear;

  if (inputs.donations > t.donationFloor) {
    const eligible = Math.min(inputs.donations, income * 0.3);
    credits += Math.max(0, eligible - t.donationFloor) * 0.35;
  }
  if (inputs.pensionDeposits > 0) {
    // Employee: 35% credit on deposits up to 7% of income, income capped at ~2x the ceiling.
    const cap = 0.07 * Math.min(income, 213600);
    credits += Math.min(inputs.pensionDeposits, cap) * 0.35;
  }
  if (inputs.qualifyingLocality) {
    // Most common tier: 12% of income up to the annual ceiling.
    credits += 0.12 * Math.min(income, 174120);
  }

  const liability = Math.max(0, grossTax - credits);
  const refund = Math.max(0, withheld - liability);
  return { refund, withheld, liability, annualIncome: income };
}

const FACTORS: { key: keyof CalculatorInputs; label: string; off: (i: CalculatorInputs) => CalculatorInputs }[] = [
  { key: 'monthsWorked', label: 'עבודה בחלק מהשנה', off: i => ({ ...i, monthsWorked: 12, unemploymentMonths: 0 }) },
  { key: 'changedEmployer', label: 'החלפת מקום עבודה', off: i => ({ ...i, changedEmployer: false }) },
  { key: 'unemploymentMonths', label: 'דמי אבטלה', off: i => ({ ...i, unemploymentMonths: 0 }) },
  { key: 'reserveDays', label: 'תגמולי מילואים', off: i => ({ ...i, reservePaidDirectly: false }) },
  { key: 'newChildren', label: 'נקודות זיכוי על ילדים', off: i => ({ ...i, newChildren: 0 }) },
  { key: 'dischargedSoldier', label: 'חייל/ת משוחרר/ת', off: i => ({ ...i, dischargedSoldier: false }) },
  { key: 'finishedDegree', label: 'סיום תואר', off: i => ({ ...i, finishedDegree: false }) },
  { key: 'childWithLearningDisability', label: 'ילד עם לקות למידה', off: i => ({ ...i, childWithLearningDisability: false }) },
  { key: 'donations', label: 'תרומות (סעיף 46)', off: i => ({ ...i, donations: 0 }) },
  { key: 'pensionDeposits', label: 'הפקדות עצמאיות לפנסיה', off: i => ({ ...i, pensionDeposits: 0 }) },
  { key: 'qualifyingLocality', label: 'יישוב מזכה', off: i => ({ ...i, qualifyingLocality: false }) },
];

const roundTo10 = (n: number) => Math.round(n / 10) * 10;

export function estimateRefund(inputs: CalculatorInputs): Estimate {
  const full = compute(inputs);

  // Contribution of each factor = how much the estimate drops when that factor is switched off.
  const breakdown: BreakdownItem[] = FACTORS
    .map(f => {
      const without = compute(f.off(inputs)).refund;
      return { key: f.key, label: f.label, amount: roundTo10(Math.max(0, full.refund - without)) };
    })
    .filter(b => b.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const refund = roundTo10(full.refund);
  return {
    refund,
    withheld: Math.round(full.withheld),
    liability: Math.round(full.liability),
    annualIncome: Math.round(full.annualIncome),
    breakdown,
    nothingFound: refund < 100,
  };
}

/** Fee the business charges on a successful refund. Reservists get the reduced rate. */
export function feeRate(inputs: Pick<CalculatorInputs, 'reservist'>, standard: number, reservist: number): number {
  return inputs.reservist ? reservist : standard;
}
