"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useSuspenseWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows"
import { SaveIcon } from "lucide-react"
import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"

export const EditorSaveButton =  ({workflowId}: {workflowId: string}) => {
    return (
        <div className="ml-auto">
            <Button onClick={() => {}} disabled={false} size="sm">
                <SaveIcon className="size-4" />
                Save
            </Button>

        </div>
    )
}

export const EditorNameInput = ({workflowId}: {workflowId: string}) => {
    const {data : workflow } = useSuspenseWorkflow(workflowId);
    const updateWorflow = useUpdateWorkflowName();

    const [isEditing, setIsEditing ] = useState(false);
    const [name, setName ] = useState(workflow.name)

    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if(workflow.name) {
            setName(workflow.name)
        }
    }, [workflow.name])

    useEffect(() => {
        if(isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing])
    
    const handleSave = async() => {
        if(name === workflow.name) {
            setIsEditing(false)
            return
        }

        try {
            await updateWorflow.mutateAsync({
                id: workflow.id,
                name
            })
        } catch {
            setName(workflow.name)
        } finally {
            setIsEditing(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if(e.key === "Enter") {
            handleSave();
        }else if(e.key === "Escape") {
            setName(workflow.name)
            setIsEditing(false)
        }
    }

    if(isEditing) {
        return (
            <Input 
                disabled={updateWorflow.isPending}
                ref={inputRef}
                onChange={(e) => setName(e.target.value)}
                value={name}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="px-2 w-auto h-7 min-w-[100px]"
            />
        )
    }

    return(
        <BreadcrumbItem onClick={() => setIsEditing(true)} className="cursor-pointer hover:text-foreground transition-colors">
            {workflow.name}
        </BreadcrumbItem>
    )
}


export const EditorBreadcrums =  ({workflowId}: {workflowId: string}) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link prefetch href={"/workflows"}>
                            Workflows
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <EditorNameInput workflowId={workflowId} />
            </BreadcrumbList>
        </Breadcrumb>
    )
}
export const EditorHeader = ({workflowId}: {workflowId: string}) => {
    return(
        <header className="flex flex-col gap-x-4 p-3 border-b">
            <SidebarTrigger />
            <div className="flex flex-row items-center justify-between gap-x-4 w-full">
                <EditorBreadcrums workflowId={workflowId} />
                <EditorSaveButton workflowId={workflowId} />
            </div>
        </header>
    )
}