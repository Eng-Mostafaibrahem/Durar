import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn.js';
import { Spinner } from './Spinner.jsx';

const VARIANTS = {
  primary: 'bg-primary-700 text-white rounded-2xl hover:bg-primary-600 active:bg-primary-700',
  secondary: 'bg-secondary-700 rounded-2xl  text-white hover:bg-secondary-600 active:bg-secondary-700',
  outline: 'border rounded-2xl border-primary-500 text-primary-500 hover:bg-primary-100',
  ghost: 'text-base-dark rounded-2xl hover:bg-hue-100',
  subtle: 'bg-hue-100 text-base-dark rounded-2xl hover:bg-border-100',
  danger: 'bg-error-500 text-white rounded-2xl hover:brightness-110',
  emerald: 'bg-[#0f5a3a] text-white rounded-2xl hover:bg-[#0c4a30]',
  burgundy: 'bg-[#5c0b1c] text-white rounded-2xl hover:bg-[#480916]',
};

const SIZES = {
  sm: 'h-9 px-4 text-sm gap-1.5 ',
  md: 'h-11 px-6 text-sm gap-2 ',
  lg: 'h-14 px-8 text-base gap-2.5',
  fluid:
    'h-auto gap-1.5 rounded-2xl px-5 py-2.5 text-sm md:px-[2.2vw] md:py-[0.8vw] md:text-[clamp(0.625rem,1.1vw,0.95rem)]',
};

const BASE =
  'inline-flex items-center justify-center rounded-[3px] px-[2.2vw] py-[0.8vw] font-medium transition-[background-color,color,box-shadow,transform] duration-200 ease-(--ease-luxury) select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed disabled:opacity-55 aria-disabled:pointer-events-none aria-disabled:opacity-55 active:translate-y-px';

export const Button = forwardRef(function Button(
  {
    as,
    to,
    href,
    variant = 'primary',
    size = 'md',
    className,
    children,
    disabled,
    loading = false,
    type = 'button',
    ...props
  },
  ref,
) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);
  const isDisabled = disabled || loading;

  if (to) {
    return (
      <Link
        ref={ref}
        to={to}
        className={classes}
        aria-disabled={isDisabled || undefined}
        {...props}
      >
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  if (as) {
    const Component = as;
    return (
      <Component ref={ref} className={classes} {...props}>
        {children}
      </Component>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Spinner size="sm" className="shrink-0" />}
      <span className={cn('inline-flex items-center gap-2', loading && 'opacity-90')}>
        {children}
      </span>
    </button>
  );
});
