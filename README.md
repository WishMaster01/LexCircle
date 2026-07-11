# InkSphere

InkSphere is a multi-user article and blogging platform built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and Auth.js.

## Stack

- Next.js 16 with App Router
- TypeScript strict mode
- Tailwind CSS 4
- Prisma ORM with PostgreSQL / Neon
- Auth.js (`next-auth`) with credentials + Google OAuth hooks
- Zod validation
- React Hook Form
- Recharts, Sonner, Lucide

## Features

- Premium landing page, public community feed, article detail pages, author profiles
- Dashboard pages for articles, analytics, bookmarks, history, profile, and settings
- Article editor with local autosave, metrics, preview, and draft save API
- Prisma schema covering users, articles, revisions, comments, likes, bookmarks, follows, reports, notifications, uploads, and audit logs
- Route handlers for auth, articles, comments, likes, bookmarks, follows, reports, search, analytics, notifications, uploads, and health checks
- Service layer with demo-data fallback for local UI work before Neon is connected
- Algorithms for debounce, trie suggestions, ranking, related-article scoring, comment trees, cursor helpers, slug collision handling, rate limiting, LRU caching, graph similarity, diffing, and article state transitions
- Unit tests for core algorithm and permission logic

## Project Structure

```text
prisma/
  schema.prisma
  seed.ts
src/
  app/
    about/
    admin/
    api/
    article/[slug]/
    author/[username]/
    community/
    dashboard/
    login/
    register/
  components/
    analytics/
    articles/
    comments/
    dashboard/
    editor/
    layout/
    providers/
    ui/
  constants/
  lib/
    algorithms/
    validations/
  services/
tests/
  e2e/
  unit/
```

## Setup

1. Install dependencies.
2. Copy `.env.example` to `.env`.
3. Fill in Neon, Auth, and Cloudinary environment values.
4. Generate Prisma client: `npm run db:generate`
5. Run migrations: `npm run db:migrate`
6. Seed demo data: `npm run db:seed`
7. Start development: `npm run dev`

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
```

## Neon Notes

- Use `DATABASE_URL` for pooled application queries.
- Use `DIRECT_URL` for Prisma migrations.
- Keep server-only secrets out of client code.

## Authentication

- Credentials auth uses bcrypt-hashed passwords.
- Google OAuth is enabled automatically when both Google env vars are present.
- The repository includes the route handler for Auth.js at `/api/auth/[...nextauth]`.

## Contact Delivery

- Contact form submissions are persisted through the contact service.
- If `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL` are configured, the app sends the full submission to the admin inbox and a confirmation email to the user through Resend.
- If SMTP variables are configured instead, the app sends the admin copy and user confirmation through SMTP via Nodemailer.
- Without either mail configuration, the submission still succeeds and logs a local fallback.

## Search and Ranking

- Public discovery is structured around ranked community results.
- Prefix suggestions use a Trie in the demo path.
- Trending results use weighted engagement with recency decay.
- Related articles use shared-tag Jaccard similarity plus category/author boosts.

## Testing

- `npm run typecheck`
- `npm run lint`
- `npm run test`
- `npm run test:e2e`

The Playwright spec is scaffolded and intentionally skipped until a database-backed CI environment is available.

## Deployment

- Deploy the Next.js app to Vercel.
- Provision PostgreSQL with Neon.
- Configure image delivery with Cloudinary.
- Optionally add Redis / BullMQ later for background work and distributed rate limits.

## Remaining Production Steps

- Connect a live Neon database and create real migrations in that environment.
- Replace demo-mode service fallbacks with authenticated database queries throughout every route.
- Add full moderation workflows, upload ownership checks, and background jobs for scheduled publishing.
- Expand the editor from the current rich draft form into a TipTap or Lexical-powered editor if you want deeper formatting controls.
