import { Mail, MessageCircle, Phone } from 'lucide-react';
import { Link } from '@/app/router';
import { business, legalNav, nav } from '@/content/business';
import { Logo } from '@/components/ui/Logo';
import { Container } from '@/components/ui/Section';
import { Mascot } from '@/components/ui/Mascot';
import { ThemePicker } from '@/components/ui/ThemeToggle';

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line bg-surface/60">
      <Container className="pointer-events-none absolute inset-x-0 bottom-full flex justify-end">
        <Mascot name="footer" className="w-28 translate-y-[7px] sm:w-36" />
      </Container>
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-2">{business.tagline}</p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-3">{business.representativeNote}</p>
          </div>

          <nav aria-label="קישורים">
            <h2 className="text-sm font-semibold text-ink">ניווט</h2>
            <ul className="mt-2 -ms-2">
              {nav.map(i => (
                <li key={i.to}><Link to={i.to} className="flex min-h-11 items-center rounded-lg px-2 text-[15px] text-ink-2 hover:text-ink">{i.label}</Link></li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-ink">יצירת קשר</h2>
            <ul className="mt-2 -ms-2 text-[15px] text-ink-2">
              <li>
                <a className="flex min-h-11 items-center gap-2 rounded-lg px-2 hover:text-ink" href={`https://wa.me/${business.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-4 text-ink-3" /> וואטסאפ
                </a>
              </li>
              <li>
                <a className="flex min-h-11 items-center gap-2 rounded-lg px-2 hover:text-ink" href={`tel:${business.phone}`}>
                  <Phone className="size-4 text-ink-3" /> <span dir="ltr">{business.phone}</span>
                </a>
              </li>
              <li>
                <a className="flex min-h-11 items-center gap-2 rounded-lg px-2 hover:text-ink" href={`mailto:${business.email}`}>
                  <Mail className="size-4 text-ink-3" /> <span dir="ltr">{business.email}</span>
                </a>
              </li>
            </ul>
            <h2 className="mt-8 text-sm font-semibold text-ink">תצוגה</h2>
            <div className="mt-3 max-w-xs"><ThemePicker /></div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {business.legalName}. כל הזכויות שמורות.</p>
          <ul className="-ms-2 flex flex-wrap gap-x-2">
            {legalNav.map(i => (
              <li key={i.to}><Link to={i.to} className="flex min-h-11 items-center rounded-lg px-2 hover:text-ink sm:min-h-0 sm:py-1">{i.label}</Link></li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-ink-3">
          המידע באתר הוא כללי ואינו מהווה ייעוץ מס. תוצאות המחשבון הן הערכה ראשונית בלבד ואינן מחייבות. גובה ההחזר בפועל, אם קיים, נקבע על ידי רשות המסים בלבד.
        </p>
      </Container>
    </footer>
  );
}
