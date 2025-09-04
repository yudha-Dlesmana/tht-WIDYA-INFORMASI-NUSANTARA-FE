"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from 'lucide-react';
import { useState } from "react";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.email("Email tidak valid").max(255, "Maksimal 255 karakter"),
  password: z
    .string()
    .min(6, "Minimal 6 karkter")
    .max(100, "Maksimal 100 karakter"),
})

type LoginData = z.infer<typeof loginSchema>;
  
  
export default function Login() {
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const [loginError, setLoginError] = useState<string | null>(null);
  const router = useRouter()
  
  async function onSubmit(values: LoginData) {
    try{
      setLoginError(null)
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Login gagal");

      const data = await res.json();

      sessionStorage.setItem("token", data.data.token);
      router.push("/")
    }catch{
      setLoginError("Login gagal, silakan coba lagi")
    }
  }

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <h1>Login</h1>
          {loginError && (
            <Alert variant="destructive">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Login gagal</AlertTitle>
              <AlertDescription>{loginError}</AlertDescription>
            </Alert>
          )}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Login</Button>
        </form>
      </Form>
       
      </main>
      <footer className="row-start-3 flex flex-col gap-[24px] items-center justify-center">
        <h1 className="justify-center">KNOWLEDGE TEST</h1>
        <h1>FULL STACK ENGINEER</h1>
        <h1>PT WIDYA INFORMASI NUSANTARA</h1>
      </footer>
    </div>
  );
}
