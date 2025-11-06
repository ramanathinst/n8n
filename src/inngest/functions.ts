import prisma from "@/lib/db";
import { inngest } from "./client";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
const google = createGoogleGenerativeAI({})
import * as Sentry from "@sentry/nextjs";

export const execute = inngest.createFunction(
  { id: "ai-execute" },
  { event: "ai/execute" },

  async ({ event, step }) => {

    Sentry.logger.info("User trigger test log", { log_source: "sentry_test"})
    
    const { steps }= await step.ai.wrap("Gemini-generative-text",generateText,{
      model: google("gemini-2.5-flash"),
      system: "you are helpful assistent",
      prompt: "what is 5+8?",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    })
    return steps;
  },
);