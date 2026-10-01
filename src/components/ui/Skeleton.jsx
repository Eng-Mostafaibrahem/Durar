import { cn } from '../../utils/cn.js';

export function Skeleton({ className, rounded = 'rounded-xl', ...props }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse bg-hue-100', rounded, className)}
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('flex flex-col gap-2', className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          rounded="rounded-md"
          className={index === lines - 1 ? 'w-3/5' : 'w-full'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className, imageClassName = 'h-56', bodyClassName = 'h-24' }) {
  return (
    <div className={cn('overflow-hidden rounded-xl border border-border-100 bg-white', className)}>
      <Skeleton rounded="rounded-none" className={imageClassName} />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton rounded="rounded-md" className="h-4 w-4/5" />
        <Skeleton rounded="rounded-md" className="h-3 w-2/5" />
        <Skeleton rounded="rounded-md" className={bodyClassName} />
      </div>
    </div>
  );
}
