"use client";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialsType } from "@/generated/prisma/enums";
import Image from "next/image";

const formSchema = z.object({
    variableName: z
        .string()
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
            message:
                "Variable name must start with a letter, underscore, or $ and contain only letters, numbers, underscores, or $",
        }),
    credentialId: z.string(),
    model: z.string().min(1, { message: "Model is required" }),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, { message: "Prompt is required" })
});

export type OpenAiNodeFormValues = z.infer<typeof formSchema>;
export const OPENAI_MODEL = [
    "gpt-4o-mini",
    "gpt-3.5-turbo",
    "gpt-4o",
    "gpt-4.1",
    "gpt-4.1-mini",
    "o4-mini",
    "o3-mini"
];
interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: OpenAiNodeFormValues) => void;
    defaultValues?: Partial<OpenAiNodeFormValues>
}

export const OpenAiNodeDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {

    const form = useForm<OpenAiNodeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            credentialId: defaultValues.credentialId || "",
            model: defaultValues.model || "",
            systemPrompt: defaultValues.systemPrompt,
            userPrompt: defaultValues.userPrompt,
        },
    });

    // Reset form values when dialog opens with new defaults
    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                credentialId: defaultValues.credentialId || "",
                model: defaultValues.model || "",
                systemPrompt: defaultValues.systemPrompt,
                userPrompt: defaultValues.userPrompt,
            });
        }
    }, [open, defaultValues, form]);

    const watchVariable = form.watch("variableName") || "prompt"

    const handleSubmit = (values: OpenAiNodeFormValues) => {
        onSubmit(values)
        onOpenChange(false);
    };
    const { data: credentials, isLoading: isCredentialsLoading } = useCredentialsByType(CredentialsType.OPENAI)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Open Ai</DialogTitle>
                    <DialogDescription>
                        Configure settings for the Openai.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 mt-4"
                    >
                        {/* Varialble FIELD */}
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Variable" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Use this name to reference the result in other nodes:
                                        <br />
                                        {`{{${watchVariable}.openai.text}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="credentialId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Credential</FormLabel>
                                    <FormControl>
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select credential" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {credentials?.map((credential) => (
                                                    <SelectItem
                                                        key={credential.id}
                                                        value={credential.id}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Image
                                                                src={"/logos/openai.svg"}
                                                                width={20}
                                                                height={20}
                                                                alt={credential.name}
                                                            />
                                                            <span>{credential.name}</span>
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
                        {/* METHOD FIELD */}
                        <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Model</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a Model" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {OPENAI_MODEL.map((model) => (
                                                <SelectItem key={model} value={model}>
                                                    {model}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ENDPOINT FIELD */}
                        <FormField
                            control={form.control}
                            name="systemPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="System Prompt (optional)"
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="userPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>User Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="User Prompt"
                                            className="min-h-[120px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-primary text-white rounded-md"
                            >
                                Save
                            </button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
