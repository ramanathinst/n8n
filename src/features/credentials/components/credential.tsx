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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";
import { CredentialsType } from "@/generated/prisma/enums";
import { useCreateCredential, useSuspenseCredential, useUpdateCredential } from "../hooks/use-credentials";

const formSchema = z.object({
    name: z.string().min(1, "name is required"),
    type: z.enum(CredentialsType),
    value: z.string().min(1, " ")
})
type FormValues = z.infer<typeof formSchema>;

interface CredentialFormProps {
    initialData?: {
        id?: string;
        name: string;
        type: CredentialsType;
        value: string;
    }
}

const credentialsOptions = [
    {
        label: "OpenAi",
        logo: "/logos/openai.svg",
        value: CredentialsType.OPENAI,
    },
    {
        label: "Gemini",
        logo: "/logos/gemini.svg",
        value: CredentialsType.GEMINI,
    },
    {
        label: "Anthropic",
        logo: "/logos/anthropic.svg",
        value: CredentialsType.ANTHROPIC,
    }
]

export const CredentialForm = ({
    initialData
}: CredentialFormProps) => {

    const updateCredential = useUpdateCredential();
    const createCredential = useCreateCredential();
    const router = useRouter();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            type: CredentialsType.OPENAI,
            value: ""
        }
    })
    const isEdit = initialData?.id;

    const onSubmit = async (values: FormValues) => {
        if (isEdit && initialData.id) {
            await updateCredential.mutateAsync({
                id: initialData.id,
                ...values
            }, {
                onSuccess: () => {
                    router.push(`/credentials`)
                }
            })
        } else {
            await createCredential.mutateAsync(values, {
                onSuccess: () => {
                    router.push(`/credentials`)
                }
            })
        }

    }
    return (
        <Card className="flex flex-col justify-center p-8 m-8 max-w-2xl">
            <CardHeader className="flex items-center flex-col">
                <CardTitle> {isEdit ? "Edit your credential" : "Create new credential"}  </CardTitle>
            </CardHeader>

            <CardContent className="p-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-6">

                            <div className="grid gap-6">
                                {/* Email */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Credential Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select credential type" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {credentialsOptions.map((option) => (
                                                            <SelectItem
                                                                key={option.value}
                                                                value={option.value}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <Image
                                                                        src={option.logo}
                                                                        width={20}
                                                                        height={20}
                                                                        alt={option.label}
                                                                    />
                                                                    <span>{option.label}</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Password */}
                                <FormField
                                    control={form.control}
                                    name="value"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Value</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="Sk-......" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full mt-8"
                                    disabled={updateCredential.isPending || createCredential.isPending}
                                >
                                    {isEdit ? "Update" : "Create"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export const CredentialFormView = ({ credentialId }: { credentialId: string }) => {
    const { data: credential } = useSuspenseCredential(credentialId);
    return (
        <CredentialForm initialData={credential} />
    )
}