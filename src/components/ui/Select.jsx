import { forwardRef, useId } from 'react';
import { HiChevronDown } from 'react-icons/hi2';
import { cn } from '../../utils/cn.js';

export const Select = forwardRef(function Select(
  { label, error, hint, options = [], placeholder, className, containerClassName, id, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const describedBy = [error ? `${selectId}-error` : null, hint ? `${selectId}-hint` : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-base-dark">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(
            'h-12 w-full appearance-none rounded-xl border bg-white px-4 pe-10 text-sm text-base-dark transition-colors duration-200',
            'focus:border-secondary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/30',
            'disabled:cursor-not-allowed disabled:bg-hue-100',
            error ? 'border-error-500' : 'border-border-100 hover:border-border-300',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <HiChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 end-3 my-auto size-4 text-hue-500"
        />
      </div>

      {hint && !error && (
        <p id={`${selectId}-hint`} className="text-xs text-hue-500">
          {hint}
        </p>
      )}

      {error && (
        <p id={`${selectId}-error`} role="alert" className="text-xs font-medium text-error-500">
          {error}
        </p>
      )}
    </div>
  );
});
