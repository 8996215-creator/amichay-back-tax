import { useTheme } from '@/state/theme';

interface LogoProps {
  /** Omit to follow the active theme: colour on light, white on dark. */
  variant?: 'color' | 'white';
  className?: string;
  withName?: boolean;
}

/** Inline SVG so it inherits nothing and paints instantly with the first frame. */
export function LogoMark({ variant = 'color', className = 'h-8' }: LogoProps) {
  const navy = variant === 'color' ? '#142347' : '#FFFFFF';
  const orange = variant === 'color' ? '#FF6900' : '#FFFFFF';
  return (
    <svg viewBox="0 0 1041 697" className={className} aria-hidden="true" focusable="false">
      <path d="M175 472C175 499.614 197.386 522 225 522H396C423.614 522 446 499.614 446 472V273C446 245.386 468.386 223 496 223H571C598.614 223 621 245.386 621 273V647C621 674.614 598.614 697 571 697H50C22.3858 697 0 674.614 0 647V50C0 22.3858 22.3858 0 50 0H125C152.614 0 175 22.3858 175 50V472Z" fill={navy} />
      <path d="M545.896 0L448.5 175H448C420.386 175 398 197.386 398 225V424C398 451.614 375.614 474 348 474H273C245.386 474 223 451.614 223 424V50C223 22.3858 245.386 0 273 0H545.896ZM1040.55 175H844V647C844 674.614 821.614 697 794 697H719C691.386 697 669 674.614 669 647V225C669 197.386 646.614 175 619 175H515.5L616 0H963L1040.55 175Z" fill={orange} />
    </svg>
  );
}

export function Logo({ variant: variantProp, className = '', withName = true }: LogoProps) {
  const { resolved } = useTheme();
  const variant = variantProp ?? (resolved === 'dark' ? 'white' : 'color');
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark variant={variant} className="h-7 w-auto sm:h-8" />
      {withName && (
        <span className={`text-lg font-bold leading-none tracking-tight sm:text-xl ${variant === 'white' ? 'text-white' : 'text-ink'}`}>
          מיסי לנדר
        </span>
      )}
    </span>
  );
}
