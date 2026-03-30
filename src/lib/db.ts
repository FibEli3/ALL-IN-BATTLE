import { PGlite } from "@electric-sql/pglite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

type RegistrationInput = {
  fullName: string;
  phone: string;
  email: string;
  city?: string | null;
  danceExperience?: string | null;
  participationType: "participant" | "spectator";
  comment?: string | null;
};

type RegistrationRecord = {
  id: string;
  paymentStatus: string;
  createdAt: string;
};

const dataDir = join(process.cwd(), ".data");
mkdirSync(dataDir, { recursive: true });

const db = new PGlite(join(dataDir, "all-in-battle-db"));
let initialized: Promise<unknown> | null = null;

async function ensureSchema() {
  if (!initialized) {
    initialized = db.exec(`
      CREATE TABLE IF NOT EXISTS registrations (
        id TEXT PRIMARY KEY,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        city TEXT,
        dance_experience TEXT,
        participation_type TEXT NOT NULL,
        comment TEXT,
        payment_status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
  }

  await initialized;
}

export async function createRegistration(
  input: RegistrationInput,
): Promise<RegistrationRecord> {
  await ensureSchema();
  const id = crypto.randomUUID();

  const result = await db.query<RegistrationRecord>(
    `INSERT INTO registrations (
      id, full_name, phone, email, city, dance_experience, participation_type, comment
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id, payment_status as "paymentStatus", created_at as "createdAt";`,
    [
      id,
      input.fullName,
      input.phone,
      input.email,
      input.city ?? null,
      input.danceExperience ?? null,
      input.participationType,
      input.comment ?? null,
    ],
  );

  return result.rows[0];
}
