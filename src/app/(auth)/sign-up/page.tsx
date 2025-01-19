'use client'
import { ApiResponse } from "@/types/ApiResponse"
import{zodResolver} from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState, } from "react"
import { useForm } from "react-hook-form"
import { useDebounce } from "@uidotdev/usehooks";
import * as z from "zod"

import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, {  AxiosError } from'axios'

import { Form, FormControl,FormField, FormItem, FormLabel, FormMessage , } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


export default function SignUpForm() {
    const[username, setUsername] = useState(" ")
    const[usernameMessage, setUsernameMessage] = useState('')
    const[isCheckingUsername, setIsCheckingUsername] = useState(false)
    const[isSubmitting, setIsSubmitting] = useState(false)
    const debouncedUsername = useDebounce(username, 300);

    const {toast} = useToast()
    const router = useRouter()

    //zod implememntation
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver:zodResolver(signUpSchema),
        defaultValues:{
            username:'',
            email:'',
            password:''
        }
    })

    useEffect(() =>{
        const checkUsernameUnique = async ()=>{
            if(debouncedUsername){
                setIsCheckingUsername(true)
                setUsernameMessage('')

                    try {
                        const response = await axios.get(`/api/check-username-uniqueness?username=${debouncedUsername}`)
                        setUsernameMessage(response.data.message)

                    } catch (error) {
                        const axiosError = error as AxiosError<ApiResponse>;
                        setUsernameMessage(
                            axiosError.response?.data.message ?? "Error while checking username"
                        )
                    }finally{
                        setIsCheckingUsername(false)
                    }
                
            }
        }
        checkUsernameUnique()
    }
    ,[debouncedUsername])


    const onSubmit = async (data:z.infer<typeof signUpSchema>)=>
        {
            setIsSubmitting(true)
            try{
                const response = await axios.post<ApiResponse>("/api/sign-up",data);

                toast({
                    title:'Success',
                    description:response.data.message
                })

                router.replace(`/verify/${username}`)
                setIsSubmitting(false)
            }catch(error){
                console.error("Error in the signup of user",error)
                const axiosError = error as AxiosError<ApiResponse>;
               let errorMessage = axiosError.response?.data.message
               toast({
                title:"Signup failed",
                description:errorMessage,
                variant:"destructive"
               })
               setIsSubmitting(false)
            }

    }
    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-6 space-y-8 bg-white rounded-lg shadow-md">
               <div className="text-center">
                <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Join Anonymous Feedback
                </h1>
               <p className="mb-4"> Signup to start your anynonymous adventure</p>
               </div>
               <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                <FormField
                     name="username"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                               <Input placeholder="username"
                                {...field}
                               onChange={(e) =>{
                                 field.onChange(e)
                                 setUsername(e.target.value)
                                 }}/>
                                 
                            </FormControl>
                            {isCheckingUsername && <Loader2 className="animate-spin"/>}
                            <p className={`text-sm ${usernameMessage ==="Username is unique" ? 'text-green-500' : 'text-red-500'} `}>
                                 {usernameMessage}
                            </p>
                            <FormMessage/>
                           </FormItem>
    )}
                />
                 <FormField
                     name="email"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                               <Input placeholder="email"
                                {...field}
                               
                                 />
                            </FormControl>
                            <FormMessage/>
                           </FormItem>
    )}
                />
                 <FormField
                     name="password"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                               <Input placeholder="password" type="password"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage/>
                           </FormItem>
                       )}
                />
                <Button type="submit"  className="w-full"  disabled={isSubmitting}>
                {
                    isSubmitting?(
                        <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
                        </>
                    ):('Signup')
                }
                </Button>
                </form>
               </Form>
             <div className="text-center mt-4">
                <p>
                    Already a member?{''}
                    <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                    SignIn
                    </Link>
                </p>
             </div>
            </div>
        </div>
    )
}




