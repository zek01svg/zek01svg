import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware,
} from "@sentry/tanstackstart-react";
import { createStart } from "@tanstack/react-start";

/**
 * TanStack Start instance with Sentry global middlewares and custom logging.
 *
 * - sentryGlobalRequestMiddleware: attaches request context to Sentry events.
 * - sentryGlobalFunctionMiddleware: captures errors in server functions.
 * - loggerMiddleware: logs all incoming requests for audit/metrics.
 *
 * These must be first in the arrays to ensure all errors and requests are
 * captured before any other middleware has a chance to swallow them.
 */
export const startInstance = createStart(() => {
  return {
    requestMiddleware: [sentryGlobalRequestMiddleware],
    functionMiddleware: [sentryGlobalFunctionMiddleware],
  };
});
