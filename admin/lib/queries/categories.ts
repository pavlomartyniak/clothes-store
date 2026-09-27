"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../http";
import { Category } from "../types";

export const categoryKeys = {
  all: ["categories"] as const,
};

export function useCategoriesQuery() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const res = await http.get<Category[]>("/categories");
      return res.data;
    },
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { name: string; description?: string }) => {
      const res = await http.post<Category>("/categories", input);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...input
    }: {
      id: string;
      name?: string;
      description?: string;
      content?: string;
    }) => {
      const res = await http.patch<Category>(`/categories/${id}`, input);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await http.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useAddSubcategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      categoryId,
      name,
    }: {
      categoryId: string;
      name: string;
    }) => {
      const res = await http.post<Category>(`/categories/${categoryId}/subcategories`, {
        name,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}

export function useRemoveSubcategoryMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      categoryId,
      subcategoryId,
    }: {
      categoryId: string;
      subcategoryId: string;
    }) => {
      await http.delete(`/categories/${categoryId}/subcategories/${subcategoryId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
    },
  });
}
