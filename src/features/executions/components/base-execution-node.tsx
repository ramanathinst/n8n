"use client";

import { type NodeProps, Position } from "@xyflow/react";
import type {LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useCallback } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";


interface BaseExecutionNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: React.ReactNode;
    // status?: Nodestatus
    onSettings?: () => void;
    onDubleClick?: () => void;
}

export const BaseExecutionNode = memo(({
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDubleClick
}: BaseExecutionNodeProps) => {

    const handleDelete = () => {

    }
    return(
        <WorkflowNode
            name={name}
            description={description}
            onDelete={handleDelete}
            onSetting={onSettings}
        >
            <BaseNode onDoubleClick={onDubleClick}>
                <BaseNodeContent>
                    { typeof Icon === "string" ? (
                        <Image src={Icon} width={40} height={40} className="size-4" alt={name} />
                    ): (
                        <Icon className="text-muted-foreground size-4" /> 
                    )}
                        {children}
                        <BaseHandle 
                            id="target-1"
                            type="target"
                            position={Position.Left}
                        />

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

BaseExecutionNode.displayName = "BaseExecutionNode"
