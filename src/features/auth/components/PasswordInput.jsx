import { forwardRef, useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';
import { cn } from '../../../utils/cn.js';

export const PasswordInput = forwardRef(function PasswordInput(
  { label, error, hint, className, containerClassName, id, ...props },
  ref,
) {
  const { t } = useTranslation();
  const generatedId = useId();
  const inputId = id || generatedId;
  const [visible, setVisible] = useState(false);

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

      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={visible ? 'text' : 'password'}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={cn(
            'h-12 w-full rounded-xl border bg-white px-4 pe-12 text-sm text-base-dark transition-colors duration-200',
            'placeholder:text-hue-500/70',
            'focus:border-secondary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500/30',
            'disabled:cursor-not-allowed disabled:bg-hue-100 disabled:text-hue-500',
            error ? 'border-error-500' : 'border-border-100 hover:border-border-300',
            className,
          )}
          {...props}
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? t('common:a11y.hidePassword') : t('common:a11y.showPassword')}
          aria-pressed={visible}
          className="absolute end-2 inset-y-0 my-auto grid size-9 place-items-center rounded-full text-hue-500 transition-colors hover:bg-hue-100 hover:text-base-dark"
        >
          {visible ? (
            <HiEyeSlash aria-hidden="true" className="size-5" />
          ) : (
            <HiEye aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>

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
