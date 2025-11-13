"use client"

import { memo } from "react"
import { PlaceholderNode } from "./react-flow/placeholder-node"
import { PlusIcon } from "lucide-react"
import type { NodeProps } from "@xyflow/react"
import { WorkflowNode } from "./workflow-node"

export const InitailNode = memo((props: NodeProps) => {
    return (
        <WorkflowNode showToolbar={false}>
            <PlaceholderNode 
            {...props}
            onClick={() => {}}
            >
                <div className="flex items-center justify-center cursor-pointer">
                    <PlusIcon className="size-4"/>
                </div>
            </PlaceholderNode>
        </WorkflowNode>
    )
})