import { useTranslation } from 'react-i18next';
import { HiMinus, HiPlus } from 'react-icons/hi2';
import { cn } from '../../../utils/cn.js';

export function QuantityStepper({ value, onChange, min = 1, max = 99, disabled = false }) {
  const { t } = useTranslation();

  const clamp = (next) => Math.min(Math.max(next, min), max);

  return (
    <div
      className={cn(
        'inline-flex h-12 items-center rounded-xl border border-border-200 bg-white',
        disabled && 'opacity-50',
      )}
    >
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={disabled || value <= min}
        aria-label={t('common:actions.decreaseQuantity')}
        className="grid size-12 shrink-0 place-items-center rounded-s-xl text-base-dark transition-colors hover:bg-hue-100 disabled:cursor-not-allowed disabled:text-hue-500"
      >
        <HiMinus aria-hidden="true" className="size-4" />
      </button>

      <span aria-live="polite" className="min-w-12 text-center text-sm font-bold text-base-dark">
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={disabled || value >= max}
        aria-label={t('common:actions.increaseQuantity')}
        className="grid size-12 shrink-0 place-items-center rounded-e-xl text-base-dark transition-colors hover:bg-hue-100 disabled:cursor-not-allowed disabled:text-hue-500"
      >
        <HiPlus aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
