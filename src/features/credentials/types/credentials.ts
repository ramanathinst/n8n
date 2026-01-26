import { CredentialsType } from "@/generated/prisma/enums";

export const credentialsLogoOptions: Record<CredentialsType, string> = {
    [CredentialsType.OPENAI]: "/logos/openai.svg",
    [CredentialsType.GEMINI]: "/logos/gemini.svg",
    [CredentialsType.ANTHROPIC]: "/logos/anthropic.svg",
}

