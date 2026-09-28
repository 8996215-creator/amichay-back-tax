import type { HTMLAttributes, ReactNode } from 'react';

/** `narrow` caps reading-width content at 48rem; passing `max-w-*` in className would lose to the base utility. */
export function Container({ children, className = '', narrow = false, ...rest }: HTMLAttributes<HTMLDivElement> & { children: ReactNode; narrow?: boolean }) {
  return (
    <div className={`mx-auto w-full ${narrow ? 'max-w-3xl' : 'max-w-6xl'} px-4 sm:px-6 lg:px-8 ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function Section({ children, className = '', ...rest }: HTMLAttributes<HTMLElement> & { children: ReactNode }) {
  return (
    <section className={`py-12 sm:py-16 ${className}`} {...rest}>
      {children}
    </section>
  );
}

interface HeadingProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: 'start' | 'center';
  as?: 'h1' | 'h2';
  onNavy?: boolean;
}

export function SectionHeading({ eyebrow, title, lead, align = 'start', as = 'h2', onNavy = false }: HeadingProps) {
  const Tag = as;
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p className={`mb-3 text-sm font-semibold tracking-wide ${onNavy ? 'text-on-navy-2' : 'text-ink-3'}`}>{eyebrow}</p>
      )}
      <Tag className={`font-bold leading-[1.15] ${as === 'h1' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl'} ${onNavy ? 'text-on-navy' : 'text-ink'}`}>
        {title}
      </Tag>
      {lead && <p className={`mt-4 text-lg leading-relaxed ${onNavy ? 'text-on-navy-2' : 'text-ink-2'}`}>{lead}</p>}
    </div>
  );
}
