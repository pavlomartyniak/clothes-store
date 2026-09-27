export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-end whitespace-nowrap ${className}`}>
      <span aria-hidden="true" className="inline-flex items-end">
        <svg viewBox="0 0 60 100" className="h-[1em] w-auto shrink-0">
          <path
            d="M8,92 L8,8 L30,58 L52,8 L52,92"
            fill="none"
            stroke="currentColor"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="relative top-[0.05em] -ml-[0.12em] -mr-[0.08em] font-script text-[2em] leading-none">
          A
        </span>
        <span>RTOSOLI</span>
      </span>
      <span className="sr-only">Martosoli</span>
    </span>
  );
}
