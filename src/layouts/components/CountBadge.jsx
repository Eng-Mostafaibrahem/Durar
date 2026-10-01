export function CountBadge({ count }) {
  if (!count) return null;

  return (
    <span className="absolute -end-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-primary-500 px-1 py-0.5 text-[10px] font-bold leading-none text-white">
      {count > 99 ? '99+' : count}
    </span>
  );
}