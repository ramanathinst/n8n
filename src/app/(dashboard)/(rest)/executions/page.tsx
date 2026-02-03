import { executionsParamsLoader } from "@/features/executions/server/params-loader";
import { prefetchExecutions } from "@/features/executions/server/prefetch";
import { requiredAuth } from "@/lib/auth.utils";
import { HydrateClient } from "@/trpc/server";
import { type SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
type Props = {
    searchParams: Promise<SearchParams>
}
const Page = async({ searchParams}: Props) => {
    await requiredAuth();
    const params = await executionsParamsLoader(searchParams)
    prefetchExecutions(params);
    return(
        <>
            <HydrateClient>
                <ErrorBoundary fallback={<></>}>
                    <Suspense fallback={<></>}>
                        // TODO: List of executions
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </>
    )
}

export default Page;