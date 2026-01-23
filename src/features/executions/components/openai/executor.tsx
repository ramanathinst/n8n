import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { openAiChannel } from "@/inngest/channels/openai";
import { generateText } from "ai";
import { NonRetriableError } from "inngest";
import { createOpenAI } from '@ai-sdk/openai';

Handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
});
type OpenAiNodeData = {
    variableName?: string;
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
};

export const openAiNodeExecutor: NodeExecutor<OpenAiNodeData> = async ({
    nodeId,
    context,
    step,
    data,
    publish
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
    const systemPrompt = data.systemPrompt ? Handlebars.compile(data.systemPrompt)(context) : "You are a helpful assistant";
    const userPrompt = Handlebars.compile(data.userPrompt)(context);
    const credentialValue = process.env.OPENAI_API_KEY!;
    const openai = createOpenAI({
        apiKey: credentialValue
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
