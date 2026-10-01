import { FaGem } from 'react-icons/fa';
import { cn } from '../../../utils/cn.js';

export function AuthCard({ title, subtitle, actions, children, className }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-border-500/15 bg-white p-6 shadow-2xl shadow-primary-900/5 sm:p-8',
        className,
      )}
    >
      <header className="flex flex-col items-center gap-3 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary-100 text-primary-500">
          <FaGem aria-hidden="true" className="size-6" />
        </span>
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-2xl font-bold text-base-dark">{title}</h1>
          {subtitle && <p className="text-sm text-hue-500">{subtitle}</p>}
        </div>
      </header>

      <div className="mt-7">{children}</div>

      {actions && (
        <div className="mt-6 flex flex-col gap-3 border-t border-border-100 pt-5 text-center text-sm">
          {actions}
        </div>
      )}
    </div>
  );
}
