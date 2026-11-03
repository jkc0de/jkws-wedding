// Verifies DATABASE_URL connects, creates the rsvps table if needed, and
// prints the current response count. Run with: npm run db:check
import { readFileSync } from "node:fs";
import postgres from "postgres";

// Load .env / .env.local without extra dependencies.
for (const file of [".env", ".env.local"]) {
  try {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
}

const url = process.env.DATABASE_URL?.trim();
if (!url) fail("DATABASE_URL is not set. Add it to .env or .env.local.");
if (/\/\/user:[^@]*@host[:/]/.test(url)) fail("DATABASE_URL is still the example placeholder. Paste your real Neon connection string.");

const host = new URL(url.replace(/^postgres(ql)?:/, "http:")).hostname;
console.log(`Connecting to ${host} ...`);

const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 15 });
try {
  const [{ version }] = await sql`SELECT version()`;
  console.log(`Connected: ${version.split(",")[0]}`);
  await sql`
    CREATE TABLE IF NOT EXISTS rsvps (
      id uuid PRIMARY KEY,
      name_key text UNIQUE NOT NULL,
      full_name text NOT NULL,
      guests jsonb NOT NULL DEFAULT '[]'::jsonb,
      message text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
  await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS attendance text NOT NULL DEFAULT 'accept'`;
  await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS dietary text NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS side text NOT NULL DEFAULT 'bride'`;
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM rsvps`;
  console.log(`rsvps table ready. Responses so far: ${count}`);
  console.log("All good. RSVPs will be stored in this database.");
} catch (error) {
  fail(`Could not use the database: ${error.message}`);
} finally {
  await sql.end({ timeout: 2 });
}

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}
