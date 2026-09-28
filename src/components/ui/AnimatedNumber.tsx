import { useEffect, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useSpring } from 'motion/react';
import { formatILS } from '@/lib/format';

interface Props {
  value: number;
  className?: string;
  format?: (n: number) => string;
}

/** Counts toward the new value with a spring; jumps instantly under reduced motion. */
export function AnimatedNumber({ value, className = '', format = formatILS }: Props) {
  const reduce = useReducedMotion();
  const spring = useSpring(value, { stiffness: 120, damping: 24, mass: 0.6 });
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (reduce) { spring.jump(value); setShown(value); }
    else spring.set(value);
  }, [value, reduce, spring]);

  useMotionValueEvent(spring, 'change', v => setShown(v));

  return (
    <span className={`tnum ${className}`} aria-live="polite" aria-atomic="true">
      {format(shown)}
    </span>
  );
}
