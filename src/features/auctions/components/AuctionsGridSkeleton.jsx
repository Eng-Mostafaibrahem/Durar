import { SkeletonCard } from '../../../components/ui/Skeleton.jsx';

export function AuctionsGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} imageClassName="h-56" bodyClassName="h-16" />
      ))}
    </div>
  );
}