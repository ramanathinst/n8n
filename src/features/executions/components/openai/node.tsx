"use client"

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { OPENAI_MODEL, OpenAiNodeDialog, type OpenAiNodeFormValues } from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { OPEN_AI_NODE_CHANNEL_NAME } from "@/inngest/channels/openai"
import { fetchOpenAiNodeRealtimeToken } from "./actions"

type OpenAiNodeData = {
    variableName?: string;
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

type OpenAiNodeType = Node<OpenAiNodeData>

export const OpenAiNode = memo((props: NodeProps<OpenAiNodeType>) => {
    const [dialogOpen, setDialogOpen ] = useState(false);
    const handleOpenSettings = () => setDialogOpen(true)
    
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: OPEN_AI_NODE_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchOpenAiNodeRealtimeToken,
    })

    const { setNodes} = useReactFlow();

    const handleSubmit = (values: OpenAiNodeFormValues) => {
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
    const description = nodeData?.userPrompt ? `${nodeData.model || OPENAI_MODEL[0]} : ${nodeData.userPrompt}` : "Not configured"
    return(
        <>
            <OpenAiNodeDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen} 
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode 
                {...props}
                id={props.id}
                icon={"/logos/openai.svg"}
                name="Openai"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDubleClick={handleOpenSettings}
            />
        </>
    )
})
OpenAiNode.displayName = "OpenAiNode"