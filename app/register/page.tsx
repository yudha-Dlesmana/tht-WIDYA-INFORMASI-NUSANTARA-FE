"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from 'lucide-react';
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { redirect, useRouter } from "next/navigation";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Minimal 2 karakter")
    .max(100, "Maksimal 100 karakter"),
  email: z.email("Email tidak valid").max(255, "Maksimal 255 karakter"),
  password: z
    .string()
    .min(6, "Minimal 6 karkter")
    .max(100, "Maksimal 100 karakter"),
  gender: z.enum(["male", "female"]),
})

type RegisterData = z.infer<typeof registerSchema>;
  
  
export default function Login() {
  const form = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  })

  const [registerError, setRegisterError] = useState<string | null>(null);
  
  const router= useRouter()

  async function onSubmit(values: RegisterData) {
    try{
      setRegisterError(null)
      const res = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("register gagal");

      router.push('/login')
    }catch{
      setRegisterError("Register gagal, silakan coba lagi")
    }
  }

  useEffect(() => {
      const token = sessionStorage.getItem("token");
      if(token){
        router.replace("/")
      }
    }, [router])

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-5 row-start-2 items-center sm:items-start">
      <Form {...form}>
        {registerError && (
          <Alert variant="destructive">
            <TriangleAlert className="h-4 w-4" />
            <AlertTitle>Register gagal</AlertTitle>
            <AlertDescription>{registerError}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <h1>Register</h1>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email" {...field} />
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
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Register</Button>
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
