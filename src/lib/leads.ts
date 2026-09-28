import { business } from '@/content/business';
import { estimateRefund, type CalculatorInputs } from './tax';
import { formatILS } from './format';

export interface Lead {
  fullName: string;
  phone: string;
  email?: string;
  taxYear?: number;
  estimate?: number;
  inputs?: CalculatorInputs;
  source: 'calculator' | 'upload' | 'contact';
  fileNames?: string[];
  note?: string;
  /** Honeypot. Real visitors never see the field, so anything here is a bot. */
  honeypot?: string;
  consent: true;
}

/**
 * Netlify Forms limits for file uploads: one file per input, 8 MB per request, 30 s timeout.
 * The hidden form in index.html declares file1..file5, so never send more than that.
 * The byte cap leaves room for the text fields and multipart overhead.
 */
export const MAX_UPLOAD_FILES = 5;
export const MAX_UPLOAD_BYTES = 7 * 1024 * 1024;

/** Must match the hidden forms in index.html, or Netlify drops the submission. */
const FORM_TEXT = 'tax-lead';
const FORM_FILES = 'advanced-file-lead';

const SOURCE_LABEL: Record<Lead['source'], string> = {
  calculator: 'מחשבון זכאות',
  upload: 'עמוד "יש לי טופס 106"',
  contact: 'יצירת קשר',
};

const yesNo = (b: boolean) => (b ? 'כן' : 'לא');

/** Short Hebrew list of what in the answers points to a refund. Mirrors the old site's field. */
export function eligibilityReasons(i: CalculatorInputs): string[] {
  const r: string[] = [];
  if (i.monthsWorked < 12) r.push(`עבד/ה ${i.monthsWorked} חודשים מתוך 12`);
  if (i.changedEmployer) r.push('החליף/ה מקום עבודה ללא תיאום מס');
  if (i.unemploymentMonths > 0) r.push(`קיבל/ה דמי אבטלה (${i.unemploymentMonths} חודשים)`);
  if (i.reservist) {
    const days = i.reserveDays > 0 ? ` (${i.reserveDays} ימים)` : '';
    const direct = i.reservePaidDirectly ? ', תגמולים ישירות מביטוח לאומי' : '';
    r.push(`שירת/ה במילואים${days}${direct}`);
  }
  if (i.newChildren > 0) r.push(`ילדים שנולדו או אומצו בשנה (${i.newChildren})`);
  if (i.dischargedSoldier) r.push('חייל/ת משוחרר/ת או מסיים/ת שירות לאומי');
  if (i.finishedDegree) r.push('סיים/ה תואר ראשון');
  if (i.childWithLearningDisability) r.push('הורה לילד עם לקות למידה');
  if (i.donations > 0) r.push(`תרומות לפי סעיף 46 (${formatILS(i.donations)})`);
  if (i.pensionDeposits > 0) r.push(`הפקדות עצמאיות לפנסיה (${formatILS(i.pensionDeposits)})`);
  if (i.qualifyingLocality) r.push('מגורים ביישוב מזכה');
  return r;
}

/** Plain-text Hebrew summary of the calculator answers, for the notification email. */
export function calculatorSummary(i: CalculatorInputs): string {
  const e = estimateRefund(i);
  const lines = [
    `שנת מס: ${i.taxYear}`,
    `מגדר: ${i.gender === 'female' ? 'אישה' : 'גבר'}`,
    `שכר ברוטו חודשי: ${formatILS(i.monthlySalary)}`,
    `חודשי עבודה: ${i.monthsWorked}`,
    `החלפת מעסיק ללא תיאום: ${yesNo(i.changedEmployer)}`,
    `חודשי אבטלה: ${i.unemploymentMonths}`,
    `מילואים: ${i.reservist ? `כן, ${i.reserveDays} ימים${i.reservePaidDirectly ? ', תגמולים מביטוח לאומי' : ''}` : 'לא'}`,
    `ילדים חדשים: ${i.newChildren}`,
    `חייל/ת משוחרר/ת: ${yesNo(i.dischargedSoldier)}`,
    `סיום תואר: ${yesNo(i.finishedDegree)}`,
    `ילד עם לקות למידה: ${yesNo(i.childWithLearningDisability)}`,
    `תרומות: ${formatILS(i.donations)}`,
    `הפקדות עצמאיות לפנסיה: ${formatILS(i.pensionDeposits)}`,
    `יישוב מזכה: ${yesNo(i.qualifyingLocality)}`,
    '',
    `הערכת החזר: ${formatILS(e.refund)}`,
    `מס שנוכה (הערכה): ${formatILS(e.withheld)}`,
    `חבות מס (הערכה): ${formatILS(e.liability)}`,
  ];
  if (e.breakdown.length) {
    lines.push('פירוט:');
    for (const b of e.breakdown) lines.push(`- ${b.label}: ${formatILS(b.amount)}`);
  }
  return lines.join('\n');
}

function fmtSize(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
}

function fields(lead: Lead, formName: string, files: File[]): Record<string, string> {
  const f: Record<string, string> = {
    'form-name': formName,
    'bot-field': lead.honeypot ?? '',
    source: SOURCE_LABEL[lead.source],
    fullName: lead.fullName,
    phone: lead.phone,
    email: lead.email ?? '',
    taxYear: lead.taxYear ? String(lead.taxYear) : '',
    estimate: typeof lead.estimate === 'number' ? String(lead.estimate) : '',
    isMiloimnik: lead.inputs ? yesNo(lead.inputs.reservist) : '',
    comments: lead.note ?? '',
    extraDetails: lead.inputs ? calculatorSummary(lead.inputs) : '',
    eligibilityReasons: lead.inputs ? eligibilityReasons(lead.inputs).join('; ') : '',
    consent: 'כן',
  };
  if (files.length) f.attachmentsList = files.map(x => `${x.name} (${fmtSize(x.size)})`).join(', ');
  return f;
}

/**
 * Sends a lead to Netlify Forms (the site is hosted on Netlify, which also emails the notification).
 * Leads with files go to the multipart "advanced-file-lead" form, the rest to "tax-lead".
 *
 * Returns true when Netlify accepted it. Returns false in local development, where Netlify Forms
 * do not exist; the caller then falls back to WhatsApp. Throws when the request fails.
 */
export async function submitLead(lead: Lead, files: File[] = []): Promise<boolean> {
  if (import.meta.env.DEV) return false;

  const attached = files.slice(0, MAX_UPLOAD_FILES);
  let res: Response;
  if (attached.length) {
    const body = new FormData();
    for (const [k, v] of Object.entries(fields(lead, FORM_FILES, attached))) body.append(k, v);
    attached.forEach((file, i) => body.append(`file${i + 1}`, file, file.name));
    res = await fetch('/', { method: 'POST', body });
  } else {
    res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(fields(lead, FORM_TEXT, [])).toString(),
    });
  }
  if (!res.ok) throw new Error(`Netlify Forms returned ${res.status}`);
  return true;
}

/** WhatsApp deep link with a prefilled message. Works without any backend. */
export function whatsappLink(lead: Partial<Lead>): string {
  const lines = [`שלום, אשמח לבדיקת החזר מס.`];
  if (lead.fullName) lines.push(`שם: ${lead.fullName}`);
  if (lead.phone) lines.push(`טלפון: ${lead.phone}`);
  if (lead.taxYear) lines.push(`שנת מס: ${lead.taxYear}`);
  if (typeof lead.estimate === 'number' && lead.estimate > 0) lines.push(`הערכה ראשונית באתר: ${formatILS(lead.estimate)}`);
  if (lead.inputs?.reservist) lines.push(`שירות מילואים: כן`);
  if (lead.fileNames?.length) lines.push(`מסמכים שאצרף: ${lead.fileNames.join(', ')}`);
  if (lead.note) lines.push(lead.note);
  return `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`;
}
