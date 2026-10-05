import { cn } from "@/lib/utils";

/**
 * Fade/slide-in entrance, pure CSS (see .animate-reveal in globals.css) —
 * deliberately not JS-driven (no framer-motion/IntersectionObserver), so the
 * content is never stuck invisible if a script fails to run on some browser.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("animate-reveal", className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
