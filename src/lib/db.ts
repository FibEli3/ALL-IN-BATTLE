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
  receiptFileName?: string | null;
  receiptFileMimeType?: string | null;
  receiptFileBase64?: string | null;
  receiptFileBytes?: Uint8Array | null;
};

type RegistrationRecord = {
  id: string;
  createdAt: string;
  amountRub: number;
};

type RegistrationReceiptRecord = {
  id: string;
  receiptFileName: string | null;
  receiptFileMimeType: string | null;
  receiptFileBase64: string | null;
  receiptFileBytes: Uint8Array | null;
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
  paymentOrderId: string | null;
  paymentId: string | null;
  receiptFileName: string | null;
  receiptFileMimeType: string | null;
  hasReceipt: boolean;
  amountRub: number;
  createdAt: string;
};

type DbClient = {
  query<T>(query: string, params?: unknown[]): Promise<{ rows: T[] }>;
  exec(query: string): Promise<void>;
};

function createClient(): DbClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl?.match(/^postgres(?:ql)?:\/\//i)) {
    const sql = postgres(databaseUrl, {
      prepare: false,
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });

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

  if (process.env.VERCEL) {
    throw new Error(
      "DATABASE_URL must be a PostgreSQL connection string in Vercel",
    );
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

let db: DbClient | null = null;
let initialized: Promise<void> | null = null;

function getDb() {
  if (!db) {
    db = createClient();
  }

  return db;
}

async function ensureSchema() {
  if (!initialized) {
    initialized = (async () => {
      const client = getDb();

      await client.exec(`
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
          payment_order_id TEXT,
          payment_id TEXT,
          receipt_file_name TEXT,
          receipt_file_mime_type TEXT,
          receipt_file_base64 TEXT,
          receipt_file_bytes BYTEA,
          amount_rub INTEGER,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      await client.exec(`
        ALTER TABLE registrations
          ADD COLUMN IF NOT EXISTS nickname TEXT,
          ADD COLUMN IF NOT EXISTS selected_option_ids TEXT,
          ADD COLUMN IF NOT EXISTS age TEXT,
          ADD COLUMN IF NOT EXISTS amount_rub INTEGER,
          ADD COLUMN IF NOT EXISTS receipt_file_name TEXT,
          ADD COLUMN IF NOT EXISTS receipt_file_mime_type TEXT,
          ADD COLUMN IF NOT EXISTS receipt_file_base64 TEXT,
          ADD COLUMN IF NOT EXISTS receipt_file_bytes BYTEA;
      `);

      await client.exec(`
        CREATE INDEX IF NOT EXISTS registrations_created_at_idx
        ON registrations (created_at DESC);
      `);
    })();
  }

  await initialized;
}

export async function prepareDatabase() {
  await ensureSchema();
}

export async function createRegistration(
  input: RegistrationInput,
): Promise<RegistrationRecord> {
  await ensureSchema();
  const id = crypto.randomUUID();
  const client = getDb();

  const result = await client.query<RegistrationRecord>(
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
      receipt_file_name,
      receipt_file_mime_type,
      receipt_file_base64,
      receipt_file_bytes,
      amount_rub
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    RETURNING
      id,
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
      input.receiptFileName ?? null,
      input.receiptFileMimeType ?? null,
      input.receiptFileBase64 ?? null,
      input.receiptFileBytes ?? null,
      input.amountRub,
    ],
  );

  return result.rows[0];
}

export async function listRegistrations(): Promise<RegistrationAdminRecord[]> {
  await ensureSchema();
  const client = getDb();

  const result = await client.query<RegistrationAdminRecord>(
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
      payment_order_id as "paymentOrderId",
      payment_id as "paymentId",
      receipt_file_name as "receiptFileName",
      receipt_file_mime_type as "receiptFileMimeType",
      (
        (receipt_file_bytes IS NOT NULL AND octet_length(receipt_file_bytes) > 0)
        OR (receipt_file_base64 IS NOT NULL AND receipt_file_base64 <> '')
      ) as "hasReceipt",
      COALESCE(amount_rub, 0) as "amountRub",
      created_at as "createdAt"
    FROM registrations
    ORDER BY created_at DESC;`,
  );

  return result.rows;
}

export async function getRegistrationReceiptById(
  id: string,
): Promise<RegistrationReceiptRecord | null> {
  await ensureSchema();
  const client = getDb();

  const result = await client.query<RegistrationReceiptRecord>(
    `SELECT
      id,
      receipt_file_name as "receiptFileName",
      receipt_file_mime_type as "receiptFileMimeType",
      receipt_file_base64 as "receiptFileBase64",
      receipt_file_bytes as "receiptFileBytes"
    FROM registrations
    WHERE id = $1
    LIMIT 1;`,
    [id],
  );

  return result.rows[0] ?? null;
}
