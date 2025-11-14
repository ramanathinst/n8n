"use client"

import { memo, useState } from "react"
import { PlaceholderNode } from "./react-flow/placeholder-node"
import { PlusIcon } from "lucide-react"
import type { NodeProps } from "@xyflow/react"
import { WorkflowNode } from "./workflow-node"
import { NodeSelector } from "./node-selector"

export const InitailNode = memo((props: NodeProps) => {
        const [selectorOpen, setSelectorOpen ] = useState(false)
    return (
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
            <WorkflowNode showToolbar={false}>
                <PlaceholderNode 
                {...props}
                onClick={() => setSelectorOpen(true)}
                >
                    <div className="flex items-center justify-center cursor-pointer">
                        <PlusIcon className="size-4"/>
                    </div>
                </PlaceholderNode>
            </WorkflowNode>
        </NodeSelector>
    )
})