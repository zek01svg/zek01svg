/**
 * Drizzle DB client for workers.
 * Re-exports db + schema so agents import from one place.
 */
export { db } from "../../db/index";
export * from "../../db/schema";

import { db } from "../../db/index";
import { agentStatus } from "../../db/schema";
import { eq } from "drizzle-orm";

export async function setAgentStatus(
  agent: string,
  status: "ok" | "error" | "running",
  errorMsg?: string,
): Promise<void> {
  await db
    .insert(agentStatus)
    .values({ agent, status, errorMsg: errorMsg ?? null, lastRun: new Date() })
    .onConflictDoUpdate({
      target: agentStatus.agent,
      set: { status, errorMsg: errorMsg ?? null, lastRun: new Date(), updatedAt: new Date() },
    });
}
