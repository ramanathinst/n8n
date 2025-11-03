"use client"

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";


const signupSchema = z
  .object({
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"], // highlight the confirmPassword field
    message: "Passwords do not match",
  });

type signupFormValues = z.infer<typeof signupSchema>;

export const SignupForm = () => {
    const router = useRouter();

    const form = useForm<signupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: ""
        }
    })

    const onSubmit = async(values: signupFormValues) => {
       await authClient.signUp.email(
        {
        name: values.email,
        email: values.email,
        password: values.password,
        callbackURL: "/"
       },
       {
        onSuccess: () => {
            toast.success("Signup Successfull!")
            router.push("/")
        },
        onError: (ctx) => {
            toast.error(ctx.error.message)
        }
       }
       )
    }

    const isPending = form.formState.isSubmitting;

    return(
        <div className="flex flex-col gap-6">
            <Card>
                 <CardHeader className="flex items-center flex-col">
                    <CardTitle> Wilcome to website!</CardTitle>
                    <CardDescription>Create an account to get started!</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button 
                                        type="button"
                                        variant="outline"
                                        disabled={isPending}
                                        className="w-full"
                                        >
                                            <Image src={"/logos/github.svg"} width={20} height={20} alt="GitHub" />
                                            Continue to GitHub
                                    </Button>

                                    <Button 
                                        type="button"
                                        variant="outline"
                                        disabled={isPending}
                                        className="w-full"
                                        >
                                            <Image src={"/logos/google.svg"} width={20} height={20} alt="Google" />
                                            Continue to Google
                                    </Button>
                                </div>

                                <div className="grid gap-6">
                                     {/* Email */}
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                <Input placeholder="you@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />

                                        {/* Password */}
                                        <FormField
                                            control={form.control}
                                            name="password"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />

                                        {/*Confirm Password */}
                                        <FormField
                                            control={form.control}
                                            name="confirmPassword"
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirm Password</FormLabel>
                                                <FormControl>
                                                <Input type="password" placeholder="********" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isPending}
                                        >
                                            {isPending ? "Signing up..." : "Sign up"}
                                        </Button>


                                              {/* Divider & Signup link */}
                                        <div className="text-center text-sm text-muted-foreground">
                                            Already have an account?{" "}
                                            <Link
                                            href="/login"
                                            className="text-primary font-medium hover:underline"
                                            >
                                            Login
                                            </Link>
                                        </div>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}