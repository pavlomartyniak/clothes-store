"use client";

import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const http = axios.create({ baseURL: API_URL });

export type OrderItemInput = {
  productId?: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
};

export type CreateOrderInput = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  deliveryMethod: "np-branch" | "courier";
  city: string;
  address: string;
  paymentMethod: "cod" | "card";
  items: OrderItemInput[];
  totalPrice: number;
  shippingCost?: number;
  comment?: string;
};

type CreatedOrder = { orderNumber: string };

function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as { message?: string | string[] } | undefined;
    if (Array.isArray(data?.message)) return data.message.join(", ");
    if (data?.message) return data.message;
  }
  return "Не вдалося оформити замовлення";
}

export function useCreateOrderMutation() {
  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const res = await http.post<CreatedOrder>("/orders", input);
      return res.data;
    },
  });
}

export { extractErrorMessage };
