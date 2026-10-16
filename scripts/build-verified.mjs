import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const vinextCli = fileURLToPath(new URL("../node_modules/vinext/dist/cli.js", import.meta.url));
const result = spawnSync(process.execPath, [vinextCli, "build"], {
  stdio: "inherit",
  env: process.env,
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

await import("./validate-artifact.mjs");
