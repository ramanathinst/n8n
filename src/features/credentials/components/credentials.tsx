"use client";

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { CredentialsType, type Credential } from "@/generated/prisma/client";
import { formatDistanceToNow } from "date-fns"
import { useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials";
import Image from "next/image";
import { credentialsLogoOptions } from "../types/credentials";

export const CredentialsList = () => {
    const credentials = useSuspenseCredentials()

    return (
        <EntityList
            items={credentials.data.items}
            getKey={(credential) => credential.id}
            renderItem={(credential) => <CredentialsItem data={credential} />}
            emptyView={<CredentialsEmpty />}
        />
    )
}

export const CredentialsSearch = () => {

    const [params, setParams] = useCredentialsParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams
    });
    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search Credentials"
        />
    )
}

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {

    return (
        <EntityHeader
            title="Credentials"
            description="Create and manage your Credentials!"
            newButtonHref="/credentials/new"
            newButtonLabel="New Credential"
            disabled={disabled}
        />
    )
}

export const CredentialsPagination = () => {
    const credentials = useSuspenseCredentials();
    const [params, setParams] = useCredentialsParams();

    return (
        <EntityPagination
            page={credentials.data.page}
            totalPages={credentials.data.totalPage}
            onPageChange={(page) => setParams({ ...params, page })}
            disabled={credentials.isFetching}
        />
    )
}

export const CredentialsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <EntityContainer
                header={<CredentialsHeader />}
                search={<CredentialsSearch />}
                pagination={<CredentialsPagination />}
            >
                {children}
            </EntityContainer>
        </>
    )
}

export const CredentialsLoading = () => {
    return (
        <LoadingView message="Loading Credentials" />
    )
}

export const CredentialsError = () => {
    return (
        <ErrorView message="Error loading Credentials" />
    )
}

export const CredentialsEmpty = () => {
    const router = useRouter();
    const handleCreate = () => {
        router.push("/credentials/new")
    }
    return (
        <EmptyView onNew={handleCreate} message="You haven't created any credentials yet. Get started by creating your first credential" />
    )
}

export const CredentialsItem = ({
    data
}: { data: Credential }) => {
    const removeCredential = useRemoveCredential();
    const handleRemove = () => {
        removeCredential.mutate({ id: data.id })
    }
    const logo = credentialsLogoOptions[data.type]
    return (
        <EntityItem
            href={`/credentials/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })} TODO{" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(data.createdAt, { addSuffix: true })}
                </>
            }
            image={
                <div className="flex items-center justify-center size-8">
                    <Image src={logo} height={40} width={40} alt={data.name} className="size-7" />
                </div>
            }
            onRemove={handleRemove}
            isRemoving={removeCredential.isPending}
        />
    )
}