import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { geminiChannel } from "@/inngest/channels/gemini";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import prisma from "@/lib/db";

Handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
});
type GeminiNodeData = {
    variableName?: string;
    credentialId?: string;
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
};

export const geminiNodeExecutor: NodeExecutor<GeminiNodeData> = async ({
    nodeId,
    context,
    step,
    data,
    publish
}) => {
    await publish(
        geminiChannel().status({
            nodeId,
            status: "loading"
        })
    )
    if (!data.variableName) {
        await publish(
            geminiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Gemini node: Variable name is missing")
    }

    if (!data.userPrompt) {
        await publish(
            geminiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Gemini node: user prompt is missing")
    }
    if (!data.credentialId) {
        await publish(
            geminiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Gemini node: credential ID is required")
    }
    const credentials = await step.run("get-credential", () => {
        return prisma.credential.findUnique({
            where: {
                id: data.credentialId
            }
        })
    })

    if(!credentials) {
        throw new NonRetriableError("Gemini node: Credential not found")
    }
    const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant";
    const userPrompt = Handlebars.compile(data.userPrompt)(context);
    const google = createGoogleGenerativeAI({
        apiKey: credentials.value
    })

    try {
        const { steps } = await step.ai.wrap("gemini-generate-text", generateText, {
            model: google(data.model || "gemini-2.5-flash"),
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
            geminiChannel().status({
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
            geminiChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw error;
    }
};
