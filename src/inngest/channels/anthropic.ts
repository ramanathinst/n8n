import { channel, topic } from "@inngest/realtime";
export const ANTHROPIC_NODE_CHANNEL_NAME="anthropic-ai-execution"

export const anthropicChannel = channel(ANTHROPIC_NODE_CHANNEL_NAME)
    .addTopic(
        topic("status").type<{
            nodeId: string;
            status: "loading" | "success" | "error";
        }>()
    );
