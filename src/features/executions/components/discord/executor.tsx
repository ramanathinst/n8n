import Handlebars from "handlebars"
import type { NodeExecutor } from "@/features/executions/types";
import { discordChannel } from "@/inngest/channels/discord";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities"
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString);
    return safeString;
});
type DiscordNodeData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
    username?: string;
};

export const discordNodeExecutor: NodeExecutor<DiscordNodeData> = async ({
    nodeId,
    context,
    step,
    data,
    publish
}) => {
    await publish(
        discordChannel().status({
            nodeId,
            status: "loading"
        })
    )

    if (!data.webhookUrl) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Discord node: Webhook url is missing")
    }
    if (!data.content) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw new NonRetriableError("Discord node: Content is required")
    }
    const rowContent = Handlebars.compile(data.content)(context);
    const content = decode(rowContent)
    const username = data.username ? decode(Handlebars.compile(data.username)(context)) : "Undefined"
    try {
        const result = await step.run("discord-webhook", async () => {
            if (!data.variableName) {
                await publish(
                    discordChannel().status({
                        nodeId,
                        status: "error"
                    })
                )
                throw new NonRetriableError("Discord node: Variable name is missing")
            }

            await ky.post(data.webhookUrl!, {
                json: {
                    content: content.slice(0, 2000),
                    username
                }
            })
            return {
                ...context,
                [data.variableName]: {
                    messageContent: content.slice(0, 2000)
                }
            }
        })
        await publish(
            discordChannel().status({
                nodeId,
                status: "success"
            })
        )
        return result;
    } catch (error) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error"
            })
        )
        throw error;
    }
};
