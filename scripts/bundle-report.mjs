import { readdir, stat } from "node:fs/promises";
import { join, relative } from "node:path";
const root = new URL("../dist/client/", import.meta.url).pathname;
const files = [];
async function walk(directory) {
  for (const name of await readdir(directory)) {
    const path = join(directory, name);
    const details = await stat(path);
    if (details.isDirectory()) await walk(path);
    else files.push({ path: relative(root, path), bytes: details.size });
  }
}
try {
  await walk(root);
  files.sort((left, right) => right.bytes - left.bytes);
  console.log("Largest client assets:");
  for (const file of files.slice(0, 30)) console.log(`${(file.bytes / 1024).toFixed(1).padStart(8)} KiB  ${file.path}`);
  console.log(
    `Total client assets: ${(files.reduce((sum, file) => sum + file.bytes, 0) / 1024 / 1024).toFixed(2)} MiB`,
  );
} catch {
  console.error("Build the project first with npm run build.");
  process.exit(1);
}
