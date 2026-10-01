export function ProductListSkeleton({ count = 8 }) {
  return (
    <div
      role="status"
      aria-label="loading"
      className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="rounded-xl border border-border-500/20 bg-white p-2">
          <div className="aspect-[4/5] animate-pulse rounded-lg bg-silk-fallback" />
          <div className="space-y-2 px-2 pb-2 pt-3">
            <div className="h-2.5 w-1/3 animate-pulse rounded-full bg-hue-100" />
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-hue-100" />
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-hue-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
