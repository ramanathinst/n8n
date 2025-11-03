import prisma from "@/lib/db";
import { inngest } from "./client";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
const google = createGoogleGenerativeAI({})

export const execute = inngest.createFunction(
  { id: "ai-execute" },
  { event: "ai/execute" },

  async ({ event, step }) => {
    const { steps }= await step.ai.wrap("Gemini-generative-text",generateText,{
      model: google("gemini-2.5-flash"),
      system: "you are helpful assistent",
      prompt: "how to learn machine learning?"
    })
    return steps;
  },
);