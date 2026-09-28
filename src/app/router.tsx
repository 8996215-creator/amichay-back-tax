import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode, type MouseEvent } from 'react';

export type Route = '/' | '/calculator' | '/upload' | '/reservists' | '/pricing' | '/terms' | '/privacy' | '/accessibility';

const ROUTES: Route[] = ['/', '/calculator', '/upload', '/reservists', '/pricing', '/terms', '/privacy', '/accessibility'];

function parse(hash: string): Route {
  const path = hash.replace(/^#/, '') || '/';
  return (ROUTES as string[]).includes(path) ? (path as Route) : '/';
}

interface RouterValue {
  route: Route;
  navigate: (to: Route, opts?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterValue | null>(null);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));

  useEffect(() => {
    const onHash = () => setRoute(parse(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    // New page: start at the top, and move focus to the main landmark for keyboard and screen-reader users.
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    const main = document.getElementById('main');
    main?.focus({ preventScroll: true });
  }, [route]);

  const navigate = useCallback((to: Route, opts?: { replace?: boolean }) => {
    const next = `#${to}`;
    if (window.location.hash === next) return;
    if (opts?.replace) window.history.replaceState(null, '', next);
    else window.location.hash = to;
    if (opts?.replace) setRoute(to);
  }, []);

  const value = useMemo(() => ({ route, navigate }), [route, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside RouterProvider');
  return ctx;
}

/** Anchor that keeps real hrefs (open in new tab, copy link) while using the router on click. */
export function Link({ to, className, children, onClick, ...rest }: { to: Route; className?: string; children: ReactNode; onClick?: () => void } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'onClick'>) {
  const { navigate, route } = useRouter();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onClick?.();
    navigate(to);
  };
  return (
    <a href={`#${to}`} onClick={handle} className={className} aria-current={route === to ? 'page' : undefined} {...rest}>
      {children}
    </a>
  );
}
