import postgres, { type Sql } from "postgres";
import type { Attendance, Rsvp } from "./schema";
import { DuplicateNameError, nameKey, toGuestCount, type RsvpStore } from "./store";

type Row = {
  id: string;
  full_name: string;
  attendance: Attendance;
  guests: string[];
  message: string;
  created_at: Date;
  updated_at: Date;
};

const globalForSql = globalThis as unknown as { __weddingSql?: Sql; __weddingSchema?: Promise<void> };

function getSql(url: string): Sql {
  // Reuse one pool across hot reloads and serverless invocations.
  globalForSql.__weddingSql ??= postgres(url, { max: 5, prepare: false, idle_timeout: 20 });
  return globalForSql.__weddingSql;
}

function ensureSchema(sql: Sql): Promise<void> {
  globalForSql.__weddingSchema ??= sql`
    CREATE TABLE IF NOT EXISTS rsvps (
      id uuid PRIMARY KEY,
      name_key text UNIQUE NOT NULL,
      full_name text NOT NULL,
      guests jsonb NOT NULL DEFAULT '[]'::jsonb,
      message text NOT NULL DEFAULT '',
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    )
  `
    .then(
      () => sql`ALTER TABLE rsvps ADD COLUMN IF NOT EXISTS attendance text NOT NULL DEFAULT 'accept'`,
    )
    .then(() => undefined);
  return globalForSql.__weddingSchema;
}

function toRsvp(row: Row): Rsvp {
  return {
    id: row.id,
    fullName: row.full_name,
    attendance: row.attendance,
    guests: row.guests,
    message: row.message,
    guestCount: toGuestCount({ guests: row.guests, attendance: row.attendance }),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export function createPostgresStore(url: string): RsvpStore {
  const sql = getSql(url);

  return {
    async save(data) {
      await ensureSchema(sql);
      const [row] = await sql<(Row & { inserted: boolean })[]>`
        INSERT INTO rsvps (id, name_key, full_name, attendance, guests, message)
        VALUES (
          ${crypto.randomUUID()},
          ${nameKey(data.fullName)},
          ${data.fullName},
          ${data.attendance},
          ${sql.json(data.guests)},
          ${data.message}
        )
        ON CONFLICT (name_key) DO UPDATE SET
          full_name = EXCLUDED.full_name,
          attendance = EXCLUDED.attendance,
          guests = EXCLUDED.guests,
          message = EXCLUDED.message,
          updated_at = now()
        RETURNING *, (xmax = 0) AS inserted
      `;
      return { rsvp: toRsvp(row), updated: !row.inserted };
    },
    async list() {
      await ensureSchema(sql);
      const rows = await sql<Row[]>`SELECT * FROM rsvps ORDER BY updated_at DESC`;
      return rows.map(toRsvp);
    },
    async update(id, data) {
      await ensureSchema(sql);
      try {
        const [row] = await sql<Row[]>`
          UPDATE rsvps SET
            name_key = ${nameKey(data.fullName)},
            full_name = ${data.fullName},
            attendance = ${data.attendance},
            guests = ${sql.json(data.guests)},
            message = ${data.message},
            updated_at = now()
          WHERE id = ${id}
          RETURNING *
        `;
        return row ? toRsvp(row) : undefined;
      } catch (error) {
        if ((error as { code?: string }).code === "23505") throw new DuplicateNameError();
        throw error;
      }
    },
    async remove(id) {
      await ensureSchema(sql);
      const result = await sql`DELETE FROM rsvps WHERE id = ${id}`;
      return result.count > 0;
    },
  };
}
