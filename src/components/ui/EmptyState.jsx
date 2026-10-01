import { cn } from '../../utils/cn.js';

export function EmptyState({ icon: Icon, title, description, action, className, compact = false }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border-300 bg-bg-secondary/60 text-center',
        compact ? 'px-6 py-10' : 'px-6 py-16',
        className,
      )}
    >
      {Icon && (
        <span className="grid size-14 place-items-center rounded-full bg-secondary-100 text-secondary-500">
          <Icon aria-hidden="true" className="size-7" />
        </span>
      )}

      <div className="flex flex-col gap-1.5">
        <p className="font-display text-lg text-base-dark">{title}</p>
        {description && <p className="max-w-md text-sm text-hue-500">{description}</p>}
      </div>

      {action}
    </div>
  );
}
