# ALL IN BATTLE Landing

Next.js landing page for a hip-hop improvisation event in Krasnodar.

Current scope:
- responsive landing;
- lineup and program sections;
- registration form;
- manual payment flow (bank transfer + receipt upload);
- admin dashboard and CSV export;
- database storage with PostgreSQL (Vercel) or local fallback.

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

1. Import repository in [Vercel](https://vercel.com/new).
2. Keep framework as `Next.js`.
3. Add env vars from `.env.example`.
4. Deploy.

## Payment flow (manual)

1. User fills the registration form and selects options.
2. User clicks `Перейти к оплате`.
3. User is redirected to `/payment/manual`.
4. User transfers money to provided bank details.
5. User uploads receipt file (phone/PC).
6. Button `Отправить` becomes active only after file is attached.
7. Registration with selected options + receipt is saved to DB.

## Useful routes

- `POST /api/registrations/manual`
- `GET /api/admin/registrations?token=<ADMIN_DASHBOARD_TOKEN>&status=paid`
- `GET /api/admin/registrations/export?token=<ADMIN_DASHBOARD_TOKEN>`
- `GET /admin/registrations?token=<ADMIN_DASHBOARD_TOKEN>`

