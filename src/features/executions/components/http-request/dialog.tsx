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

//
// ------------------ ZOD SCHEMA ------------------
//

export const formSchema = z.object({
    endpoint: z.url({ message: "Please enter a valid URL" }),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    body: z.string().optional(),
});

export type HttpRequestFormValues = z.infer<typeof formSchema>;

//
// ------------------ PROPS ------------------
//

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: HttpRequestFormValues) => void;
    defaultValues?: Partial<HttpRequestFormValues>
}

//
// ------------------ COMPONENT ------------------
//

export const HttpRequestDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {}
}: Props) => {
    //
    // useForm
    //
    const form = useForm<HttpRequestFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endpoint: defaultValues.endpoint,
            method: defaultValues.method || "GET",
            body: defaultValues.body,
        },
    });

    // Reset form values when dialog opens with new defaults
    useEffect(() => {
        if (open) {
            form.reset({
                endpoint: defaultValues.endpoint,
                method: defaultValues.method || "GET",
                body: defaultValues.body,
            });
        }
    }, [open, defaultValues, form]);

    const watchMethod = form.watch("method");
    const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

    //
    // Submit handler
    //
    const handleSubmit = (values: HttpRequestFormValues) => {
        onSubmit(values)
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>HTTP Request</DialogTitle>
                    <DialogDescription>
                        Configure settings for the HTTP Request node.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-8 mt-4"
                    >
                        {/* METHOD FIELD */}
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Method</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a method" />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <FormDescription>
                                        The HTTP method to use for this request
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ENDPOINT FIELD */}
                        <FormField
                            control={form.control}
                            name="endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endpoint URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/users/{{httpResponse.data.id}}" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The URL to send the HTTP request to
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* BODY FIELD (ONLY FOR POST/PUT/PATCH) */}
                        {showBodyField && (
                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Request Body</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="JSON body (optional)"
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            JSON body to send with the request (optional)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
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
