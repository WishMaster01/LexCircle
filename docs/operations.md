# Operations Guide

This document contains the practical setup, environment, migration, and deployment notes for LexCircle.

## Environment Variables

Copy `.env.example` to `.env` and fill in the values for your environment.

### Database

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Pooled PostgreSQL / Neon connection used by the app runtime |
| `DIRECT_URL` | Direct PostgreSQL connection used by Prisma migrations |

### Authentication

| Variable | Purpose |
| --- | --- |
| `AUTH_SECRET` | Auth.js session and token signing secret |
| `NEXTAUTH_URL` | Base URL used by Auth.js |
| `GOOGLE_CLIENT_ID` | Optional Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional Google OAuth client secret |

### Admin credentials

| Variable | Purpose |
| --- | --- |
| `ADMIN_NAME` | Display name for the environment admin user |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |

### Email delivery

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Enables Resend delivery path |
| `CONTACT_FROM_EMAIL` | Sender used by the application |
| `CONTACT_TO_EMAIL` | Admin inbox that receives full contact submissions |
| `SMTP_HOST` | SMTP host when not using Resend |
| `SMTP_PORT` | SMTP port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_SECURE` | `true` or `false` for SMTP transport security |

### Media and app URL

| Variable | Purpose |
| --- | --- |
| `CLOUDINARY_CLOUD_NAME` | Reserved for future media pipeline work |
| `CLOUDINARY_API_KEY` | Reserved for future media pipeline work |
| `CLOUDINARY_API_SECRET` | Reserved for future media pipeline work |
| `NEXT_PUBLIC_APP_URL` | Public application URL |

## Local Development

### Install dependencies

```bash
npm install
```

### Generate Prisma client

```bash
npm run db:generate
```

### Run development migration

```bash
npm run db:migrate
```

### Seed the database

```bash
npm run db:seed
```

### Start the dev server

```bash
npm run dev
```

## Production Migration

Use Prisma deploy migrations in production, not development migrations.

### Check migration status

```bash
npx prisma migrate status
```

### Apply production migrations

```bash
npx prisma migrate deploy
```

Package-script equivalent:

```bash
npm run db:deploy
```

## Contact Email Behavior

LexCircle is configured for dual delivery:

1. the admin inbox receives the full contact submission
2. the submitting user receives a confirmation email

### Resend mode

If these are configured:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

then both emails are sent through Resend.

### SMTP mode

If Resend is not configured, but the following are present:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

then both emails are sent through SMTP.

### Fallback mode

If no provider is configured:

- contact submission still succeeds
- persistence still works when PostgreSQL is configured
- no real email is delivered

## Authentication and Access Control

- regular users sign in through `/login`
- admin users can sign in through `/login` or `/admin/login`
- only admin sessions can access `/admin`
- only admin sessions see the admin dashboard shortcut from profile

Session data includes:

- `id`
- `username`
- `role`
- `isSuspended`
- `isPortalAdmin`

## Operational Notes

### Demo fallback behavior

Some public services can fall back to demo data when database configuration is missing or a non-critical public query fails. Production deployments should still use a working database and migrated schema.

### Prisma deprecation warning

Prisma currently warns that `package.json#prisma` is deprecated and will be removed in Prisma 7. The project still works, but it should eventually move to `prisma.config.ts`.

### Windows Prisma note

If `prisma generate` fails on Windows with `EPERM`, a running `next dev` or Node process may be locking Prisma engine files. Stop the dev server and retry.

### Current lint warning

There is one pre-existing React Hook Form compiler warning in the editor because of `form.watch(...)`. It is non-blocking.

## Security Checklist

Before production launch, verify:

- authorization coverage on sensitive mutations
- upload ownership enforcement
- rate limiting strategy for public APIs
- secret handling and logging policy
- production database migration state

