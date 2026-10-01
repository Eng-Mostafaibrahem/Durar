import { cn } from '../../../utils/cn.js';

export function SectionHeader({ eyebrow, title, subtitle, action, light = false, className }) {
  return (
    <div
      className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p
            className={cn(
              'mb-2 text-sm font-semibold tracking-widest',
              light ? 'text-primary-200' : 'text-primary-500',
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            'font-display text-3xl font-bold sm:text-4xl',
            light ? 'text-[#667264]' : 'text-[#667264]',
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className={cn('mt-3 text-hue-500', light && 'text-white/75')}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
