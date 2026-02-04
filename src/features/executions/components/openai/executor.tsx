import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { openAiChannel } from "@/inngest/channels/openai";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { createOpenAI } from '@ai-sdk/openai';
import prisma from "@/lib/db";
import { decryption } from "@/lib/encryptions";

Handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
});
type OpenAiNodeData = {
    variableName?: string;
    credentialId?: string;
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
};

export const openAiNodeExecutor: NodeExecutor<OpenAiNodeData> = async ({
    nodeId,
    context,
    step,
    data,
    publish,
    userId
}) => {
    await publish(
        openAiChannel().status({
            nodeId,
            status: "loading"
        })
    )
    if (!data.variableName) {
        await publish(
            openAiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Openai node: Variable name is missing")
    }

    if (!data.userPrompt) {
        await publish(
            openAiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Openai node: user prompt is missing")
    }
    if (!data.credentialId) {
        await publish(
            openAiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Openai node: credential ID is required")
    }
    const credentials = await step.run("get-credential", () => {
        return prisma.credential.findUnique({
            where: {
                id: data.credentialId,
                userId
            }
        })
    })

    if (!credentials) {
        throw new NonRetriableError("Openai node: Credential not found")
    }
    const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant";
    const userPrompt = Handlebars.compile(data.userPrompt)(context);
    const openai = createOpenAI({
        apiKey: decryption(credentials.value)
    })

    try {
        const { steps } = await step.ai.wrap("openai-generate-text", generateText, {
            model: openai(data.model || "gpt-4o-mini"),
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
            openAiChannel().status({
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
            openAiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw error;
    }
};
