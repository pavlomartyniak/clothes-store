"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LuTrash2 } from "react-icons/lu";
import { deleteOrderAction } from "@/lib/actions/orders";
import { Button } from "@/components/ui/Button";

export function DeleteOrderButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Видалити це замовлення?")) return;
    startTransition(async () => {
      const result = await deleteOrderAction(id);
      if (!result.error) router.push("/orders");
    });
  }

  return (
    <Button variant="danger" size="sm" onClick={handleDelete} disabled={isPending}>
      <LuTrash2 size={14} />
      Видалити замовлення
    </Button>
  );
}
