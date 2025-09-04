"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Product {
  id: number;
  name: string;
  price: number;
  quantity?: number;
  user_id: string;
}
export interface userProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

async function fetchProducts(page: number): Promise<Product[]> {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("No token");

  const res = await fetch(`http://localhost:8000/product/all?page=${page}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const json: ApiResponse<Product[]> = await res.json();
  return json.data;
}

export function useProducts(page: number) {
  return useQuery<Product[], Error>({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page),
  });
}

async function fetchUserProducts(page: number): Promise<userProduct[]> {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("No token");

  const res = await fetch(`http://localhost:8000/product`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch user products");

  const json: ApiResponse<userProduct[]> = await res.json();
  return json.data;
}
export function useUserProduct(page: number) {
  return useQuery<userProduct[], Error>({
    queryKey: ["userProducts", page],
    queryFn: () => fetchUserProducts(page),
  });
}

async function createProduct(values: Omit<Product, "id" | "user_id">) {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("No token");
  const res = await fetch("http://localhost:8000/product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Failed to create product");
  }

  return res.json();
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["userProducts"] });
    },
  });
}

async function deleteProduct(id: number) {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("No token");

  const res = await fetch(`http://localhost:8000/product/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete product");

  return res.json();
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["userProducts"] });
    },
  });
}

interface UpdateProductPayload {
  productId: number;
  values: Omit<Product, "id" | "user_id">;
}

async function updateProduct({ productId, values }: UpdateProductPayload) {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("No token");
  const res = await fetch(`http://localhost:8000/product/${productId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Failed to update product");
  }

  return res.json();
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["userProducts"] });
    },
  });
}
