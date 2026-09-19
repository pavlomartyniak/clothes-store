"use client";

import { useRouter } from "next/navigation";
import { LuTrash2 } from "react-icons/lu";
import { useDeleteOrderMutation } from "@/lib/queries/orders";
import { Button } from "@/components/ui/Button";

export function DeleteOrderButton({ id }: { id: string }) {
  const router = useRouter();
  const deleteOrder = useDeleteOrderMutation();

  function handleDelete() {
    if (!confirm("Видалити це замовлення?")) return;
    deleteOrder.mutate(id, { onSuccess: () => router.push("/orders") });
  }

  return (
    <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleteOrder.isPending}>
      <LuTrash2 size={14} />
      Видалити замовлення
    </Button>
  );
}
