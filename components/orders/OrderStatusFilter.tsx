"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS, OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = [
  "new",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

export function OrderStatusFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("status");

  function setStatus(status?: OrderStatus) {
    const params = new URLSearchParams(searchParams.toString());
    if (status) params.set("status", status);
    else params.delete("status");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => setStatus(undefined)}
        className={cn(
          "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
          !active ? "border-ink bg-ink text-paper" : "border-line text-ink-soft"
        )}
      >
        Усі
      </button>
      {statuses.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => setStatus(status)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
            active === status
              ? "border-ink bg-ink text-paper"
              : "border-line text-ink-soft"
          )}
        >
          {ORDER_STATUS_LABELS[status]}
        </button>
      ))}
    </div>
  );
}
