# VISION HUB

Next.js 16 rebuild of the SEED × TOPCON Healthcare VISION HUB booking platform for the Puchong clinic.

## Stack

- **Next.js 16** App Router (Node 24 / Fluid Compute on Vercel)
- **Tailwind CSS v3.4** + hand-rolled shadcn/ui primitives
- **Supabase Postgres** + **Drizzle ORM**
- **Clerk** for admin auth (role = `admin`)
- **next-intl** — English + Bahasa Malaysia, 165 translation keys ported verbatim from the Zite export
- **Framer Motion** for subtle section motion

## Routes

Public (`/[locale]/...`, locale prefix is `as-needed`):

| Route | Purpose |
|---|---|
| `/` | Redesigned homepage (hero, pillars, services, keratoconus, contact, FAQ, CTA) |
| `/booking` | 3-step booking wizard (slot → details → PDPA consent) |
| `/status` | Appointment lookup by code + last-4 of phone (PII-safer than the original) |
| `/cancel` | Redirects to `/status` |

Admin (Clerk-gated, requires `role = admin` claim):

| Route | Purpose |
|---|---|
| `/admin` | KPI cards + today's schedule |
| `/admin/appointments` | Table: filter, search, reschedule, assign, delete |
| `/admin/blocked-dates` | Holiday / private-event calendar |
| `/admin/optometrists` | Team CRUD (activate/deactivate) |

## Getting started

```bash
npm install
cp .env.example .env.local          # fill in Supabase + Clerk from Vercel env
npm run db:generate                  # drizzle migrations from schema
npm run db:migrate                   # push to Supabase
npm run db:seed                      # seed services + time slots
npm run dev                          # http://localhost:3000
```

### Granting admin

Either:

1. In Clerk dashboard, open the user → **Public metadata** → add `{"role":"admin"}`.
2. Or use Clerk Organizations: invite user to an org with the `admin` role.

The middleware in `middleware.ts` checks both paths.

## Deployment (Vercel)

1. Import the repo into Vercel.
2. Install the **Supabase** and **Clerk** integrations from the Marketplace — they auto-provision the env vars above.
3. Vercel reads `vercel.ts` for build + headers.

## Project layout

```
app/
  [locale]/
    (marketing)/    home, booking, status, cancel
    admin/          overview, appointments, blocked-dates, optometrists
    sign-in, sign-up
  actions/          server actions (public + admin, split)
components/         brand/, home/, site/, ui/ (shadcn)
db/                 schema.ts, client.ts, seed.ts, migrations/
lib/                clinic.ts, i18n/, schemas.ts, slots.ts, utils.ts
messages/           en.json, ms.json  (165 keys each)
middleware.ts       Clerk + next-intl combined
```

## Migration notes

- `blocked_dates` is now a real table — no more `status='blocked_date', fullName='ADMIN_BLOCK'` hack.
- Status lookup now requires `appointment_code` **and** last-4 phone. The original leaked any appointment given a phone.
- Sponsored reason is a proper column, not string-prefixed onto `additionalNotes`.
- WhatsApp remains `wa.me` click-to-chat — no API, as confirmed.
- Auto-refresh on admin appointments is on-demand (Refresh button + Supabase realtime can be layered later).
- `_source/` (the original Zite export, unpacked for reference) is gitignored.
