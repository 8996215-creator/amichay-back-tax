import { motion } from 'motion/react';
import { ArrowLeft, Baby, Briefcase, CalendarDays, FileCheck2, GraduationCap, Landmark, ShieldCheck, Shield, Upload, Wallet, MessageSquareText } from 'lucide-react';
import { useCalculator } from '@/state/calculator';
import { formatILS } from '@/lib/format';
import { business } from '@/content/business';
import { Link } from '@/app/router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import { Slider } from '@/components/ui/Slider';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { RefundBar } from '@/components/ui/RefundBar';
import { Reveal } from '@/components/ui/Reveal';
import { type QA } from '@/components/ui/Accordion';
import { FaqSection } from '@/components/FaqSection';
import { Mascot, type MascotName } from '@/components/ui/Mascot';

const situations = [
  { icon: Briefcase, title: 'החלפת מקום עבודה', text: 'שני תלושים בשנה אחת, בלי תיאום מס, מובילים לרוב לניכוי יתר.' },
  { icon: CalendarDays, title: 'עבודה בחלק מהשנה', text: 'המס מחושב לפי שכר שנתי מלא, גם אם עבדת רק חלק מהחודשים.' },
  { icon: Shield, title: 'שירות מילואים', text: 'תגמולי מילואים מחויבים לפעמים בשיעור גבוה מהמס שבאמת מגיע.' },
  { icon: Baby, title: 'ילד שנולד', text: 'נקודות זיכוי שלא עודכנו אצל המעסיק פשוט לא נספרו.' },
  { icon: GraduationCap, title: 'סיום תואר או שחרור', text: 'זכאות לנקודות זיכוי שהרבה מעסיקים לא יודעים ליישם.' },
  { icon: Wallet, title: 'אבטלה, תרומות, פנסיה', text: 'הכנסות ותשלומים שמשנים את חישוב המס השנתי.' },
];

const steps: { icon: typeof MessageSquareText; mascot: MascotName; title: string; text: string }[] = [
  { icon: MessageSquareText, mascot: 'step-check', title: 'בודקים', text: 'ממלאים כמה פרטים כאן באתר או שולחים טופס 106. תוך דקה יש הערכה ראשונית.' },
  { icon: FileCheck2, mascot: 'step-file', title: 'מגישים', text: 'מייצג מורשה מכין ומגיש את הבקשה לרשות המסים, ומטפל בכל שאלה שעולה בדרך.' },
  { icon: Landmark, mascot: 'step-refund', title: 'מקבלים', text: `ההחזר מועבר ישירות לחשבון הבנק שלך מרשות המסים, בדרך כלל בתוך ${business.processingDays.min} עד ${business.processingDays.max} ימים.` },
];

const faq: QA[] = [
  { q: 'כמה זה עולה?', a: `אין תשלום מקדים. אם התקבל החזר, העמלה היא ${business.fees.standard}% ממנו (${business.fees.reservist}% למשרתי מילואים). אם לא התקבל החזר, לא משלמים כלום.` },
  { q: 'לכמה שנים אחורה אפשר לבקש החזר?', a: 'לפי החוק, עד שש שנות מס אחורה. כלומר בשנת 2026 אפשר עדיין לבקש על 2020 ואילך.' },
  { q: 'איזה מסמכים צריך?', a: 'בעיקר טופס 106 מכל מעסיק באותה שנה. לפי המצב גם אישורים על תרומות, הפקדות לפנסיה, דמי אבטלה או תגמולי מילואים. נכוון בדיוק מה צריך.' },
  { q: 'האם ההערכה באתר מחייבת?', a: 'לא. המחשבון נותן הערכה על סמך הנתונים שהוזנו. הסכום הסופי נקבע על ידי רשות המסים אחרי בדיקה מלאה של כל המסמכים.' },
  { q: 'מה אם יתברר שאני חייב מס?', a: 'לפני כל הגשה בודקים את התמונה המלאה. אם עולה חשש לחוב, נסביר את המצב ולא נגיש בלי אישור מפורש שלך.' },
];

function HeroCalculator() {
  const { inputs, estimate, set, pristine } = useCalculator();
  return (
    <Card tone="navy" padding="lg" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -end-20 -top-20 size-64 rounded-full bg-accent/25 blur-3xl" aria-hidden="true" />
      <p className="text-sm font-medium text-on-navy-2">הערכה מהירה לשנת {inputs.taxYear}</p>
      <AnimatedNumber value={estimate.refund} className="mt-1 block text-[44px] font-bold leading-none tracking-tight sm:text-[52px]" />
      <div className="mt-5"><RefundBar withheld={estimate.withheld} refund={estimate.refund} onNavy /></div>
      {pristine && (
        <p className="mt-3 text-sm leading-snug text-on-navy-2">הזיזו את הסליידרים כדי לראות איך חודשים בלי שכר משנים את התמונה.</p>
      )}

      <div className="mt-7 space-y-5">
        <Slider label="שכר חודשי ברוטו" value={inputs.monthlySalary} min={3000} max={60000} step={500} onChange={v => set('monthlySalary', v)} format={formatILS} onNavy />
        <Slider label="חודשי עבודה בשנה" value={inputs.monthsWorked} min={1} max={12} onChange={v => set('monthsWorked', v)} format={v => (v === 12 ? 'שנה מלאה' : `${v} חודשים`)} onNavy />
      </div>

      <Button to="/calculator" size="lg" className="mt-7 w-full">
        להמשיך לבדיקה המלאה <ArrowLeft className="size-4" />
      </Button>
      <p className="mt-3 text-center text-xs text-on-navy-2">הערכה בלבד. הסכום הסופי נקבע על ידי רשות המסים.</p>
    </Card>
  );
}

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Container className="pt-10 sm:pt-16 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <motion.div className="relative min-w-0" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            {/* Missy: beside the headline on phones and tablets, sitting by the CTAs on desktop */}
            <Mascot name="hero" priority float className="absolute end-0 top-10 w-24 sm:top-8 sm:w-40 lg:-end-6 lg:-bottom-8 lg:top-auto lg:w-48" />
            <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-sm font-medium text-accent-text">
              <ShieldCheck className="size-4" /> ללא תשלום מקדים
            </p>
            <h1 className="mt-5 pe-24 text-hero font-bold leading-[1.05] tracking-tight text-ink sm:pe-40 lg:pe-0">
              המס שלך.
              <br />
              <span className="text-ink-brand">בחזרה אליך.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-2">
              שכירים רבים משלמים מס יותר מדי בלי לדעת: החלפת עבודה, חודשים בלי שכר, מילואים או ילד חדש. אנחנו בודקים, מגישים, ומקבלים תשלום רק אם ההחזר הגיע.
            </p>
            {/* Reserve the owl's footprint on desktop; the CTAs wrap rather than run under it */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:pe-44">
              <Button to="/calculator" size="lg" className="w-full sm:w-auto">בדיקת זכאות בדקה</Button>
              <Button to="/upload" size="lg" variant="secondary" className="w-full sm:w-auto"><Upload className="size-4" /> יש לי טופס 106</Button>
            </div>
            <p className="mt-6 text-sm text-ink-3 lg:pe-44">{business.representativeNote}</p>
          </motion.div>

          <motion.div className="min-w-0" initial={{ opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
            <HeroCalculator />
          </motion.div>
        </div>
      </Container>

      {/* How it works */}
      <Section>
        <Container>
          <Reveal><SectionHeading eyebrow="איך זה עובד" title="שלושה שלבים. אנחנו עושים את העבודה." /></Reveal>
          <ol className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.08}>
                <Card className="h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 place-items-center rounded-xl bg-ink text-bg"><s.icon className="size-5" /></span>
                      <span className="tnum text-sm font-semibold text-ink-3">0{i + 1}</span>
                    </div>
                    <Mascot name={s.mascot} className="-mb-3 -me-2 -mt-1 h-24 w-auto sm:h-28" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-ink">{s.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{s.text}</p>
                </Card>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Who */}
      <Section>
        <Container>
          <Reveal><SectionHeading eyebrow="למי זה רלוונטי" title="אם אחד מאלה קרה לך, כדאי לבדוק." lead="אלה המצבים הנפוצים שבהם המעסיק מנכה יותר מס מהנדרש. ברוב המקרים אפשר לתקן עד שש שנים אחורה." /></Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {situations.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.05}>
                <Card tone="quiet" className="h-full">
                  <s.icon className="size-6 text-accent-text" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{s.text}</p>
                </Card>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Reservists */}
      <Section>
        <Container>
          <Reveal>
            <Card tone="navy" padding="lg" className="relative overflow-hidden">
              <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
                <Mascot name="reservist" float className="hidden w-40 lg:block" />
                <div>
                  <SectionHeading onNavy eyebrow="משרתי מילואים" title="שירתת? יש סיכוי טוב שנוכה לך מס ביתר." lead="תגמולי מילואים עוברים דרך המעסיק או ביטוח לאומי, ולא פעם המס עליהם מחושב כאילו מדובר בהכנסה נוספת. למשרתי מילואים אנחנו גובים עמלה מופחתת." />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Button to="/reservists" variant="primary" size="lg">מה מגיע למילואימניקים</Button>
                  <Button to="/calculator" variant="onNavy" size="lg">לבדיקה מהירה</Button>
                </div>
              </div>
            </Card>
          </Reveal>
        </Container>
      </Section>

      {/* Trust */}
      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <Reveal><SectionHeading eyebrow="למה איתנו" title="שקוף, פשוט, ובלי סיכון מהצד שלך." /></Reveal>
            <ul className="grid gap-6 sm:grid-cols-2">
              {[
                ['משלמים רק על תוצאה', `העמלה נגזרת מההחזר שהתקבל בפועל. אין החזר, אין תשלום.`],
                ['מייצג מורשה', 'הבקשה מוגשת על ידי בעל רישיון, שמלווה גם אם רשות המסים מבקשת הבהרות.'],
                ['בלי הפתעות', 'לפני ההגשה מקבלים תמונה מלאה, כולל סיכון לחוב אם יש כזה.'],
                ['המסמכים שלך אצלך', 'המחשבון עובד בדפדפן בלבד. מסמכים נשלחים רק כשמחליטים להתקדם.'],
              ].map(([t, d], i) => (
                <Reveal as="li" key={t} delay={i * 0.05}>
                  <h3 className="text-lg font-semibold text-ink">{t}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{d}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <FaqSection eyebrow="שאלות נפוצות" title="מה שרוב האנשים שואלים קודם." items={faq}>
        <p className="text-sm text-ink-3">
          עוד שאלות? <Link to="/pricing" className="underline underline-offset-4">פירוט העלויות</Link> או <a className="underline underline-offset-4" href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer">וואטסאפ</a>.
        </p>
      </FaqSection>

      {/* CTA */}
      <Section>
        <Container>
          <Reveal>
            <div className="rounded-3xl border border-line bg-surface p-8 text-center shadow-1 sm:p-12">
              <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">דקה אחת. אולי כמה אלפי שקלים.</h2>
              <p className="mx-auto mt-3 max-w-md text-[17px] text-ink-2">בדיקת הזכאות לא דורשת פרטים מזהים ולא מחייבת לכלום.</p>
              <Button to="/calculator" size="lg" className="mt-8">בדיקת זכאות בדקה <ArrowLeft className="size-4" /></Button>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
