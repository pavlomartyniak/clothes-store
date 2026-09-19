"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../http";
import { Product, ProductColor } from "../types";

export const productKeys = {
  all: ["products"] as const,
  list: (search?: string) => [...productKeys.all, "list", search ?? ""] as const,
  detail: (id: string) => [...productKeys.all, "detail", id] as const,
};

export type ProductInput = {
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  price: number;
  oldPrice?: number;
  description: string;
  details: string[];
  sizes: string[];
  colors: ProductColor[];
  isNew: boolean;
  isBestseller: boolean;
};

export function useProductsQuery(search?: string) {
  return useQuery({
    queryKey: productKeys.list(search),
    queryFn: async () => {
      const params = search ? `?search=${encodeURIComponent(search)}` : "";
      const res = await http.get<Product[]>(`/products${params}`);
      return res.data;
    },
  });
}

export function useProductQuery(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: async () => {
      const res = await http.get<Product>(`/products/${id}`);
      return res.data;
    },
    enabled: Boolean(id),
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInput) => {
      const res = await http.post<Product>("/products", input);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUpdateProductMutation(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProductInput) => {
      const res = await http.patch<Product>(`/products/${id}`, input);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useUploadProductImageMutation(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await http.post<Product>(`/products/${productId}/images`, formData);
      return res.data;
    },
    onSuccess: (product) => {
      queryClient.setQueryData(productKeys.detail(productId), product);
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}

export function useRemoveProductImageMutation(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (path: string) => {
      const res = await http.delete<Product>(`/products/${productId}/images`, {
        data: { path },
      });
      return res.data;
    },
    onSuccess: (product) => {
      queryClient.setQueryData(productKeys.detail(productId), product);
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
  });
}
