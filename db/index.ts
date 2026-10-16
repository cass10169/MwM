import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { runtimeBindings } from "../lib/runtime-env";

export function getDb() {
  const bindings = runtimeBindings();
  if (!bindings.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Confirm that wrangler.json contains a d1_databases entry with binding `DB`.",
    );
  }

  return drizzle(bindings.DB, { schema });
}
