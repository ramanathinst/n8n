import { getQueryClient, trpc } from "@/trpc/server";
import { Client } from "./client";
import { hydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const Page = async() => {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

  return(
    <div className="flex flex-col items-center justify-center min-h-screen">
      <HydrationBoundary state={hydrate(queryClient)}>
        <Suspense fallback={<p>Loading...</p>}>
            <Client />
        </Suspense>
      </HydrationBoundary>
    </div>
  )
}
export default Page;