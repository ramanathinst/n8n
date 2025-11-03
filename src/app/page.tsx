import { caller, getQueryClient, trpc } from "@/trpc/server";
import { Client } from "./client";
import { hydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { Logout } from "./logout";
import { requiredAuth } from "@/lib/auth.utils";

const Page = async() => {
    await requiredAuth();
    const users = await caller.getUsers();
    
  return(
    <div className="flex flex-col items-center justify-center min-h-screen">
        {JSON.stringify(users, null, 2)}
        <Logout/>
    </div>
  )
}
export default Page;