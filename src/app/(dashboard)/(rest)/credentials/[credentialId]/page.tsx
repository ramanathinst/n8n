import { CredentialForm, CredentialFormView } from "@/features/credentials/components/credential";
import { CredentialsError, CredentialsLoading } from "@/features/credentials/components/credentials";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { requiredAuth } from "@/lib/auth.utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface PageProps {
    params: Promise<{
        credentialId: string
    }>
}

const Page = async({params}: PageProps) => {
    await requiredAuth();
    const { credentialId } = await params;
    prefetchCredential(credentialId)
    return(

        <HydrateClient>
            <ErrorBoundary fallback={<CredentialsError />}>
                <Suspense fallback={<CredentialsLoading />}>
                    <CredentialFormView credentialId={credentialId} />
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    )
}

export default Page;