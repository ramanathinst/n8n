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


const loginSchema = z.object({
    email: z.email().min(1, "Please enter a valid email address!"),
    password: z.string().min(1, "Password is required!")
})

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const router = useRouter();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = async(values: LoginFormValues) => {
       await authClient.signIn.email(
        {
        email: values.email,
        password: values.password,
        callbackURL: "/"
       },
       {
        onSuccess: () => {
            toast.success("Login Successfull!")
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
                <CardHeader>
                    <CardTitle> Wilcome to website!</CardTitle>
                    <CardDescription>Login to continue!</CardDescription>
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
                                            Continue to GitHub
                                    </Button>

                                    <Button 
                                        type="button"
                                        variant="outline"
                                        disabled={isPending}
                                        className="w-full"
                                        >
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

                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isPending}
                                        >
                                            {isPending ? "Logging in..." : "Login"}
                                        </Button>


                                              {/* Divider & Signup link */}
                                        <div className="text-center text-sm text-muted-foreground">
                                            Don’t have an account?{" "}
                                            <Link
                                            href="/signup"
                                            className="text-primary font-medium hover:underline"
                                            >
                                            Sign up
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