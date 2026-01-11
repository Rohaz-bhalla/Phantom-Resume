import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

// Prevents multiple connections during development hot-reloading
const globalForDb = globalThis as unknown as { conn: Pool | undefined }

// Helper to determine if we need SSL (Likely yes for Cloud DBs in production)
const isProduction = process.env.NODE_ENV === "production"

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  // Cloud DBs (Neon, Supabase) usually require SSL
  // We use rejectUnauthorized: false to allow self-signed certs if needed, 
  // but strictly strictly speaking true is safer if you have the CA. 
  // For most 'pnpm start' local cases, this fixes the timeout.
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
  connectionTimeoutMillis: 10000, // Wait 10s before timing out
}

const pool = globalForDb.conn ?? new Pool(poolConfig)

if (process.env.NODE_ENV !== "production") globalForDb.conn = pool

export const db = drizzle(pool, { schema })