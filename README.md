# ALL IN BATTLE Landing

Next.js landing page for a hip-hop improvisation event in Krasnodar.

Current scope:
- responsive landing structure;
- participant lineup section;
- registration form;
- registration API;
- T-Bank payment init + webhook scaffold;
- database storage with production PostgreSQL support.

## Run locally

```powershell
& 'C:\Program Files\nodejs\npm.cmd' install
& 'C:\Program Files\nodejs\npm.cmd' run dev
```

## Database mode

- If `DATABASE_URL` is set, the app uses PostgreSQL (recommended for Vercel).
- If `DATABASE_URL` is empty, the app falls back to local file DB in `.data/`.
- The `registrations` table is created automatically on first request.

## Deploy to Vercel

1. Import the repository in [Vercel](https://vercel.com/new).
2. Keep framework as `Next.js`.
3. Add environment variables from `.env.example`.
4. Deploy.

## Supabase setup (recommended)

1. Create project at [Supabase](https://supabase.com/).
2. Open `Project Settings -> Database`.
3. Copy the connection string (URI format).
4. Put it into `DATABASE_URL` in Vercel env vars.
5. Redeploy.

You can use Neon in the same way: just provide its Postgres URI in `DATABASE_URL`.

## T-Bank setup checklist

Fill these env vars in Vercel:
- `TINKOFF_TERMINAL_KEY`
- `TINKOFF_PASSWORD`
- `EVENT_PRICE_RUB`
- `TINKOFF_SUCCESS_URL`
- `TINKOFF_FAIL_URL`
- `TINKOFF_NOTIFICATION_URL` (must point to `/api/payments/tbank/webhook`)

In T-Bank cabinet, set notification URL to:
- `https://<your-domain>/api/payments/tbank/webhook`

## Useful routes

- `POST /api/registrations`
- `POST /api/payments/tbank/init`
- `POST /api/payments/tbank/webhook`
