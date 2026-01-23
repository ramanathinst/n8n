"use client"

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { ANTHROPIC_MODEL, AnthropicNodeDialog, type AnthropicNodeFormValues } from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { ANTHROPIC_NODE_CHANNEL_NAME } from "@/inngest/channels/anthropic"
import { fetchAnthropicNodeRealtimeToken } from "./actions"

type AnthropicNodeData = {
    variableName?: string;
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

type AnthropicNodeType = Node<AnthropicNodeData>

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
    const [dialogOpen, setDialogOpen ] = useState(false);
    const handleOpenSettings = () => setDialogOpen(true)
    
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: ANTHROPIC_NODE_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchAnthropicNodeRealtimeToken,
    })

    const { setNodes} = useReactFlow();

    const handleSubmit = (values:AnthropicNodeFormValues) => {
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
    const description = nodeData?.userPrompt ? `${nodeData.model || ANTHROPIC_MODEL[0]} : ${nodeData.userPrompt}` : "Not configured"
    return(
        <>
            <AnthropicNodeDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen} 
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode 
                {...props}
                id={props.id}
                icon={"/logos/anthropic.svg"}
                name="Anthropic"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDubleClick={handleOpenSettings}
            />
        </>
    )
})
AnthropicNode.displayName = "AnthropicNode"