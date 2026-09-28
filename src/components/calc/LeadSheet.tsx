import { useState, type FormEvent } from 'react';
import { Mascot } from '@/components/ui/Mascot';
import { Sheet } from '@/components/ui/Sheet';
import { Field, TextArea } from '@/components/ui/Field';
import { Button } from '@/components/ui/Button';
import { Link } from '@/app/router';
import { isValidEmail, isValidIsraeliPhone, normalisePhone, formatILS } from '@/lib/format';
import { submitLead, whatsappLink, type Lead } from '@/lib/leads';
import { business } from '@/content/business';

interface Props {
  open: boolean;
  onClose: () => void;
  source: Lead['source'];
  estimate?: number;
  taxYear?: number;
  inputs?: Lead['inputs'];
  /** Files to attach. Sent with the lead through Netlify Forms. */
  files?: File[];
  title?: string;
}

type Status = 'idle' | 'sending' | 'sent' | 'whatsapp' | 'error';

/**
 * One form for every "talk to us" moment. Sends through Netlify Forms (with any attached files);
 * in local development, where Netlify Forms do not exist, it opens WhatsApp with the details
 * prefilled instead. Nothing is stored in the browser.
 */
export function LeadSheet({ open, onClose, source, estimate, taxYear, inputs, files = [], title = 'נבדוק את זה יחד' }: Props) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');

  function validate() {
    const e: Record<string, string> = {};
    if (fullName.trim().length < 2) e.fullName = 'איך לפנות אליך?';
    if (!isValidIsraeliPhone(phone)) e.phone = 'מספר טלפון ישראלי, למשל 050-1234567';
    if (email && !isValidEmail(email)) e.email = 'כתובת המייל לא נראית תקינה';
    if (!consent) e.consent = 'צריך לאשר כדי שנוכל לחזור אליך';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const lead = (): Lead => ({
    fullName: fullName.trim(),
    phone: normalisePhone(phone),
    email: email.trim() || undefined,
    taxYear,
    estimate,
    inputs,
    source,
    fileNames: files.map(f => f.name),
    note: note.trim() || undefined,
    honeypot: honeypot || undefined,
    consent: true,
  });

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('sending');
    try {
      const accepted = await submitLead(lead(), files);
      setStatus(accepted ? 'sent' : 'whatsapp');
    } catch {
      setStatus('error');
    }
  }

  function close() {
    onClose();
    // Reset after the exit animation so a reopened sheet starts clean.
    setTimeout(() => { setStatus('idle'); setErrors({}); }, 300);
  }

  const wa = whatsappLink(lead());

  return (
    <Sheet open={open} onClose={close} title={title}>
      {status === 'sent' && (
        <div className="py-6 text-center">
          <Mascot name="lead-success" className="mx-auto h-32 w-auto" />
          <h3 className="mt-4 text-lg font-semibold text-ink">
            {files.length ? `קיבלנו את הפרטים ואת ${files.length === 1 ? 'הקובץ' : `${files.length} הקבצים`}. נחזור אליך בקרוב.` : 'קיבלנו. נחזור אליך בקרוב.'}
          </h3>
          <p className="mt-2 text-[15px] text-ink-2">נתקשר או נכתב בוואטסאפ למספר שהשארת, בדרך כלל בתוך יום עסקים.</p>
          <Button className="mt-6" variant="secondary" onClick={close}>סגירה</Button>
        </div>
      )}

      {status === 'whatsapp' && (
        <div className="py-4 text-center">
          <Mascot name="lead-success" className="mx-auto h-32 w-auto" />
          <h3 className="mt-4 text-lg font-semibold text-ink">נמשיך בוואטסאפ</h3>
          <p className="mt-2 text-[15px] text-ink-2">הכנו הודעה עם הפרטים. שלחו אותה ונענה משם.</p>
          <Button className="mt-6 w-full" href={wa}>פתיחת וואטסאפ</Button>
          <Button variant="ghost" onClick={close} className="mt-3 w-full text-ink-2">אולי אחר כך</Button>
        </div>
      )}

      {(status === 'idle' || status === 'sending' || status === 'error') && (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {typeof estimate === 'number' && estimate > 0 && (
            <p className="rounded-2xl bg-accent-soft px-4 py-3 text-[15px] text-ink">
              הערכה ראשונית: <strong className="tnum">{formatILS(estimate)}</strong>. הסכום הסופי נקבע על ידי רשות המסים לאחר בדיקה מלאה.
            </p>
          )}
          <Field label="שם מלא" autoComplete="name" value={fullName} onChange={e => setFullName(e.target.value)} error={errors.fullName} />
          <Field label="טלפון" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={phone} onChange={e => setPhone(e.target.value)} error={errors.phone} />
          <Field label="אימייל (לא חובה)" type="email" inputMode="email" autoComplete="email" dir="ltr" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} />
          <TextArea label="הערות (לא חובה)" rows={2} maxLength={1000} value={note} onChange={e => setNote(e.target.value)} />
          {/* Honeypot for Netlify spam filtering. Hidden from people and screen readers. */}
          <div hidden>
            <label>
              לא למילוי
              <input name="bot-field" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
            </label>
          </div>

          <label className="flex min-h-11 items-start gap-3 py-1 text-sm leading-relaxed text-ink-2">
            <input
              type="checkbox"
              className="mt-0.5 size-6 shrink-0 accent-[var(--color-accent)]"
              checked={consent}
              onChange={e => setConsent(e.target.checked)}
              aria-invalid={!!errors.consent}
            />
            <span>
              אני מאשר/ת ל{business.name} לפנות אליי בנוגע לבדיקת החזר מס, בהתאם ל
              <Link to="/privacy" className="underline underline-offset-4">מדיניות הפרטיות</Link>.
            </span>
          </label>
          {errors.consent && <p className="text-sm text-danger" role="alert">{errors.consent}</p>}

          {status === 'error' && (
            <p className="rounded-2xl bg-danger-soft px-4 py-3 text-sm text-danger" role="alert">
              השליחה לא הצליחה. אפשר לנסות שוב או <a className="underline" href={wa} target="_blank" rel="noopener noreferrer">לכתוב לנו בוואטסאפ</a>.
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={status === 'sending'}>
            {status === 'sending' ? 'שולחים...' : 'שיחזרו אליי'}
          </Button>
          <p className="text-center text-xs leading-relaxed text-ink-3">
            ללא תשלום מקדים. עמלה נגבית רק אם התקבל החזר בפועל.
          </p>
        </form>
      )}
    </Sheet>
  );
}
