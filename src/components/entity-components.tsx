"use client"

import { AlertTriangleIcon, Loader2Icon, MoreVerticalIcon, PackageOpenIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react"
import { Button } from "./ui/button"
import Link from "next/link"
import { Input } from "./ui/input"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card"
import { DropdownMenu } from "./ui/dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

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
                <div className="fixed bottom-0 flex-col w-full max-w-6xl p-4 rounded-3xl">
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
            <div className="flex space-x-4 items-center md:pr-2 justify-end md:w-2xl">
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

interface StateViewProps {
    message?: string
}

export const LoadingView = ({
    message
}: StateViewProps) => {
    return (
        <div className="flex flex-col flex-1 h-full gap-y-3 justify-center items-center">
            <Loader2Icon className="size-4 animate-spin text-primary" />
                {!! message && (
            <p className="text-sm text-muted-foreground">
                {message}
            </p>
            )}
        </div>
    )
}   


export const ErrorView = ({
    message
}: StateViewProps) => {
    return (
        <div className="flex flex-col flex-1 h-full gap-y-3 justify-center items-center">
            <AlertTriangleIcon className="size-4 text-primary" />
                {!! message && (
            <p className="text-sm text-muted-foreground">
                {message}
            </p>
            )}
        </div>
    )
}   

interface EmptyViewProps extends StateViewProps{
    onNew?: () => void
}

export const EmptyView = ({
    message,
    onNew
}:EmptyViewProps ) => {
    return (
    <Empty className="border border-dashed bg-white">
        <EmptyHeader>
            <EmptyMedia variant="icon">
                <PackageOpenIcon />
            </EmptyMedia>
            <EmptyTitle>No items</EmptyTitle>
            {!! message && (
                <EmptyDescription>
                    {message}
                </EmptyDescription>
            )}
        </EmptyHeader>
        {!!onNew && (
            <EmptyContent>
                <Button onClick={onNew}>
                    Add item
                </Button>
            </EmptyContent>
        )}
    </Empty>
    )
}


interface EntityListProps<T>{
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode; 
    getKey?: (item: T, index: number) => string | number;
    emptyView?: React.ReactNode;
    className?: string
}

export function EntityList<T>({
    items,
    renderItem,
    getKey,
    emptyView,
    className
}: EntityListProps<T>) {
    if(items.length === 0 && emptyView) {
        return (
            <div className="flex-1 flex justify-center items-center">
                <div className="max-w-sm mx-auto">
                    {emptyView}
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-y-4", className)}>
            {items.map((item, index) => (
                <div key={getKey ? getKey(item, index) : index}>
                    {renderItem(item, index)}
                </div>
            ))}
        </div>
    )
}

interface EntityItemProps {
    href: string,
    title: string,
    subtitle?: React.ReactNode,
    image?: React.ReactNode,
    actions?: React.ReactNode,
    onRemove?: () => void | Promise<void>,
    isRemoving?: boolean,
    className?: string
}

export const EntityItem = ({
    href,
    title,
    subtitle,
    image,
    actions,
    onRemove,
    isRemoving,
    className
}: EntityItemProps) => {

    const handleRemove = async(e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if(isRemoving) {
            return;
        }

        if(onRemove){
            await onRemove();
        }

    }
    return (
        <Link href={href} prefetch>
            <Card className={cn("p-4 shadow-none hover:shadow cursor-pointer",
                isRemoving && "opacity-50 cursor-not-allowed", className,
            )}> 
            <CardContent className="flex flex-row items-center justify-between p-0">
                <div className="flex items-center gap-4">
                    {image}
                </div>
                <CardTitle className="text-base font-medium">
                    {title}
                </CardTitle>
                {!! subtitle && (
                    <CardDescription className="text-xs">
                        {subtitle}
                    </CardDescription>
                )}
                {(actions || onRemove) && (
                    <div className="flex gap-x-5 items-center">
                        {actions}
                        {onRemove && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreVerticalIcon className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent onClick={(e) => e.stopPropagation()} align="end">
                                    <DropdownMenuItem onClick={handleRemove} className="flex border bg-amber-50 px-2 rounded-2xl gap-x-2 flex-row items-center justify-center">
                                        <TrashIcon className="size-4"/>
                                            <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                )}
            </CardContent>
            </Card>
        </Link>
    )
}