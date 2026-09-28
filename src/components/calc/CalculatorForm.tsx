import { useId } from 'react';
import { Baby, Briefcase, GraduationCap, HandHeart, Home, MapPin, PiggyBank, Shield, Wallet } from 'lucide-react';
import { useCalculator } from '@/state/calculator';
import { TAX_YEARS } from '@/lib/tax';
import { formatILS } from '@/lib/format';
import { Card } from '@/components/ui/Card';
import { Segmented } from '@/components/ui/Segmented';
import { Slider } from '@/components/ui/Slider';
import { Stepper } from '@/components/ui/Stepper';
import { ToggleCard } from '@/components/ui/ToggleCard';
import { NumberField } from '@/components/ui/Field';

interface GroupProps {
  title: string;
  lead?: string;
  divider?: boolean;
  badge?: string;
  children: React.ReactNode;
}

function Group({ title, lead, divider = false, badge, children }: GroupProps) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={`space-y-5 ${divider ? 'border-t border-line pt-8' : ''}`}>
      <div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 id={id} className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
          {badge && (
            <span className="tnum rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-semibold text-accent-text" aria-live="polite">
              {badge}
            </span>
          )}
        </div>
        {lead && <p className="mt-1 text-[15px] text-ink-2">{lead}</p>}
      </div>
      {children}
    </section>
  );
}

export function CalculatorForm() {
  const { inputs, set, patch } = useCalculator();
  const checkedCount = [
    inputs.changedEmployer,
    inputs.unemploymentMonths > 0,
    inputs.reservist,
    inputs.newChildren > 0,
    inputs.dischargedSoldier,
    inputs.finishedDegree,
    inputs.donations > 0,
    inputs.pensionDeposits > 0,
    inputs.qualifyingLocality,
    inputs.childWithLearningDisability,
  ].filter(Boolean).length;

  return (
    <div className="space-y-10">
      <Group title="הבסיס" lead="שלושה פרטים שקובעים את רוב התמונה.">
        <Card className="space-y-6">
          <Segmented
            label="שנת מס"
            value={inputs.taxYear}
            options={TAX_YEARS.map(y => ({ value: y, label: String(y) }))}
            onChange={v => set('taxYear', v)}
          />
          <Segmented
            label="מין (משפיע על נקודות זיכוי)"
            value={inputs.gender}
            options={[{ value: 'male', label: 'גבר' }, { value: 'female', label: 'אישה' }]}
            onChange={v => set('gender', v)}
          />
          <Slider
            label="שכר חודשי ברוטו"
            value={inputs.monthlySalary}
            min={3000}
            max={60000}
            step={500}
            onChange={v => set('monthlySalary', v)}
            format={formatILS}
            hint="ממוצע לחודש עבודה. אפשר לדייק בהמשך מטופס 106."
          />
          <Slider
            label="חודשי עבודה בשנה"
            value={inputs.monthsWorked}
            min={1}
            max={12}
            onChange={v => {
              const months = v;
              const unemployment = Math.min(inputs.unemploymentMonths, 12 - months);
              patch({ monthsWorked: months, unemploymentMonths: unemployment });
            }}
            format={v => (v === 12 ? 'שנה מלאה' : `${v} חודשים`)}
            marks={[{ value: 1, label: '1' }, { value: 6, label: '6' }, { value: 12, label: '12' }]}
          />
        </Card>
      </Group>

      <Group
        title="מה קרה השנה?"
        lead="סמנו כל מה שנכון. כל סימון מעדכן את ההערכה מיד."
        divider
        badge={checkedCount > 0 ? `סומנו ${checkedCount} מתוך 10` : undefined}
      >
        <div className="grid gap-3">
          <ToggleCard
            icon={<Briefcase className="size-5" />}
            title="החלפתי מקום עבודה"
            description="שני מעסיקים או יותר באותה שנה, בלי תיאום מס."
            checked={inputs.changedEmployer}
            onChange={v => set('changedEmployer', v)}
          />
          <ToggleCard
            icon={<Wallet className="size-5" />}
            title="קיבלתי דמי אבטלה"
            description="תקופה של אבטלה או חל״ת עם תשלום מביטוח לאומי."
            checked={inputs.unemploymentMonths > 0}
            onChange={v => set('unemploymentMonths', v ? Math.min(3, 12 - inputs.monthsWorked) || 1 : 0)}
          >
            <Stepper
              label="חודשי אבטלה"
              value={inputs.unemploymentMonths}
              min={1}
              max={Math.max(1, 12 - inputs.monthsWorked)}
              onChange={v => set('unemploymentMonths', v)}
              suffix="חודשים"
            />
          </ToggleCard>
          <ToggleCard
            icon={<Shield className="size-5" />}
            title="שירתתי במילואים"
            description="גם כמה ימים. תגמולי מילואים מחויבים לעיתים במס גבוה מדי."
            checked={inputs.reservist}
            onChange={v => patch({ reservist: v, reserveDays: v ? Math.max(inputs.reserveDays, 20) : 0, reservePaidDirectly: v ? inputs.reservePaidDirectly : false })}
          >
            <div className="space-y-4">
              <Slider
                label="ימי מילואים בשנה"
                value={inputs.reserveDays}
                min={1}
                max={200}
                onChange={v => set('reserveDays', v)}
                format={v => `${v} ימים`}
              />
              <Segmented
                label="מי שילם את התגמול?"
                value={inputs.reservePaidDirectly ? 'direct' : 'employer'}
                options={[{ value: 'employer', label: 'המעסיק' }, { value: 'direct', label: 'ביטוח לאומי ישירות' }]}
                onChange={v => set('reservePaidDirectly', v === 'direct')}
                size="sm"
              />
            </div>
          </ToggleCard>
          <ToggleCard
            icon={<Baby className="size-5" />}
            title="נולד לנו ילד"
            description="ילד שנולד או אומץ ולא עודכן בטופס 101 אצל המעסיק."
            checked={inputs.newChildren > 0}
            onChange={v => set('newChildren', v ? 1 : 0)}
          >
            <Stepper label="כמה ילדים" value={inputs.newChildren} min={1} max={6} onChange={v => set('newChildren', v)} />
          </ToggleCard>
          <ToggleCard
            icon={<Home className="size-5" />}
            title="השתחררתי מצה״ל או משירות לאומי"
            description="עד 36 חודשים מהשחרור מגיעות נקודות זיכוי נוספות."
            checked={inputs.dischargedSoldier}
            onChange={v => set('dischargedSoldier', v)}
          />
          <ToggleCard
            icon={<GraduationCap className="size-5" />}
            title="סיימתי תואר ראשון"
            description="בשנה שקדמה לשנת המס."
            checked={inputs.finishedDegree}
            onChange={v => set('finishedDegree', v)}
          />
          <ToggleCard
            icon={<HandHeart className="size-5" />}
            title="תרמתי למוסד מוכר"
            description="תרומות עם קבלה לפי סעיף 46."
            checked={inputs.donations > 0}
            onChange={v => set('donations', v ? 1000 : 0)}
          >
            <NumberField label="סך התרומות בשנה" value={inputs.donations} onChange={v => set('donations', v)} step={100} />
          </ToggleCard>
          <ToggleCard
            icon={<PiggyBank className="size-5" />}
            title="הפקדתי בעצמי לפנסיה או גמל"
            description="הפקדות עצמאיות, לא דרך תלוש השכר."
            checked={inputs.pensionDeposits > 0}
            onChange={v => set('pensionDeposits', v ? 5000 : 0)}
          >
            <NumberField label="סך ההפקדות בשנה" value={inputs.pensionDeposits} onChange={v => set('pensionDeposits', v)} step={500} />
          </ToggleCard>
          <ToggleCard
            icon={<MapPin className="size-5" />}
            title="גרתי ביישוב מזכה"
            description="יישוב עם הטבת מס שהמעסיק לא יישם."
            checked={inputs.qualifyingLocality}
            onChange={v => set('qualifyingLocality', v)}
          />
          <ToggleCard
            title="יש לי ילד עם לקות למידה"
            description="עם אישור ועדת השמה או אבחון מוכר."
            checked={inputs.childWithLearningDisability}
            onChange={v => set('childWithLearningDisability', v)}
          />
        </div>
      </Group>
    </div>
  );
}
