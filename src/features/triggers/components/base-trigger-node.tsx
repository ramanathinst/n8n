"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type {LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useCallback } from "react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";
import { type NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";


interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: React.ReactNode;
    status?: NodeStatus;
    onSettings?: () => void;
    onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(({
    id,
    icon: Icon,
    name,
    description,
    children,
    status,
    onSettings,
    onDoubleClick
}: BaseTriggerNodeProps) => {
    const { setNodes, setEdges } = useReactFlow();
    const handleDelete = () => {
        setNodes((currentNodes) => {
            const updatedNodes = currentNodes.filter((node) => node.id !== id);
            return updatedNodes;
        });

        // 2. Remove all edges connected to that node
        setEdges((currentEdges) => {
            const updatedEdges = currentEdges.filter(
                (edge) => edge.source !== id && edge.target !== id
            );
            return updatedEdges;
        });
    };
    return(
        <WorkflowNode
            name={name}
            description={description}
            onDelete={handleDelete}
            onSetting={onSettings}
        >
            <NodeStatusIndicator
                status={status}
                variant="border"
                className="rounded-l-2xl"
            >
                <BaseNode status={status} onDoubleClick={onDoubleClick}
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
            </NodeStatusIndicator>
        </WorkflowNode>
    )
})

BaseTriggerNode.displayName = "BaseTriggerNode"
