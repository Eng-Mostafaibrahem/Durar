import { cn } from '../../utils/cn.js';

const SIZES = {
  sm: 'size-4 border-2',
  md: 'size-6 border-2',
  lg: 'size-9 border-[3px]',
};

export function Spinner({ size = 'md', className, label }) {
  return (
    <span role="status" aria-label={label} className="inline-flex">
      <span
        className={cn(
          'inline-block animate-spin rounded-full border-current border-e-transparent',
          SIZES[size],
          className,
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
