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
  amountRub: number;
  createdAt: string;
};

type RegistrationForPayment = {
  id: string;
  fullName: string;
  nickname: string;
  email: string | null;
  phone: string;
  amountRub: number;
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
      amount_rub
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
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
      input.amountRub,
    ],
  );

  return result.rows[0];
}

export async function getRegistrationById(
  id: string,
): Promise<RegistrationForPayment | null> {
  await ensureSchema();

  const result = await db.query<RegistrationForPayment>(
    `SELECT
      id,
      full_name as "fullName",
      nickname,
      email,
      phone,
      COALESCE(amount_rub, 0) as "amountRub"
    FROM registrations
    WHERE id = $1
    LIMIT 1;`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function attachPaymentToRegistration(params: {
  registrationId: string;
  orderId: string;
  paymentId: string;
}) {
  await ensureSchema();

  await db.query(
    `UPDATE registrations
    SET
      payment_status = 'created',
      payment_order_id = $2,
      payment_id = $3
    WHERE id = $1;`,
    [params.registrationId, params.orderId, params.paymentId],
  );
}

export async function setRegistrationPaidByOrderId(orderId: string) {
  await ensureSchema();

  await db.query(
    `UPDATE registrations
    SET payment_status = 'paid'
    WHERE payment_order_id = $1;`,
    [orderId],
  );
}

export async function listRegistrations(
  paymentStatus?: "pending" | "created" | "paid",
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
      COALESCE(amount_rub, 0) as "amountRub",
      created_at as "createdAt"
    FROM registrations
    ORDER BY created_at DESC;`,
  );

  return result.rows;
}
