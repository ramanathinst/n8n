"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { openAiChannel } from "@/inngest/channels/openai";

export type OpenAiNodeToken = Realtime.Token<
    typeof openAiChannel,
    ["status"]
>;

export async function fetchOpenAiNodeRealtimeToken(): Promise<OpenAiNodeToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: openAiChannel(),
        topics: ["status"],
    });

    return token;
}
