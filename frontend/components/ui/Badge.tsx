import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "accent",
  className,
}: {
  children: React.ReactNode;
  tone?: "accent" | "ink" | "muted";
  className?: string;
}) {
  const tones = {
    accent: "bg-accent text-paper",
    ink: "bg-ink text-paper",
    muted: "bg-paper-soft text-ink-soft border border-line",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
