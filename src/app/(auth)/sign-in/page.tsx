'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import {useState, } from "react"
import axios, {  AxiosError } from'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Loader2 } from "lucide-react"

export default function SignInForm() {

  const[isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
   
    setIsSubmitting(true)
            try{
                const response = await axios.post<ApiResponse>("/api/sign-in",data);

                toast({
                    title:'Success',
                    description:response.data.message
                })
                router.replace(`/dashboard`)
                console.log("priya")
                setIsSubmitting(false)
            }catch(error){
                console.error("Error in the login of user",error)
                const axiosError = error as AxiosError<ApiResponse>;
               let errorMessage = axiosError.response?.data.message
               toast({
                title:"login failed",
                description:errorMessage,
                variant:"destructive"
               })
               setIsSubmitting(false)
            }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to Anonymous Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit"  className="w-full"  disabled={isSubmitting}>
                {
                    isSubmitting?(
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                        </>
                    ):('SignIn')
                }
                </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
  
 