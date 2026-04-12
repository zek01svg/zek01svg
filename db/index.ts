import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Supabase connection pooler (Transaction mode) — safe for Cloud Run's ephemeral instances
const connectionString = process.env.DATABASE_URL!;

// For Cloud Run Jobs / workers: use a short-lived client
const queryClient = postgres(connectionString, {
  max: 5,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(queryClient, { schema });
export type DB = typeof db;

// Re-export schema for convenience
export * from "./schema";
