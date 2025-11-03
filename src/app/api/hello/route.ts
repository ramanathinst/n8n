import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";
import { email } from "zod";

export async function GET() {
    await inngest.send({
        name: "test/hello.world",
        data: {
            email: "demo@gamil.com"
        }
    })

    return NextResponse.json({message: "Inngest event sent! Ramanath"})
}