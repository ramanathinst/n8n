import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { StripeTriggerDialog } from "./dialog";
import { BaseTriggerNode } from "../base-trigger-node";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger";
import { useNodeStatus } from "@/features/executions/hooks/use-node-status";
import { fetchStripeTriggerRealtimeToken } from "./actions";

export const StripeTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpenSettings = () => setDialogOpen(true)

    const nodeStatus = useNodeStatus({
            nodeId: props.id,
            channel: STRIPE_TRIGGER_CHANNEL_NAME,
            topic: "status",
            refreshToken: fetchStripeTriggerRealtimeToken,
        })
    return (
        <>
            <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode
                {...props}
                icon={"/logos/stripe.svg"}
                name="Stripe"
                description="When event is captured"
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        </>
    );
});