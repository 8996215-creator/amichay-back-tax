import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  tone?: 'surface' | 'navy' | 'quiet';
  padding?: 'md' | 'lg' | 'none';
}

const tones = {
  surface: 'glass-card',
  quiet: 'glass-card-2',
  navy: 'glass-navy text-on-navy',
};
const paddings = { md: 'p-4 sm:p-6', lg: 'p-5 sm:p-8 lg:p-10', none: '' };

export function Card({ children, tone = 'surface', padding = 'md', className = '', ...rest }: CardProps) {
  return (
    <div className={`rounded-2xl ${tones[tone]} ${paddings[padding]} ${className}`} {...rest}>
      {children}
    </div>
  );
}
