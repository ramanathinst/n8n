"use client";

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, ErrorView, LoadingView } from "@/components/entity-components";
import { Execution } from "@/generated/prisma/client";
import { formatDistanceToNow } from "date-fns"
import { useSuspenseExecutions } from "../hooks/use-executions";
import { useExecutionsParams } from "../hooks/use-executions-params";

export const ExecutionsList = () => {
    const executions = useSuspenseExecutions()

    return (
        <EntityList
            items={executions.data.items}
            getKey={(execution) => execution.id}
            renderItem={(execution) => <ExecutionsItem data={execution} />}
            emptyView={<ExecutionsEmpty />}
        />
    )
}

export const ExecutionsHeader = () => {

    return (
        <EntityHeader
            title="Executions"
            description="View your workflow execution history"
        />
    )
}

export const ExecutionsPagination = () => {
    const executions = useSuspenseExecutions();
    const [params, setParams] = useExecutionsParams();

    return (
        <EntityPagination
            page={executions.data.page}
            totalPages={executions.data.totalPage}
            onPageChange={(page) => setParams({ ...params, page })}
            disabled={executions.isFetching}
        />
    )
}

export const ExecutionsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <EntityContainer
                header={<ExecutionsHeader />}
                pagination={<ExecutionsPagination />}
            >
                {children}
            </EntityContainer>
        </>
    )
}

export const ExecutionsLoading = () => {
    return (
        <LoadingView message="Loading executions" />
    )
}

export const ExecutionsError = () => {
    return (
        <ErrorView message="Error loading executions" />
    )
}

export const ExecutionsEmpty = () => {

    return (
        <EmptyView message="You haven't run any executions yet. Get started by runnig your first workflow" />
    )
}

export const ExecutionsItem = ({
    data
}: { data: Execution }) => {


    return (
        <EntityItem
            href={`/credentials/${data.id}`}
            title=""
            subtitle=""
            image=""
        />
    )
}