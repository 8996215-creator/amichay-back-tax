import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme, type ThemeMode } from '@/state/theme';
import { Segmented } from './Segmented';

/** One-tap flip between light and dark. Lives in the nav. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { resolved, toggle } = useTheme();
  const reduce = useReducedMotion();
  const dark = resolved === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'מעבר למצב בהיר' : 'מעבר למצב כהה'}
      title={dark ? 'מצב בהיר' : 'מצב כהה'}
      className={`relative grid size-11 place-items-center overflow-hidden rounded-full text-ink hover:bg-ink/5 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={resolved}
          initial={reduce ? { opacity: 0 } : { opacity: 0, rotate: -40, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, rotate: 40, scale: 0.7 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="grid place-items-center"
        >
          {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/** Three-way picker (light / dark / follow system) for the footer and mobile menu. */
export function ThemePicker() {
  const { mode, setMode } = useTheme();
  return (
    <Segmented<ThemeMode>
      label="תצוגה"
      value={mode}
      options={[{ value: 'light', label: 'בהיר' }, { value: 'dark', label: 'כהה' }, { value: 'system', label: 'אוטומטי' }]}
      onChange={setMode}
      size="sm"
    />
  );
}
