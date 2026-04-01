import { PGlite } from "@electric-sql/pglite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

type RegistrationInput = {
  fullName: string;
  nickname: string;
  age?: string | null;
  phone: string;
  email?: string | null;
  city?: string | null;
  danceExperience?: string | null;
  participationType: "participant" | "spectator";
  comment?: string | null;
  selectedOptionIds: string[];
  amountRub: number;
  paymentStatus?: "pending" | "paid";
  receiptFileName?: string | null;
  receiptFileMimeType?: string | null;
  receiptFileBase64?: string | null;
};

type RegistrationRecord = {
  id: string;
  paymentStatus: string;
  createdAt: string;
  amountRub: number;
};

export type RegistrationAdminRecord = {
  id: string;
  fullName: string;
  nickname: string | null;
  age: string | null;
  phone: string;
  email: string | null;
  city: string | null;
  danceExperience: string | null;
  participationType: string;
  comment: string | null;
  selectedOptionIds: string | null;
  paymentStatus: string;
  paymentOrderId: string | null;
  paymentId: string | null;
  receiptFileName: string | null;
  receiptFileMimeType: string | null;
  receiptFileBase64: string | null;
  amountRub: number;
  createdAt: string;
};

type DbClient = {
  query<T>(query: string, params?: unknown[]): Promise<{ rows: T[] }>;
  exec(query: string): Promise<void>;
};

function createClient(): DbClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    const sql = postgres(databaseUrl, { prepare: false });

    return {
      async query<T>(query: string, params: unknown[] = []) {
        const rows = (await sql.unsafe(query, params as never[])) as T[];
        return { rows };
      },
      async exec(query: string) {
        await sql.unsafe(query);
      },
    };
  }

  const dataDir = join(process.cwd(), ".data");
  mkdirSync(dataDir, { recursive: true });
  const localDb = new PGlite(join(dataDir, "all-in-battle-db"));

  return {
    async query<T>(query: string, params: unknown[] = []) {
      return localDb.query<T>(query, params);
    },
    async exec(query: string) {
      await localDb.exec(query);
    },
  };
}

const db = createClient();
let initialized: Promise<void> | null = null;

async function ensureSchema() {
  if (!initialized) {
    initialized = (async () => {
      await db.exec(`
        CREATE TABLE IF NOT EXISTS registrations (
          id TEXT PRIMARY KEY,
          full_name TEXT NOT NULL,
          nickname TEXT,
          age TEXT,
          phone TEXT NOT NULL,
          email TEXT,
          city TEXT,
          dance_experience TEXT,
          participation_type TEXT NOT NULL,
          comment TEXT,
          selected_option_ids TEXT,
          payment_status TEXT NOT NULL DEFAULT 'pending',
          payment_order_id TEXT,
          payment_id TEXT,
          receipt_file_name TEXT,
          receipt_file_mime_type TEXT,
          receipt_file_base64 TEXT,
          amount_rub INTEGER,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      await db.exec(`
        ALTER TABLE registrations
        ADD COLUMN IF NOT EXISTS nickname TEXT;
      `);
      await db.exec(`
        ALTER TABLE registrations
        ADD COLUMN IF NOT EXISTS selected_option_ids TEXT;
      `);
      await db.exec(`
        ALTER TABLE registrations
        ADD COLUMN IF NOT EXISTS age TEXT;
      `);
      await db.exec(`
        ALTER TABLE registrations
        ADD COLUMN IF NOT EXISTS amount_rub INTEGER;
      `);
      await db.exec(`
        ALTER TABLE registrations
        ADD COLUMN IF NOT EXISTS receipt_file_name TEXT;
      `);
      await db.exec(`
        ALTER TABLE registrations
        ADD COLUMN IF NOT EXISTS receipt_file_mime_type TEXT;
      `);
      await db.exec(`
        ALTER TABLE registrations
        ADD COLUMN IF NOT EXISTS receipt_file_base64 TEXT;
      `);
    })();
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
      id,
      full_name,
      nickname,
      age,
      phone,
      email,
      city,
      dance_experience,
      participation_type,
      comment,
      selected_option_ids,
      payment_status,
      receipt_file_name,
      receipt_file_mime_type,
      receipt_file_base64,
      amount_rub
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING
      id,
      payment_status as "paymentStatus",
      created_at as "createdAt",
      amount_rub as "amountRub";`,
    [
      id,
      input.fullName,
      input.nickname,
      input.age ?? null,
      input.phone,
      input.email ?? null,
      input.city ?? null,
      input.danceExperience ?? null,
      input.participationType,
      input.comment ?? null,
      JSON.stringify(input.selectedOptionIds),
      input.paymentStatus ?? "pending",
      input.receiptFileName ?? null,
      input.receiptFileMimeType ?? null,
      input.receiptFileBase64 ?? null,
      input.amountRub,
    ],
  );

  return result.rows[0];
}

export async function listRegistrations(
  paymentStatus?: "pending" | "paid",
): Promise<RegistrationAdminRecord[]> {
  await ensureSchema();

  if (paymentStatus) {
    const result = await db.query<RegistrationAdminRecord>(
      `SELECT
        id,
        full_name as "fullName",
        nickname,
        age,
        phone,
        email,
        city,
        dance_experience as "danceExperience",
        participation_type as "participationType",
        comment,
        selected_option_ids as "selectedOptionIds",
        payment_status as "paymentStatus",
        payment_order_id as "paymentOrderId",
        payment_id as "paymentId",
        receipt_file_name as "receiptFileName",
        receipt_file_mime_type as "receiptFileMimeType",
        receipt_file_base64 as "receiptFileBase64",
        COALESCE(amount_rub, 0) as "amountRub",
        created_at as "createdAt"
      FROM registrations
      WHERE payment_status = $1
      ORDER BY created_at DESC;`,
      [paymentStatus],
    );

    return result.rows;
  }

  const result = await db.query<RegistrationAdminRecord>(
    `SELECT
      id,
      full_name as "fullName",
      nickname,
      age,
      phone,
      email,
      city,
      dance_experience as "danceExperience",
      participation_type as "participationType",
      comment,
      selected_option_ids as "selectedOptionIds",
      payment_status as "paymentStatus",
      payment_order_id as "paymentOrderId",
      payment_id as "paymentId",
      receipt_file_name as "receiptFileName",
      receipt_file_mime_type as "receiptFileMimeType",
      receipt_file_base64 as "receiptFileBase64",
      COALESCE(amount_rub, 0) as "amountRub",
      created_at as "createdAt"
    FROM registrations
    ORDER BY created_at DESC;`,
  );

  return result.rows;
}
