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
import Image from "next/image";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialsType } from "@/generated/prisma/enums";

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

export type GeminiNodeFormValues = z.infer<typeof formSchema>;
export const GEMINI_MODEL = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.0-pro",
    "gemini-1.0-pro-vision",
    "gemini-2.5-flash"
];
interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: GeminiNodeFormValues) => void;
    defaultValues?: Partial<GeminiNodeFormValues>
}

export const GeminiNodeDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {

    const form = useForm<GeminiNodeFormValues>({
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

    const handleSubmit = (values: GeminiNodeFormValues) => {
        onSubmit(values)
        onOpenChange(false);
    };
    const { data: credentials , isLoading: isCredentialsLoading } = useCredentialsByType(CredentialsType.GEMINI)
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gemini Ai</DialogTitle>
                    <DialogDescription>
                        Configure settings for the Gemini.
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
                                        {`{{${watchVariable}.gemini.text}}`}
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
                                                                src={"/logos/gemini.svg"}
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
                                            {GEMINI_MODEL.map((model) => (
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
