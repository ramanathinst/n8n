"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { geminiChannel } from "@/inngest/channels/gemini";

export type GeminiNodeToken = Realtime.Token<
    typeof geminiChannel,
    ["status"]
>;

export async function fetchGeminiNodeRealtimeToken(): Promise<GeminiNodeToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: geminiChannel(),
        topics: ["status"],
    });

    return token;
}
