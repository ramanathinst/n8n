"use client"

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";

export const Client = () => {
    const tprc = useTRPC();
    const { data: users} = useSuspenseQuery(tprc.getUsers.queryOptions());
    return (
        <div>
            {JSON.stringify(users, null , 2)}
        </div>
    )
}