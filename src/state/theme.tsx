import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';
type Resolved = 'light' | 'dark';

const KEY = 'landers-tax.theme';
const query = () => window.matchMedia('(prefers-color-scheme: dark)');

function readMode(): ThemeMode {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'light' || v === 'dark' ? v : 'system';
  } catch { return 'system'; }
}

function resolve(mode: ThemeMode): Resolved {
  return mode === 'system' ? (query().matches ? 'dark' : 'light') : mode;
}

let switchTimer: number | undefined;

type ViewTransitionDocument = Document & { startViewTransition?: (update: () => void) => { finished: Promise<void> } };

function apply(resolved: Resolved) {
  const html = document.documentElement;
  const commit = () => {
    html.setAttribute('data-theme', resolved);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#0B1226' : '#F6F7FB');
  };
  if (html.getAttribute('data-theme') === resolved) return commit();

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doc = document as ViewTransitionDocument;

  // Preferred: crossfade a snapshot of the whole page (text, gradients, logo included) with the
  // View Transitions API. Duration lives in index.css under ::view-transition-*(root).
  if (!reduce && typeof doc.startViewTransition === 'function') {
    doc.startViewTransition(commit);
    return;
  }

  // Fallback: per-property CSS transitions while [data-theme-switching] is set (see index.css).
  if (!reduce) {
    html.setAttribute('data-theme-switching', '');
    window.clearTimeout(switchTimer);
    switchTimer = window.setTimeout(() => html.removeAttribute('data-theme-switching'), 500);
  }
  commit();
}

interface ThemeValue {
  mode: ThemeMode;
  resolved: Resolved;
  setMode: (m: ThemeMode) => void;
  /** Flip between light and dark, starting from whatever is currently shown. */
  toggle: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

/** Mirrors the inline script in index.html so there is never a flash; owns changes after boot. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readMode);
  const [resolved, setResolved] = useState<Resolved>(() => resolve(readMode()));

  useEffect(() => {
    const r = resolve(mode);
    setResolved(r);
    apply(r);
    if (mode !== 'system') return;
    const mq = query();
    const onChange = () => { const next = resolve('system'); setResolved(next); apply(next); };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [mode]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    try { m === 'system' ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, m); } catch { /* private mode */ }
  }, []);

  const toggle = useCallback(() => setMode(resolved === 'dark' ? 'light' : 'dark'), [resolved, setMode]);

  const value = useMemo(() => ({ mode, resolved, setMode, toggle }), [mode, resolved, setMode, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
