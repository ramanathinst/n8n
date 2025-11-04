
// Import with `import * as Sentry from "@sentry/nextjs"` if you are using ESM
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://d3289447e3c8107639d839985dbc82e5@o4510254155497472.ingest.us.sentry.io/4510302213111808",
  integrations: [
    // Add the Vercel AI SDK integration to sentry.server.config.ts
    Sentry.vercelAIIntegration({
      recordInputs: true,
      recordOutputs: true,
    }),
  ],
  // Tracing must be enabled for agent monitoring to work
  tracesSampleRate: 1.0,
  sendDefaultPii: true,
    // Enable logs to be sent to Sentry
  enableLogs: true,
});
