"use client"

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { GEMINI_MODEL, GeminiNodeDialog, type GeminiNodeFormValues } from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { GEMINI_NODE_CHANNEL_NAME } from "@/inngest/channels/gemini"
import { fetchGeminiNodeRealtimeToken } from "./actions"

type GeminiNodeData = {
    variableName?: string;
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

type GeminiNodeType = Node<GeminiNodeData>

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
    const [dialogOpen, setDialogOpen ] = useState(false);
    const handleOpenSettings = () => setDialogOpen(true)
    
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: GEMINI_NODE_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchGeminiNodeRealtimeToken,
    })

    const { setNodes} = useReactFlow();

    const handleSubmit = (values: GeminiNodeFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data: {
                        ...node.data,
                        ...values
                    },
                };
            }
            return node;
        }));
    }

    const nodeData = props.data;
    const description = nodeData?.userPrompt ? `${nodeData.model || GEMINI_MODEL[0]} : ${nodeData.userPrompt}` : "Not configured"
    return(
        <>
            <GeminiNodeDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen} 
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode 
                {...props}
                id={props.id}
                icon={"/logos/gemini.svg"}
                name="Gemini"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDubleClick={handleOpenSettings}
            />
        </>
    )
})
GeminiNode.displayName = "GeminiNode"