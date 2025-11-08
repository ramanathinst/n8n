"use client"

import { PlusIcon } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"

type EntityHeaderProps = {
    title: string,
    description?: string,
    newButtonLabel: string,
    disabled?: boolean,
    isCreating?: boolean
} & (
    | { onNew: () => void, newButtonHref?: never }
    | { onNew?: never, newButtonHref: string }
    | { onNew?: never, newButtonHref?: never }
)

export const EntityHeader = ({
    title,
    description,
    onNew,
    newButtonHref,
    newButtonLabel,
    disabled,
    isCreating
}: EntityHeaderProps) => {
    return (
        <>
        <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col py-7 border-b">
                <h1 className="text-2xl font-semibold">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
            </div>
            { onNew && !newButtonHref && (
                <Button onClick={onNew} disabled={disabled || isCreating} size="sm">
                    <PlusIcon size={4} />
                    {newButtonLabel}
                </Button>
            )}

            { newButtonHref && !onNew && (
                <Button asChild size="sm">
                    <Link href={newButtonHref} prefetch>
                        <PlusIcon size={4} />
                        {newButtonLabel}
                    </Link>
                </Button>
            )}
        </div>
        </>
    )
}

type EntityContainerProps = {
    children: React.ReactNode,
    header?: React.ReactNode,
    search?: React.ReactNode,
    pagination?: React.ReactNode
}

export const EntityContainer = ({
    children,
    header,
    search,
    pagination
}: EntityContainerProps) => {
    
    return(
        <>
        <div className="p-8 md:px-8 md:py-8 gap-8">
            <div className="flex flex-col w-full">
                {header}
                <div className="flex flex-col gap-5 bg-amber-100">
                    {search}
                    {children}
                </div>
                {pagination}
            </div>
        </div>
        </>
    )
}