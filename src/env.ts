import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
  clientPrefix: "VITE_",
  server: {
    STRAPI_URL: z.string().url(),
    STRAPI_API_TOKEN: z.string().min(1),
  },
  client: {
    VITE_SENTRY_DSN: z.string().url().optional(),
    VITE_SENTRY_ORG: z.string().optional(),
    VITE_SENTRY_PROJECT: z.string().optional(),
  },
  runtimeEnv: {
    STRAPI_URL: process.env.STRAPI_URL,
    STRAPI_API_TOKEN: process.env.STRAPI_API_TOKEN,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    VITE_SENTRY_ORG: import.meta.env.VITE_SENTRY_ORG,
    VITE_SENTRY_PROJECT: import.meta.env.VITE_SENTRY_PROJECT,
  },
  emptyStringAsUndefined: true,
});
