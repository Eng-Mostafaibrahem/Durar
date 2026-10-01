export function IconButton({ label, children, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid size-10 place-items-center rounded-full text-hue-500 transition-colors hover:bg-hue-100"
      {...props}
    >
      {children}
    </button>
  );
}