# ALL IN BATTLE Landing

Next.js landing page for a hip-hop improvisation event in Krasnodar.

Current scope:
- responsive landing structure;
- participant lineup section;
- registration form;
- registration API;
- Robokassa payment init + webhook scaffold;
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

## Robokassa setup checklist

Fill these env vars in Vercel:
- `ROBOKASSA_MERCHANT_LOGIN`
- `ROBOKASSA_PASSWORD_1`
- `ROBOKASSA_PASSWORD_2`
- `ROBOKASSA_SUCCESS_URL`
- `ROBOKASSA_FAIL_URL`
- `ROBOKASSA_RESULT_URL` (must point to `/api/payments/robokassa/webhook`)
- `ROBOKASSA_IS_TEST` (`true` for tests, `false` for production)

Prices are calculated from selected checkboxes in:
- `src/lib/event-options.ts`

Pricing rules in code:
- Day 1 fixed: `2900`, `900`, `600`, `700`.
- Day 2 categories: first selected category `1700`, each next `800`.
- Spectator ticket always `700`.

In Robokassa cabinet, set result URL to:
- `https://<your-domain>/api/payments/robokassa/webhook`

## Useful routes

- `POST /api/registrations`
- `POST /api/payments/robokassa/init`
- `POST /api/payments/robokassa/webhook`

