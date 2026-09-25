export function Logo({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Maison"
      className={`inline-flex items-end whitespace-nowrap ${className}`}
    >
      <svg viewBox="0 0 60 100" aria-hidden="true" className="h-[1em] w-auto shrink-0">
        <path
          d="M8,92 L8,8 L30,58 L52,8 L52,92"
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        aria-hidden="true"
        className="relative top-[0.05em] -ml-[0.12em] -mr-[0.08em] font-script text-[2em] leading-none"
      >
        A
      </span>
      <span aria-hidden="true">ISON</span>
    </span>
  );
}
