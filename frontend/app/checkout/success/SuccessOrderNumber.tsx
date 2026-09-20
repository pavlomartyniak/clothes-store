"use client";

import { useSearchParams } from "next/navigation";

export function SuccessOrderNumber() {
  const searchParams = useSearchParams();
  const order = searchParams.get("order");
  if (!order) return null;
  return (
    <p className="mt-2 text-sm text-ink-soft">
      Номер замовлення: <span className="font-semibold text-ink">{order}</span>
    </p>
  );
}
