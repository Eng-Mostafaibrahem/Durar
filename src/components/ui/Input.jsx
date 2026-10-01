import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn.js';

export const Input = forwardRef(function Input(
  { label, error, hint, className, containerClassName, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const describedBy = [error ? `${inputId}-error` : null, hint ? `${inputId}-hint` : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-base-dark">
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn(
          'h-12 w-full rounded-xl border bg-white px-4 text-sm text-base-dark transition-colors duration-200',
          'placeholder:text-hue-500/70',
          'focus:border-secondary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/30',
          'disabled:cursor-not-allowed disabled:bg-hue-100 disabled:text-hue-500',
          error ? 'border-error-500' : 'border-border-100 hover:border-border-300',
          className,
        )}
        {...props}
      />

      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-hue-500">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-xs font-medium text-error-500">
          {error}
        </p>
      )}
    </div>
  );
});
