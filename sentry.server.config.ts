// Import with `import * as Sentry from "@sentry/nextjs"` if you are using ESM
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "https://50fe9041034112c66fbf80876a2f4a02@o4510690219524096.ingest.us.sentry.io/4510690223652864",
  integrations: [
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
    // Add the Vercel AI SDK integration to sentry.server.config.ts
    Sentry.vercelAIIntegration({

      recordInputs: true,
      recordOutputs: true,

    }),
  ],
  // Tracing must be enabled for agent monitoring to work
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
  enableLogs: true,

});