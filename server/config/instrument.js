import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Ensure to call this before requiring any other modules!
Sentry.init({
  dsn: "https://57108e6382ee039f56d9005da0a8c490@o4509389745094656.ingest.us.sentry.io/4509395036340224",
  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration(),
    Sentry.httpIntegration(),
    Sentry.expressIntegration(),
  ],
  // tracesSampleRate: 1.0, // Capture 100% of transactions for tracing
  // profilesSampleRate: 1.0, // Profile 100% of sampled transactions
  // sendDefaultPii: true, // Send default PII like request headers and IP (consider privacy implications)
  // debug: true, // Set to true for debugging Sentry itself (turn off in production)
});
Sentry.profiler.startProfiler();
