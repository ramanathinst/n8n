"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { toast } from "sonner";

export const Logout = () => {
    const router = useRouter();
    return (
        <div>
            <Button onClick={() => authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/login")
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message)
                    }
                }
            })}>
                Logout

            </Button>
        </div>
    )
}