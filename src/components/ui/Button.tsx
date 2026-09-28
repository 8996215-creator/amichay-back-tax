import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type Route } from '@/app/router';

type Variant = 'primary' | 'secondary' | 'ghost' | 'onNavy';
type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold select-none whitespace-nowrap ' +
  'transition-[transform,background-color,color,box-shadow] duration-200 ease-out-quint ' +
  'active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent shadow-[0_8px_24px_-8px_rgb(255_105_0/0.55)] hover:brightness-[1.04] hover:shadow-[0_10px_28px_-8px_rgb(255_105_0/0.6)]',
  secondary: 'bg-surface text-ink border border-line-strong hover:bg-surface-2',
  ghost: 'bg-transparent text-ink hover:bg-surface-2',
  onNavy: 'bg-white/10 text-on-navy rim hover:bg-white/15',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[15px]',
  lg: 'h-13 px-7 text-base',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  to?: Route;
  href?: string;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', to, href, className = '', children, type = 'button', ...rest },
  ref,
) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (to) return <Link to={to} className={cls} onClick={rest.onClick ? () => (rest.onClick as () => void)() : undefined}>{children}</Link>;
  if (href) return <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{children}</a>;
  return (
    <button ref={ref} type={type} className={cls} {...rest}>
      {children}
    </button>
  );
});
