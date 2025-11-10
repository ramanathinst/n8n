import { WorkflowsContainer, WorkflowsList } from "@/features/workflows/components/workflows";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requiredAuth } from "@/lib/auth.utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"
import type { SearchParams } from "nuqs/server";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";

type Props = {
    searchParams: Promise<SearchParams>
}

const Page = async({ searchParams}: Props) => {
    await requiredAuth();
    const params = await workflowsParamsLoader(searchParams)
    prefetchWorkflows(params);
    
    return(
        <WorkflowsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<div>Something went wrong</div>}>
                    <Suspense fallback={<div>Loading...</div>}>
                        <WorkflowsList/>
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </WorkflowsContainer>
    )
}

export default Page;