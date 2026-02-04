import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { anthropicChannel } from "@/inngest/channels/anthropic";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { createAnthropic } from '@ai-sdk/anthropic';
import prisma from "@/lib/db";
import { decryption } from "@/lib/encryptions";

Handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
});
type AnthropicNodeData = {
    variableName?: string;
    credentialId?: string;
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
};

export const anthropicNodeExecutor: NodeExecutor<AnthropicNodeData> = async ({
    nodeId,
    context,
    step,
    data,
    publish,
    userId
}) => {
    await publish(
        anthropicChannel().status({
            nodeId,
            status: "loading"
        })
    )
    if (!data.variableName) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Anthropic node: Variable name is missing")
    }

    if (!data.userPrompt) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Anthropic node: user prompt is missing")
    }
    if (!data.credentialId) {
            await publish(
                anthropicChannel().status({
                    nodeId,
                    status: "error"
                })
            )
            throw new NonRetriableError("Anthropic node: credential ID is required")
        }
        const credentials = await step.run("get-credential", () => {
            return prisma.credential.findUnique({
                where: {
                    id: data.credentialId,
                    userId
                }
            })
        })
    
        if(!credentials) {
            throw new NonRetriableError("Anthropic node: Credential not found")
        }
    const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant";
    const userPrompt = Handlebars.compile(data.userPrompt)(context);
    const anthropic = createAnthropic({
        apiKey: decryption(credentials.value)
    })

    try {
        const { steps } = await step.ai.wrap("anthropic-generate-text", generateText, {
            model: anthropic(data.model || "claude-3-haiku-20240307"),
            system: systemPrompt,
            prompt: userPrompt,
            experimental_telemetry: {
                isEnabled: true,
                recordInputs: true,
                recordOutputs: true
            }
        })
        const text = steps[0].content[0].type === "text" ? steps[0].content[0].text : "";
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "success"
            })
        )
        return {
            ...context,
            [data.variableName]: {
                aiResponse: text
            }
        }
    } catch (error) {
        await publish(
            anthropicChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw error;
    }
};
