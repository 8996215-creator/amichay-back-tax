import { useRef, useState, type DragEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FileText, ImageIcon, Lock, Trash2, UploadCloud } from 'lucide-react';
import { Container, SectionHeading } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Mascot } from '@/components/ui/Mascot';
import { Button } from '@/components/ui/Button';
import { LeadSheet } from '@/components/calc/LeadSheet';
import { business } from '@/content/business';
import { useCalculator } from '@/state/calculator';
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_FILES } from '@/lib/leads';

const ACCEPT = ['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/heif'];
const MAX_FILES = MAX_UPLOAD_FILES;
const MAX_MB = Math.floor(MAX_UPLOAD_BYTES / 1024 / 1024);

interface Picked { id: string; file: File }

function fmtSize(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;
}

function isAccepted(f: File) {
  return ACCEPT.includes(f.type) || /\.(pdf|jpe?g|png|heic|heif)$/i.test(f.name);
}

/**
 * Files stay in memory until the visitor submits the lead form; they are then sent with it
 * through Netlify Forms. Limits follow Netlify's (one file per field, 8 MB per request).
 * If the visitor already used the calculator in this tab, those answers go along too.
 */
export default function Upload() {
  const { inputs, estimate, untouched } = useCalculator();
  const [files, setFiles] = useState<Picked[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalBytes = files.reduce((sum, p) => sum + p.file.size, 0);

  function add(list: FileList | File[]) {
    const next = [...files];
    let total = totalBytes;
    let badType = 0, tooMany = 0, tooBig = 0;
    for (const f of Array.from(list)) {
      if (!isAccepted(f)) { badType++; continue; }
      if (next.some(p => p.file.name === f.name && p.file.size === f.size)) continue;
      if (next.length >= MAX_FILES) { tooMany++; continue; }
      if (total + f.size > MAX_UPLOAD_BYTES) { tooBig++; continue; }
      next.push({ id: crypto.randomUUID(), file: f });
      total += f.size;
    }
    setFiles(next);
    const msgs: string[] = [];
    if (badType) msgs.push(`${badType === 1 ? 'קובץ אחד לא נוסף' : `${badType} קבצים לא נוספו`}: רק PDF או תמונה.`);
    if (tooMany) msgs.push(`אפשר לצרף עד ${MAX_FILES} קבצים.`);
    if (tooBig) msgs.push(`הגודל הכולל מוגבל ל-${MAX_MB} MB. אפשר לצלם ברזולוציה נמוכה יותר, או לשלוח את השאר בוואטסאפ אחרי שנחזור אליך.`);
    setError(msgs.length ? msgs.join(' ') : null);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDrag(false);
    add(e.dataTransfer.files);
  }

  return (
    <>
      <Container className="pb-20 pt-10 sm:pt-14">
        <SectionHeading as="h1" eyebrow="יש לי טופס 106" title="הדרך המהירה לבדיקה מדויקת." lead="טופס 106 הוא סיכום השכר והמס השנתי מהמעסיק. איתו אפשר לתת תשובה מדויקת הרבה יותר מכל מחשבון." />

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <div className="space-y-6">
            <div
              role="button"
              tabIndex={0}
              aria-label="בחירת קבצים"
              onClick={() => inputRef.current?.click()}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
              onDragOver={e => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
              className={`group flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-colors ${drag ? 'border-accent bg-accent-soft' : 'border-line-strong bg-surface hover:border-accent/60 hover:bg-surface-2'}`}
            >
              <motion.span animate={drag ? { y: -4, scale: 1.05 } : { y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="grid size-14 place-items-center rounded-2xl bg-navy text-on-navy">
                <UploadCloud className="size-7" />
              </motion.span>
              <p className="mt-4 text-lg font-semibold text-ink">גררו לכאן את טופס 106</p>
              <p className="mt-1 text-[15px] text-ink-2">או לחצו לבחירה. PDF, JPG, PNG או HEIC, עד {MAX_FILES} קבצים ועד {MAX_MB} MB בסך הכל.</p>
              <input
                ref={inputRef}
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.heic,.heif,application/pdf,image/*"
                className="sr-only"
                onChange={e => { if (e.target.files) add(e.target.files); e.target.value = ''; }}
              />
            </div>

            {error && <p className="text-sm text-danger" role="alert">{error}</p>}

            <AnimatePresence initial={false}>
              {files.length > 0 && (
                <motion.ul layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                  <AnimatePresence initial={false}>
                    {files.map(p => (
                      <motion.li
                        key={p.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3"
                      >
                        {p.file.type === 'application/pdf' ? <FileText className="size-5 text-ink-3" /> : <ImageIcon className="size-5 text-ink-3" />}
                        <span className="min-w-0 flex-1 truncate text-[15px] text-ink" dir="auto">{p.file.name}</span>
                        <span className="tnum text-xs text-ink-3">{fmtSize(p.file.size)}</span>
                        <button type="button" aria-label={`הסרת ${p.file.name}`} onClick={() => { setFiles(f => f.filter(x => x.id !== p.id)); setError(null); }} className="grid size-11 place-items-center rounded-full text-ink-3 hover:bg-surface-2 hover:text-danger">
                          <Trash2 className="size-4" />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                  <li className="px-1 pt-1 text-xs text-ink-3">
                    <span className="tnum">{files.length}/{MAX_FILES}</span> קבצים, <span className="tnum" dir="ltr">{fmtSize(totalBytes)}</span> מתוך <span className="tnum" dir="ltr">{MAX_MB} MB</span>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" onClick={() => setLeadOpen(true)}>
                {files.length ? `להמשיך עם ${files.length} ${files.length === 1 ? 'קובץ' : 'קבצים'}` : 'להמשיך בלי קובץ כרגע'}
              </Button>
              {files.length > 0 && <button type="button" onClick={() => { setFiles([]); setError(null); }} className="h-11 rounded-full px-4 text-sm text-ink-3 hover:bg-surface-2">ניקוי הרשימה</button>}
            </div>

            <p className="flex items-start gap-2 text-sm leading-relaxed text-ink-3">
              <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              הקבצים נשלחים אלינו בחיבור מאובטח רק כשממלאים את הפרטים ולוחצים על "שיחזרו אליי", ולא נשמרים בדפדפן. פירוט במדיניות הפרטיות.
            </p>
          </div>

          <aside className="space-y-4">
            <Mascot name="upload" className="mx-auto hidden w-56 lg:block" />
            <Card>
              <h2 className="text-lg font-semibold text-ink">איפה מוצאים טופס 106?</h2>
              <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed text-ink-2">
                <li>המעסיק מחויב להפיק אותו עד סוף מרץ של השנה העוקבת. בדרך כלל הוא נשלח במייל או זמין בפורטל השכר.</li>
                <li>עבדתם אצל כמה מעסיקים? צריך טופס מכל אחד.</li>
                <li>אין לכם? אפשר לבקש מהמעסיק, או שנשלוף יחד מאזור האישי ברשות המסים.</li>
              </ul>
            </Card>
            <Card tone="quiet">
              <h2 className="text-lg font-semibold text-ink">מסמכים נוספים שעוזרים</h2>
              <ul className="mt-3 space-y-1.5 text-[15px] text-ink-2">
                <li>אישור תגמולי מילואים מביטוח לאומי</li>
                <li>אישור דמי אבטלה</li>
                <li>קבלות על תרומות (סעיף 46)</li>
                <li>אישורי הפקדה לפנסיה או גמל</li>
                <li>אישור סיום תואר או תעודת שחרור</li>
              </ul>
            </Card>
            <p className="px-1 text-xs leading-relaxed text-ink-3">{business.representativeNote}</p>
          </aside>
        </div>
      </Container>

      <LeadSheet
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        source="upload"
        files={files.map(p => p.file)}
        inputs={untouched ? undefined : inputs}
        estimate={untouched ? undefined : estimate.refund}
        taxYear={untouched ? undefined : inputs.taxYear}
        title="נשמח לבדוק את הטופס"
      />
    </>
  );
}
