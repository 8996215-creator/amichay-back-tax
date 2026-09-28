import { useState } from 'react';
import { Check } from 'lucide-react';
import { business } from '@/content/business';
import { formatILS } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { Slider } from '@/components/ui/Slider';
import { Segmented } from '@/components/ui/Segmented';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Reveal } from '@/components/ui/Reveal';
import { type QA } from '@/components/ui/Accordion';
import { FaqSection } from '@/components/FaqSection';

const included = [
  'בדיקת זכאות מלאה לכל שנות המס הפתוחות',
  'איסוף המסמכים והכוונה מה חסר',
  'הכנה והגשה של הבקשה על ידי מייצג מורשה',
  'טיפול בפניות והבהרות מרשות המסים',
  'מעקב עד שההחזר מגיע לחשבון',
];

const faq: QA[] = [
  { q: 'מתי משלמים?', a: 'רק אחרי שההחזר התקבל בחשבון הבנק שלך מרשות המסים. אז נשלח חשבונית על העמלה.' },
  { q: 'מה אם לא יימצא החזר?', a: 'לא משלמים כלום. הבדיקה, כולל בדיקת המסמכים, היא ללא עלות.' },
  { q: 'העמלה כוללת מע"מ?', a: business.fees.vatIncluded ? 'כן, השיעורים המוצגים כוללים מע"מ.' : 'השיעורים המוצגים הם לפני מע"מ, כנדרש בחוק. בחשבונית יתווסף מע"מ על העמלה בלבד.' },
  { q: 'יש עמלה על כמה שנים?', a: 'העמלה מחושבת על סך ההחזר שהתקבל, לא לפי מספר השנים. שנה שלא הניבה החזר לא עולה כלום.' },
  { q: 'אפשר להפסיק באמצע?', a: 'עד ההגשה לרשות המסים אפשר לעצור בכל רגע, בלי עלות. אחרי ההגשה הבקשה כבר בטיפול הרשות ולא ניתן למשוך אותה.' },
];

export default function Pricing() {
  const [refund, setRefund] = useState(5000);
  const [track, setTrack] = useState<'standard' | 'reservist'>('standard');
  const rate = business.fees[track];
  const fee = Math.round(refund * rate / 100);

  return (
    <>
      <Container className="pt-10 sm:pt-14">
        <SectionHeading as="h1" eyebrow="עלויות" title="מודל אחד. ברור מההתחלה." lead="אחוז קבוע מההחזר שהתקבל בפועל. בלי דמי פתיחה, בלי מינימום, בלי הפתעות בסוף." />
      </Container>

      <Section className="pt-10">
        <Container>
          <div className="grid gap-4 md:grid-cols-2">
            <Reveal>
              <Card padding="lg" className="h-full">
                <p className="text-sm font-semibold text-ink-3">מסלול רגיל</p>
                <p className="mt-2 flex items-baseline gap-1"><span className="tnum text-6xl font-bold tracking-tight text-ink">{business.fees.standard}%</span><span className="text-ink-2">מההחזר</span></p>
                <p className="mt-2 text-[15px] text-ink-2">לכל שכיר או שכירה. משלמים רק על מה שהתקבל.</p>
              </Card>
            </Reveal>
            <Reveal delay={0.07}>
              <Card tone="navy" padding="lg" className="relative h-full overflow-hidden">
                <p className="text-sm font-semibold text-on-navy-2">משרתי מילואים</p>
                <p className="mt-2 flex items-baseline gap-1"><span className="tnum text-6xl font-bold tracking-tight">{business.fees.reservist}%</span><span className="text-on-navy-2">מההחזר</span></p>
                <p className="mt-2 text-[15px] text-on-navy-2">למי ששירת במילואים בשנת המס הרלוונטית.</p>
              </Card>
            </Reveal>
          </div>
          <p className="mt-3 text-xs text-ink-3">{business.fees.vatIncluded ? 'השיעורים כוללים מע"מ.' : 'השיעורים לפני מע"מ.'}</p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <Reveal>
              <SectionHeading eyebrow="מה כלול" title="הכול, מההתחלה ועד הכסף בחשבון." />
              <ul className="mt-8 space-y-3">
                {included.map(i => (
                  <li key={i} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-success-soft text-success"><Check className="size-3.5" /></span>
                    {i}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.08}>
              <Card padding="lg">
                <h2 className="text-lg font-semibold text-ink">כמה נשאר אצלי?</h2>
                <div className="mt-5 space-y-5">
                  <Segmented label="מסלול" value={track} options={[{ value: 'standard', label: 'רגיל' }, { value: 'reservist', label: 'מילואים' }]} onChange={setTrack} size="sm" />
                  <Slider label="החזר לדוגמה" value={refund} min={500} max={30000} step={250} onChange={setRefund} format={formatILS} />
                </div>
                <dl className="mt-6 divide-y divide-line text-[15px]">
                  <div className="flex items-center justify-between py-3"><dt className="text-ink-2">העמלה ({rate}%)</dt><dd className="tnum font-medium text-ink">{formatILS(fee)}</dd></div>
                  <div className="flex items-center justify-between py-3"><dt className="font-semibold text-ink">נשאר אצלך</dt><dd><AnimatedNumber value={refund - fee} className="text-2xl font-bold text-ink" /></dd></div>
                </dl>
                <p className="mt-3 text-xs text-ink-3">דוגמה להמחשה בלבד{business.fees.vatIncluded ? '' : ', לפני מע"מ'}.</p>
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      <FaqSection eyebrow="שאלות על תשלום" title="בלי אותיות קטנות." items={faq}>
        <Button to="/calculator" size="lg">לבדוק אם מגיע לי החזר</Button>
      </FaqSection>
    </>
  );
}
