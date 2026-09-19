"use server";

import { revalidatePath } from "next/cache";
import { api, ApiError } from "../api";
import { Order, OrderStatus } from "../types";
import { ActionResult } from "./products";

export async function updateOrderStatusAction(
  id: string,
  status: OrderStatus
): Promise<ActionResult<Order>> {
  try {
    const order = await api.patch<Order>(`/orders/${id}/status`, { status });
    revalidatePath("/orders");
    revalidatePath(`/orders/${id}`);
    return { data: order };
  } catch (e) {
    return {
      error: e instanceof ApiError ? e.message : "Не вдалося оновити статус",
    };
  }
}

export async function deleteOrderAction(
  id: string
): Promise<ActionResult<null>> {
  try {
    await api.delete(`/orders/${id}`);
    revalidatePath("/orders");
    return { data: null };
  } catch (e) {
    return {
      error: e instanceof ApiError ? e.message : "Не вдалося видалити замовлення",
    };
  }
}
