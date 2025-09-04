"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct, useUserProduct } from "@/hooks/useProducts";
import { useUser } from "@/hooks/useUsers";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { Trash } from "lucide-react";
import { Input } from "@/components/ui/input";

export const ProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  price: z.number().positive("Price must be positive"),
  quantity: z
    .number()
    .int()
    .nonnegative("Quantity cannot be negative")
    .optional(),
});
export type ProductData = z.infer<typeof ProductSchema>;
type updateProductpayload = {
  productId: number,
  values: ProductData
}

export default function Main() {
  const [page, setPage] = useState<number>(1)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDialogUpdate, setOpenDialogUpdate] = useState<boolean>(false)
  const { data: user } = useUser();
  const { data: products } = useProducts(page);
  const { data: userProducts} = useUserProduct(page)
  const { mutateAsync: createProduct } = useCreateProduct()
  const { mutateAsync: updateProduct } = useUpdateProduct()
  const { mutateAsync: deleteProduct, isPending} = useDeleteProduct()
  
  const router = useRouter();
  const [createProductError, setCreateProductError] = useState<string | null>(null)
  const [updateProductError, setUpdateProductError] = useState<string | null>(null)

  const form = useForm<ProductData>({
    resolver: zodResolver(ProductSchema)
  })

  async function onSubmitCreate(values: ProductData){
    try{
      setCreateProductError(null)
      await createProduct(values)
      form.reset()
      setOpenDialog(false)
    }catch (err){
      setCreateProductError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  function onSubmitUpdate(productId: number){
    return async (values: ProductData) => {
      try{
        setUpdateProductError(null)
        await updateProduct({productId, values})
        form.reset
        setOpenDialogUpdate(false)
      }catch (err){
        setUpdateProductError(err instanceof Error ? err.message : "Something went wrong")
      }
    }
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    }
  }, [router])


  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <div className="flex flex-col justify-center">
        <h1>{user?.data?.name}</h1>
        <div className="flex gap-4">
          <p>{user?.data?.email}</p>
          <p>{user?.data?.gender}</p>
        </div>
      </div>
      <Tabs defaultValue="allProduct">
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="allProduct" >All Product</TabsTrigger>
            <TabsTrigger value="userProduct">User's Product</TabsTrigger>
          </TabsList>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger>
              <Button>Create Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Product</DialogTitle>
                <DialogDescription>
                  Enter the product information and click save to add it to the list.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                {createProductError && (
                  <Alert variant="destructive">
                    <TriangleAlert className="h-4 w-4" />
                    <AlertTitle>Failed Create Product </AlertTitle>
                    <AlertDescription>{createProductError}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={form.handleSubmit(onSubmitCreate)} className="space-y-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input 
                            type="number" 
                            placeholder="price" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="quantity" {...field} 
                            onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Save</Button>
                  </form>
                </Form>
            </DialogContent>
          </Dialog>
        </div>
        <TabsContent value="allProduct">
          <Table>
            <TableCaption>A list of all products.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">user id</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell className="text-right">{product.user_id}</TableCell>
                </TableRow>
              ))}
              
            </TableBody>
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 border rounded ${
                    page === p ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Table>
          
          </TabsContent>
        <TabsContent value="userProduct">
          <Table>
            <TableCaption>A list of all products.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userProducts?.map((product) => (
                <TableRow>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2">
                      {/* update */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button>
                            Update
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently update your product.
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...form}>
                            {updateProductError && (
                              <Alert variant="destructive">
                                <TriangleAlert className="h-4 w-4" />
                                <AlertTitle>Failed Create Product </AlertTitle>
                                <AlertDescription>{updateProductError}</AlertDescription>
                              </Alert>
                            )}
                            <form onSubmit={form.handleSubmit(onSubmitUpdate(product.id))} className="space-y-2">
                                <FormField
                                  control={form.control}
                                  name="name"
                                  render={({ field }) => {
                                    return (
                                      <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                          <Input placeholder="name" {...field} defaultValue={product.name}/>
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    );
                                  }}
                                />
                                <FormField
                                  control={form.control}
                                  name="price"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Price</FormLabel>
                                      <FormControl>
                                        <Input 
                                        type="number" 
                                        placeholder="price" 
                                        {...field} 
                                        defaultValue={product.price}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name="quantity"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Quantity</FormLabel>
                                      <FormControl>
                                        <Input type="number" placeholder="quantity" {...field} 
                                        defaultValue={product.quantity}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}/>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button type="submit">update</Button>
                              </form>
                            </Form>
                        </DialogContent>
                      </Dialog>
                      {/* delete */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button title="Delete" aria-label="Delete">
                            <Trash/>
                          </Button>
                          </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                              This action cannot be undone. This will permanently delete your product
                              and remove your data from our servers.
                            </DialogDescription>
                            <div className="flex gap-2 justify-end mt-4">
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button
                                  variant="destructive"
                                  disabled={isPending}
                                  onClick={() => deleteProduct(product.id)}
                                >
                                  {isPending ? "Deleting..." : "I'm sure"}
                                </Button>
                              </DialogClose>
                            </div>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
            </TableBody>
            <div className="flex justify-center gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 border rounded ${
                    page === p ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </Table>
          </TabsContent>
      </Tabs>
      
      </main>
      <footer className="row-start-3 flex flex-col gap-[10px] items-center justify-center">
        <h1 className="justify-center">KNOWLEDGE TEST</h1>
        <h1>FULL STACK ENGINEER</h1>
        <h1>PT WIDYA INFORMASI NUSANTARA</h1>
      </footer>
    </div>
  );
}
