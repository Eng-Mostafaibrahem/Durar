import { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn.js';

export const Textarea = forwardRef(function Textarea(
  { label, error, hint, rows = 4, className, containerClassName, id, ...props },
  ref,
) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const describedBy = [error ? `${fieldId}-error` : null, hint ? `${fieldId}-hint` : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-base-dark">
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        className={cn(
          'w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm text-base-dark transition-colors duration-200',
          'placeholder:text-hue-500/70',
          'focus:border-secondary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/30',
          'disabled:cursor-not-allowed disabled:bg-hue-100',
          error ? 'border-error-500' : 'border-border-100 hover:border-border-300',
          className,
        )}
        {...props}
      />

      {hint && !error && (
        <p id={`${fieldId}-hint`} className="text-xs text-hue-500">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${fieldId}-error`} role="alert" className="text-xs font-medium text-error-500">
          {error}
        </p>
      )}
    </div>
  );
});
