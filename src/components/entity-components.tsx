"use client"

import { PlusIcon, SearchIcon } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"
import { Input } from "./ui/input"

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
        <div className="relative p-8 md:px-8 md:py-8 gap-8">
            <div className="flex flex-col w-full max-w-6xl mx-auto">
                {header}
                <div className="flex flex-col gap-5">
                    {search}
                    {children}
                </div>
                <div className="fixed bottom-0 flex-col w-full max-w-6xl bg-amber-50 p-4 rounded-3xl">
                    {pagination}
                </div>
            </div>
        </div>
        </>
    )
}

interface EntitySearchProps {
    value: string,
    onChange: (value: string) => void,
    placeholder?: string
}

export const EntitySearch = ({ value, onChange, placeholder= "Search" }: EntitySearchProps) => {
    return (
        <div className="relative ml-auto">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <Input className="max-w-[200px] bg-background shadow-none border-border pl-8" 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                placeholder={placeholder} />
        </div>
    )
}

interface EntityPaginationProps {
    page: number,
    totalPages: number,
    onPageChange: (page: number) => void,
    disabled?: boolean
}

export const EntityPagination = ({
    page,
    totalPages,
    onPageChange,
    disabled
}: EntityPaginationProps) => {
    return (
        <div className="flex items-center justify-between gap-x-4 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                Page {page} of {totalPages || 1}
            </div>
            <div className="flex space-x-4 items-center justify-end">
                <Button 
                    disabled={page === 1 || disabled}
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.max(1, page - 1))}
                    >
                        Previous
                </Button>

                <Button 
                    disabled={page === totalPages || totalPages === 0 || disabled}
                    variant="outline"
                    size="sm"
                    onClick={() => onPageChange(Math.min(totalPages, page + 1 ))}
                    >
                        Next
                </Button>
            </div>
        </div>
    )
}