import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { Link, useRouter } from '@/app/router';
import { nav } from '@/content/business';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { ThemePicker, ThemeToggle } from '@/components/ui/ThemeToggle';

export function Nav() {
  const { route } = useRouter();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => setOpen(false), [route]);

  useEffect(() => {
    const onScroll = () => document.documentElement.setAttribute('data-scrolled', String(window.scrollY > 12));
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div className="lt-scroll-edge" aria-hidden="true" />
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
        <nav aria-label="ניווט ראשי" className="glass mx-auto flex h-14 max-w-6xl items-center justify-between rounded-full pe-2 ps-4 sm:h-16 sm:pe-3 sm:ps-5">
          <Link to="/" className="rounded-full" aria-label="מיסי לנדר, לדף הראשי">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 md:flex">
            {nav.map(item => {
              const on = route === item.to;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`relative block rounded-full px-3.5 py-2 text-[15px] font-medium transition-colors ${on ? 'text-ink' : 'text-ink-2 hover:text-ink'}`}
                  >
                    {item.label}
                    {on && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute inset-x-3.5 -bottom-0.5 h-0.5 rounded-full bg-accent"
                        transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Button to="/calculator" className="max-sm:hidden">בדיקת זכאות בדקה</Button>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full text-ink hover:bg-ink/5 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'סגירת תפריט' : 'פתיחת תפריט'}
              onClick={() => setOpen(v => !v)}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button type="button" aria-label="סגירת תפריט" className="absolute inset-0" style={{ backgroundColor: 'var(--scrim)' }} onClick={() => setOpen(false)} />
            <motion.div
              className="glass absolute inset-x-3 top-20 rounded-3xl p-3"
              initial={reduce ? false : { y: -12, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={reduce ? undefined : { y: -12, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 34 }}
            >
              <ul className="flex flex-col">
                {nav.map(item => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex h-13 items-center rounded-2xl px-4 text-lg font-medium ${route === item.to ? 'bg-ink/5 text-ink' : 'text-ink-2'}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="p-2 pt-3">
                <Button to="/calculator" size="lg" className="w-full">בדיקת זכאות בדקה</Button>
              </div>
              <div className="border-t border-line/60 p-2 pt-3"><ThemePicker /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
