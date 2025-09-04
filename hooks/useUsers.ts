"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchUser() {
  const token = sessionStorage.getItem("token");
  if (!token) throw new Error("No token");

  const res = await fetch("http://localhost:8000/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
}

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false,
  });
}
