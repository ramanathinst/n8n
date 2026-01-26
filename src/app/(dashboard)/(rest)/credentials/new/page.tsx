import { CredentialForm } from "@/features/credentials/components/credential";
import { CredentialsContainer, CredentialsError, CredentialsList, CredentialsLoading } from "@/features/credentials/components/credentials";
import { credentialsParamsLoader } from "@/features/credentials/server/params-loader";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import { requiredAuth } from "@/lib/auth.utils";
import { HydrateClient } from "@/trpc/server";
import { type SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Page = async() => {
    await requiredAuth();
    return(
            <HydrateClient>
                <ErrorBoundary fallback={<CredentialsError />}>
                    <Suspense fallback={<CredentialsLoading />}>
                        <CredentialForm />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
    )
}

export default Page;