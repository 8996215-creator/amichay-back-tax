import { lazy, Suspense } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { RouterProvider, useRouter } from './router';
import { CalculatorProvider } from '@/state/calculator';
import { ThemeProvider } from '@/state/theme';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';

const Home = lazy(() => import('@/pages/Home'));
const Calculator = lazy(() => import('@/pages/Calculator'));
const Upload = lazy(() => import('@/pages/Upload'));
const Reservists = lazy(() => import('@/pages/Reservists'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const Legal = lazy(() => import('@/pages/Legal'));

function Page() {
  const { route } = useRouter();
  let content: React.ReactNode;
  switch (route) {
    case '/calculator': content = <Calculator />; break;
    case '/upload': content = <Upload />; break;
    case '/reservists': content = <Reservists />; break;
    case '/pricing': content = <Pricing />; break;
    case '/terms': content = <Legal kind="terms" />; break;
    case '/privacy': content = <Legal kind="privacy" />; break;
    case '/accessibility': content = <Legal kind="accessibility" />; break;
    default: content = <Home />;
  }
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={route}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <Suspense fallback={<div className="min-h-[60dvh]" aria-busy="true" />}>{content}</Suspense>
      </motion.div>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
      <RouterProvider>
        <CalculatorProvider>
          <div className="lt-backdrop" aria-hidden="true" />
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-on-accent">
            דילוג לתוכן
          </a>
          <Nav />
          <main id="main" tabIndex={-1} className="outline-none">
            <Page />
          </main>
          <Footer />
        </CalculatorProvider>
      </RouterProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
