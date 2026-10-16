import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workerPath = path.join(projectRoot, "dist/server/index.js");
const configPath = path.join(projectRoot, "wrangler.json");

await Promise.all([access(workerPath, constants.R_OK), access(configPath, constants.R_OK)]);
const config = JSON.parse(await readFile(configPath, "utf8"));

if (config.main !== "./worker/index.ts")
  throw new Error("wrangler.json must use ./worker/index.ts as its source entry.");
for (const binding of ["DB", "BUCKET"]) {
  const configured = [...(config.d1_databases ?? []), ...(config.r2_buckets ?? [])].some(
    (entry) => entry.binding === binding,
  );
  if (!configured) throw new Error(`wrangler.json is missing the ${binding} binding.`);
}
if (config.images?.binding !== "IMAGES") throw new Error("wrangler.json is missing the IMAGES binding.");
if (config.assets?.binding !== "ASSETS") throw new Error("wrangler.json is missing the ASSETS binding.");

const workerUrl = pathToFileURL(workerPath);
workerUrl.searchParams.set("cloudflare-validation", `${process.pid}-${Date.now()}`);
const worker = await import(workerUrl.href);
if (!worker.default || typeof worker.default.fetch !== "function")
  throw new Error("dist/server/index.js must export a default Worker with fetch(request, env, ctx).");

console.log("Validated Cloudflare artifact: Worker default.fetch and all required bindings are present.");
