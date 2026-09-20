"use client";

import { LuMinus, LuPlus } from "react-icons/lu";
import { cn } from "@/lib/utils";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-line",
        className
      )}
    >
      <button
        type="button"
        aria-label="Зменшити кількість"
        className="flex h-9 w-9 items-center justify-center text-ink-soft transition-colors hover:text-accent disabled:opacity-30"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <LuMinus size={14} />
      </button>
      <span className="w-6 text-center text-sm font-medium tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Збільшити кількість"
        className="flex h-9 w-9 items-center justify-center text-ink-soft transition-colors hover:text-accent disabled:opacity-30"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <LuPlus size={14} />
      </button>
    </div>
  );
}
