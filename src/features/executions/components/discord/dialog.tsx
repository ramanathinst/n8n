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
    username: z.string().optional(),
    content: z.string().min(1, "content is required").max(2000, "Discord not allowed above 2000 context"),
    webhookUrl: z.string().min(1, "Webhook url is required"),
});

export type DiscordNodeFormValues = z.infer<typeof formSchema>;
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
    onSubmit: (values: DiscordNodeFormValues) => void;
    defaultValues?: Partial<DiscordNodeFormValues>
}

export const DiscordNodeDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {},
}: Props) => {

    const form = useForm<DiscordNodeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            username: defaultValues.username || "",
            content: defaultValues.content || "",
            webhookUrl: defaultValues.webhookUrl || "",
        },
    });

    // Reset form values when dialog opens with new defaults
    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                username: defaultValues.username || "",
                content: defaultValues.content || "",
                webhookUrl: defaultValues.webhookUrl || "",
            });
        }
    }, [open, defaultValues, form]);

    const watchVariable = form.watch("variableName") || "myDiscord"

    const handleSubmit = (values: DiscordNodeFormValues) => {
        onSubmit(values)
        onOpenChange(false);
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Discord</DialogTitle>
                    <DialogDescription>
                        Configure settings for the Discord.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 mt-4"
                    >
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
                                        {`{{${watchVariable}.discord.text}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* METHOD FIELD */}
                        <FormField
                            control={form.control}
                            name="webhookUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Webhook URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://webhookurl.com/api/" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Setup Discord instruction */}
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h4 className="font-medium text-sm">Setup instructions:</h4>
                            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                                <li>Open your Discord server</li>
                                <li>Go to <strong>Server Settings → Integrations → Webhooks</strong></li>
                                <li>Click <strong>New Webhook</strong></li>
                                <li>Select the channel where messages should be sent</li>
                                <li>Copy the <strong>Webhook URL</strong></li>
                                <li>Paste the webhook URL in the field above</li>
                                <li>Save changes</li>
                            </ol>
                        </div>

                        {/* ENDPOINT FIELD */}
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Write Context</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Write message"
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
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bot username optional </FormLabel>
                                    <FormControl>
                                        <Input placeholder="user name (optional)" {...field} />
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
