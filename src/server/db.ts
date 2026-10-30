import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "#server/env.ts";

export const db = drizzle({ client: postgres(env.databaseUrl), casing: "snake_case" });
