"use client"

import { useReactFlow, type Node, type NodeProps } from "@xyflow/react"
import { memo, useState } from "react"
import { BaseExecutionNode } from "../base-execution-node"
import { DiscordNodeDialog, type DiscordNodeFormValues } from "./dialog"
import { useNodeStatus } from "../../hooks/use-node-status"
import { DISCORD_NODE_CHANNEL_NAME } from "@/inngest/channels/discord"
import { fetchDiscordNodeRealtimeToken } from "./actions"

type DiscordNodeData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
    username?: string;
}

type DiscordNodeType = Node<DiscordNodeData>

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
    const [dialogOpen, setDialogOpen ] = useState(false);
    const handleOpenSettings = () => setDialogOpen(true)
    
    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: DISCORD_NODE_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchDiscordNodeRealtimeToken,
    })

    const { setNodes} = useReactFlow();

    const handleSubmit = (values: DiscordNodeFormValues) => {
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
    const description = nodeData?.content ? `Send:   ${nodeData.content.slice(0, 200)}....` : "Not configured"
    return(
        <>
            <DiscordNodeDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen} 
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode 
                {...props}
                id={props.id}
                icon={"/logos/discord.svg"}
                name="Discord"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDubleClick={handleOpenSettings}
            />
        </>
    )
})
DiscordNode.displayName = "DiscordNode"