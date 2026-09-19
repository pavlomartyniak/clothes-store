"use client";

import { useState, useTransition } from "react";
import { updateOrderStatusAction } from "@/lib/actions/orders";
import { ORDER_STATUS_LABELS, OrderStatus } from "@/lib/types";
import { inputClass } from "@/components/ui/Field";

const statuses: OrderStatus[] = [
  "new",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [value, setValue] = useState(status);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(next: OrderStatus) {
    setValue(next);
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, next);
      if (result.error) {
        setError(result.error);
        setValue(status);
      }
    });
  }

  return (
    <div>
      <select
        value={value}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        className={inputClass}
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
