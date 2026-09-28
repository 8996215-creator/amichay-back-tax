import { ArrowLeft, Shield } from 'lucide-react';
import { useCalculator } from '@/state/calculator';
import { business } from '@/content/business';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { Mascot } from '@/components/ui/Mascot';
import { Reveal } from '@/components/ui/Reveal';
import { type QA } from '@/components/ui/Accordion';
import { FaqSection } from '@/components/FaqSection';

const faq: QA[] = [
  { q: 'שירתתי דרך המעסיק. גם אז יכול להיות החזר?', a: 'כן. המעסיק מקבל את התגמול מביטוח לאומי ומשלם דרך התלוש. אם באותה שנה הייתה גם תקופה בלי שכר או החלפת עבודה, החישוב השנתי לא תמיד מתיישר, ואפשר לבדוק.' },
  { q: 'קיבלתי תגמול ישירות מביטוח לאומי. מה קורה עם המס?', a: 'ביטוח לאומי מנכה מס במקור בשיעור שאינו מתחשב בנקודות הזיכוי האישיות שלך. לעיתים קרובות זה מוביל לניכוי יתר שאפשר לדרוש בחזרה.' },
  { q: 'אני עצמאי. זה רלוונטי?', a: 'כן, אבל המסלול שונה: תגמולי המילואים נכללים בדוח השנתי. נשמח לבדוק גם את זה, בשיחה קצרה.' },
  { q: 'איזה מסמך צריך?', a: 'אישור שנתי על תגמולי מילואים מהאזור האישי בביטוח לאומי, וטופס 106 מהמעסיק. אם אין, נכוון איך להשיג.' },
  { q: 'למה העמלה נמוכה יותר למילואימניקים?', a: `כי זה חשוב לנו. משרתי מילואים משלמים ${business.fees.reservist}% מההחזר במקום ${business.fees.standard}%, ורק אם ההחזר התקבל.` },
];

export default function Reservists() {
  const { patch } = useCalculator();
  return (
    <>
      <Container className="pt-10 sm:pt-14">
        <Reveal>
          <Card tone="navy" padding="lg" className="relative overflow-hidden">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <span className="inline-grid size-12 place-items-center rounded-2xl bg-white/10 rim"><Shield className="size-6" /></span>
                <SectionHeading
                  as="h1"
                  onNavy
                  eyebrow="משרתי מילואים"
                  title="שירתת. שילמת מס. חלק ממנו כנראה מגיע בחזרה."
                  lead="תגמולי מילואים הם הכנסה חייבת במס, אבל שיעור המס שנוכה מהם במקור לא תמיד תואם את המס האמיתי שלך לאותה שנה. בדיקה קצרה יכולה להראות אם נוכה יותר מדי."
                />
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button size="lg" to="/calculator" onClick={() => patch({ reservist: true, reserveDays: 30 })}>
                    לבדיקה מותאמת למילואים <ArrowLeft className="size-4" />
                  </Button>
                  <Button size="lg" variant="onNavy" to="/upload">יש לי את האישורים</Button>
                </div>
              </div>
              <Mascot name="reservist" priority float className="hidden w-48 lg:block xl:w-56" />
            </div>
          </Card>
        </Reveal>
      </Container>

      <Section>
        <Container>
          <Reveal><SectionHeading eyebrow="מה בודקים" title="שלושה מצבים שחוזרים על עצמם." /></Reveal>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ['ניכוי במקור גבוה', 'ביטוח לאומי מנכה מס מהתגמול ללא נקודות הזיכוי האישיות. ההחזר מגיע כשמחשבים את השנה כולה.'],
              ['שנה חלקית', 'תקופת מילואים ארוכה לצד חודשים ללא שכר. המס נוכה כאילו כל השנה הייתה עם הכנסה מלאה.'],
              ['שני מקורות הכנסה', 'תלוש מהמעסיק ותגמול מביטוח לאומי באותה שנה, בלי תיאום מס ביניהם.'],
            ].map(([t, d], i) => (
              <Reveal as="li" key={t} delay={i * 0.07}>
                <Card className="h-full">
                  <span className="tnum text-sm font-semibold text-accent-text">0{i + 1}</span>
                  <h3 className="mt-2 text-xl font-semibold text-ink">{t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{d}</p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal>
            <Card tone="quiet" padding="lg" className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-ink">עמלה מופחתת למשרתי מילואים</h2>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-2">
                  {business.fees.reservist}% מההחזר שהתקבל בפועל, לעומת {business.fees.standard}% במסלול הרגיל. אין תשלום מקדים ואין תשלום אם לא התקבל החזר.
                </p>
              </div>
              <Button to="/pricing" variant="secondary" size="lg">כל פרטי העלויות</Button>
            </Card>
          </Reveal>
        </Container>
      </Section>

      <FaqSection eyebrow="שאלות של מילואימניקים" title="מה ששואלים אותנו." items={faq} />
    </>
  );
}
