import type { ImgHTMLAttributes } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/** Exported sizes of /public/mascot/<name>.webp, so the browser can reserve space before load. */
const sizes = {
  hero: [1200, 991],
  'step-check': [817, 900],
  'step-file': [708, 900],
  'step-refund': [882, 900],
  reservist: [728, 900],
  upload: [900, 845],
  'calc-start': [709, 900],
  'calc-ok': [869, 900],
  'lead-success': [900, 801],
  faq: [552, 900],
  legal: [840, 900],
  footer: [1313, 781],
} as const;

export type MascotName = keyof typeof sizes;

/** Size with `w-* h-auto` or `h-* w-auto` in className (or on the wrapper when `float`). */
interface MascotProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'width' | 'height'> {
  name: MascotName;
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean;
  /** Gentle idle float. Off under reduced motion. */
  float?: boolean;
}

/**
 * Missy, the owl. Purely decorative: every placement has real text next to it,
 * so the image is hidden from assistive tech and never intercepts pointer events.
 */
export function Mascot({ name, priority = false, float = false, className = '', ...rest }: MascotProps) {
  const reduce = useReducedMotion();
  const [w, h] = sizes[name];
  const img = (
    <img
      src={`/mascot/${name}.webp`}
      alt=""
      width={w}
      height={h}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
      aria-hidden="true"
      className={`pointer-events-none block select-none ${float ? 'h-auto w-full' : className}`}
      {...rest}
    />
  );
  if (!float) return img;
  if (reduce) return <div className={`pointer-events-none ${className}`} aria-hidden="true">{img}</div>;
  return (
    <motion.div
      className={`pointer-events-none ${className}`}
      aria-hidden="true"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {img}
    </motion.div>
  );
}
