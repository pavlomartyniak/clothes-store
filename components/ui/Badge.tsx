import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "muted",
  className,
}: {
  children: React.ReactNode;
  tone?: "accent" | "ink" | "muted" | "success" | "danger";
  className?: string;
}) {
  const tones = {
    accent: "bg-accent/10 text-accent-dark",
    ink: "bg-ink text-paper",
    muted: "bg-paper-soft text-ink-soft border border-line",
    success: "bg-emerald-100 text-emerald-800",
    danger: "bg-red-100 text-danger",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
