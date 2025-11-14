"use client";

import { type NodeProps, Position } from "@xyflow/react";
import type {LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useCallback } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";


interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: React.ReactNode;
    // status?: Nodestatus
    onSettings?: () => void;
    onDubleClick?: () => void;
}

export const BaseTriggerNode = memo(({
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDubleClick
}: BaseTriggerNodeProps) => {

    const handleDelete = () => {

    }
    return(
        <WorkflowNode
            name={name}
            description={description}
            onDelete={handleDelete}
            onSetting={onSettings}
        >
            <BaseNode onDoubleClick={onDubleClick}
                className="rounded-l-2xl relative group"
            >
                <BaseNodeContent>
                    { typeof Icon === "string" ? (
                        <Image 
                            src={Icon} 
                            width={40} 
                            height={40} 
                            className="size-4" 
                            alt={name} 
                        />
                    ): (
                        <Icon className="text-muted-foreground size-4" /> 
                    )}
                        {children}
                        <BaseHandle 
                            id="source-1"
                            type="source"
                            position={Position.Right}
                        />
                </BaseNodeContent>
            </BaseNode>
        </WorkflowNode>
    )
})

BaseTriggerNode.displayName = "BaseTriggerNode"
