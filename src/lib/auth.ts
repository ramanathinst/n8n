import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { polarClient } from "./polar";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!, 
            clientSecret: process.env.GITHUB_CLIENT_SECRET!, 
        }
    },
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "7efbc8f1-e42c-4d87-85a6-1a32b93d0159",
                            slug: "n8n" // Custom slug for easy reference in Checkout URL, e.g. /checkout/Pro
                        }
                    ],
                    successUrl: process.env.POLAR_SUCCESS_URL,
                    authenticatedUsersOnly: true
                }),
                portal(),
            ],
        })
    ]
});