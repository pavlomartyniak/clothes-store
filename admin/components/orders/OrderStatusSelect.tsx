"use client";

import { useState } from "react";
import { useUpdateOrderStatusMutation } from "@/lib/queries/orders";
import { extractErrorMessage } from "@/lib/http";
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
  const updateStatus = useUpdateOrderStatusMutation();

  function handleChange(next: OrderStatus) {
    setValue(next);
    updateStatus.mutate(
      { id: orderId, status: next },
      { onError: () => setValue(status) }
    );
  }

  return (
    <div>
      <select
        value={value}
        disabled={updateStatus.isPending}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        className={inputClass}
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_LABELS[s]}
          </option>
        ))}
      </select>
      {updateStatus.isError && (
        <p className="mt-2 text-sm text-danger">{extractErrorMessage(updateStatus.error)}</p>
      )}
    </div>
  );
}
