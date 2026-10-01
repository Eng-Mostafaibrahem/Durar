import { cn } from '../../utils/cn.js';

const VARIANTS = {
  default: 'bg-hue-100 text-base-dark',
  primary: 'bg-primary-100 text-primary-700',
  secondary: 'bg-secondary-100 text-secondary-700',
  success: 'bg-success-100 text-success-500',
  warning: 'bg-warning-100 text-warning-500',
  error: 'bg-error-100 text-error-500',
  outline: 'border border-border-300 text-base-dark',
  gold: 'bg-warning-100 text-warning-500 ring-1 ring-warning-500/25',
};

const SIZES = {
  sm: 'h-6 px-2.5 text-[11px]',
  md: 'h-7 px-3 text-xs',
};

export function Badge({ variant = 'default', size = 'md', className, children, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
