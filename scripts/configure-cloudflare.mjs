import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const configUrl = new URL("../wrangler.json", import.meta.url);
const config = JSON.parse(await readFile(configUrl, "utf8"));
const database = config.d1_databases?.find((binding) => binding.binding === "DB");
if (!database) throw new Error("wrangler.json is missing the DB binding.");

const terminal = createInterface({ input, output });

try {
  const databaseId = (await terminal.question("D1 database ID: ")).trim();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(databaseId))
    throw new Error("The D1 database ID must be the UUID shown by `npx wrangler d1 create`.");

  const teamInput = (await terminal.question("Cloudflare Access team name or full team domain: ")).trim();
  const teamDomain = normalizeTeamDomain(teamInput);

  const accessAudience = (await terminal.question("Cloudflare Access application audience tag (AUD): ")).trim();
  if (!/^[A-Za-z0-9_-]{16,}$/.test(accessAudience))
    throw new Error("The Access audience tag looks incomplete. Copy the full AUD value from Cloudflare Zero Trust.");

  database.database_id = databaseId;
  config.vars.CLOUDFLARE_ACCESS_TEAM_DOMAIN = teamDomain;
  config.vars.CLOUDFLARE_ACCESS_AUD = accessAudience;
  await writeFile(configUrl, `${JSON.stringify(config, null, 2)}\n`);
  output.write("Updated wrangler.json. You can now apply the D1 migrations and deploy.\n");
} finally {
  terminal.close();
}

function normalizeTeamDomain(value) {
  const candidate = value.startsWith("http") ? value : `https://${value}.cloudflareaccess.com`;
  const url = new URL(candidate);
  if (url.protocol !== "https:" || !url.hostname.endsWith(".cloudflareaccess.com"))
    throw new Error("Use the team name or the https://<team>.cloudflareaccess.com domain shown by Cloudflare Access.");
  return url.origin;
}
