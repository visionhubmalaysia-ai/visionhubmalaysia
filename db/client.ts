import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.POSTGRES_URL ??
  process.env.SUPABASE_DATABASE_URL ??
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing database URL. Set POSTGRES_URL (auto-provisioned by Vercel + Supabase Marketplace) or SUPABASE_DATABASE_URL.",
  );
}

const client = postgres(connectionString, { prepare: false, max: 10 });
export const db = drizzle(client, { schema });
export { schema };
