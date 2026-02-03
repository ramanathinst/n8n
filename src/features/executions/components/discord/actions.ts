"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { discordChannel } from "@/inngest/channels/discord";

export type DiscordNodeToken = Realtime.Token<
    typeof discordChannel,
    ["status"]
>;

export async function fetchDiscordNodeRealtimeToken(): Promise<DiscordNodeToken> {
    const token = await getSubscriptionToken(inngest, {
        channel: discordChannel(),
        topics: ["status"],
    });

    return token;
}
