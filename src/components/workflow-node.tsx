"use client"

import { NodeToolbar, Position } from "@xyflow/react";
import type { ReactNode } from "react"
import { Button } from "./ui/button";
import { SettingsIcon, TrashIcon } from "lucide-react";

interface WorkflowNodeProps {
    children: ReactNode;
    showToolbar?: boolean;
    onDelete?: () => void;
    onSetting?: () => void;
    name?: string;
    description?: string
}

export function WorkflowNode({
    children,
    showToolbar = true,
    onDelete,
    onSetting,
    name,
    description
}: WorkflowNodeProps){
    return (
        <>
            {showToolbar && (
                <NodeToolbar>
                    <Button onClick={onSetting} size="sm" variant="ghost">
                        <SettingsIcon className="size-4" />
                    </Button>

                    <Button onClick={onDelete} size="sm" variant="ghost">
                        <TrashIcon className="size-4" />
                    </Button>   
                </NodeToolbar>
            )}
            {children}
            {name && (
                <NodeToolbar
                    position={Position.Bottom}
                    isVisible
                    className="max-w-[200px] text-center"
                >
                    <p className="font-medium">{name}</p>
                    {description && (
                        <p className="text-muted-foreground text-sm truncate">{description}</p>
                    )}
                </NodeToolbar>
            )}            
        </>
    )
}