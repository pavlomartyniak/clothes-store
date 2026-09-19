"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../http";
import { Order, OrderStatus } from "../types";

export const orderKeys = {
  all: ["orders"] as const,
  list: (status?: OrderStatus) => [...orderKeys.all, "list", status ?? ""] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
};

export function useOrdersQuery(status?: OrderStatus) {
  return useQuery({
    queryKey: orderKeys.list(status),
    queryFn: async () => {
      const params = status ? `?status=${status}` : "";
      const res = await http.get<Order[]>(`/orders${params}`);
      return res.data;
    },
  });
}

export function useOrderQuery(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const res = await http.get<Order>(`/orders/${id}`);
      return res.data;
    },
    enabled: Boolean(id),
  });
}

export function useUpdateOrderStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const res = await http.patch<Order>(`/orders/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useDeleteOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
