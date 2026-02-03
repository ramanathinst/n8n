import { NodeType } from "@/generated/prisma/enums";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/components/manual-trigger/executor";
import { httpRequestExecutor } from "../components/http-request/executor";
import { gooogleFormTriggerExecutor } from "@/features/triggers/components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/components/stripe-trigger/executor";
import { geminiNodeExecutor } from "../components/gemini/executor";
import { openAiNodeExecutor } from "../components/openai/executor";
import { anthropicNodeExecutor } from "../components/anthropic/executor";
import { discordNodeExecutor } from "../components/discord/executor";

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: gooogleFormTriggerExecutor,
    [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
    [NodeType.GEMINI]: geminiNodeExecutor,
    [NodeType.OPENAI]: openAiNodeExecutor,
    [NodeType.ANTHROPIC]: anthropicNodeExecutor,
    [NodeType.DISCORD]: discordNodeExecutor,
    [NodeType.SLACK]: discordNodeExecutor,
};

export const getExecutor = (type: NodeType): NodeExecutor => {
    const executor = executorRegistry[type];

    if (!executor) {
        throw new Error(`No executor found for node type: ${type}`);
    }

    return executor;
};
