# LexCircle

LexCircle is a production-oriented community publishing platform built with Next.js App Router, TypeScript, Prisma, PostgreSQL, and Auth.js. It is designed for multi-user article publishing with draft workflows, public discovery, analytics, moderation, and a contact/inbox system suitable for SaaS-style operations.

## Overview

LexCircle combines:

- public editorial pages for discovery and reading
- authenticated author workflows for drafting, editing, publishing, and analytics
- administrator and moderator controls for reports, operations, and inbound contact management
- a Prisma-backed data model structured for long-term growth on PostgreSQL / Neon

This repository currently includes a working application scaffold, route handlers, service layer, validation, algorithm utilities, admin contact inbox flows, and email delivery integration points.

## Core Capabilities

### Publishing and community

- Landing page with editorial positioning and featured content
- Community feed with ranked article cards
- Individual article pages with metadata, author details, and comments
- Public author profiles
- About and Contact pages

### Author experience

- Login and registration flows
- Dashboard overview
- My Articles pages
- Draft editor with local autosave, preview, reading metrics, and save API
- Bookmarks, history, analytics, profile, and settings pages

### Admin and operational features

- Admin overview page
- Contact inbox with persisted messages when PostgreSQL is configured
- Status updates, assignee selection, and internal notes for contact messages
- Report-management route scaffolding

### Backend foundation

- Prisma schema with users, articles, revisions, comments, likes, bookmarks, follows, reports, notifications, uploads, audit logs, and contact messages
- REST-style route handlers for auth, articles, comments, likes, bookmarks, reports, search, analytics, notifications, uploads, health checks, and contact workflows
- Demo-data fallback for selected services when database configuration is absent

## Technology Stack

### Application

- Next.js 16
- React 19
- TypeScript in strict mode
- Tailwind CSS 4
- App Router

### Data and authentication

- Prisma ORM
- PostgreSQL / Neon
- Auth.js (`next-auth`)
- Prisma adapter for Auth.js
- bcrypt password hashing

### Forms, validation, and UX

- React Hook Form
- Zod
- Sonner
- Lucide React
- Recharts
- Framer Motion
- sanitize-html

### Delivery and messaging

- Resend support via API
- SMTP support via Nodemailer

### Testing

- Vitest
- Playwright scaffold

## Architecture Summary

LexCircle follows a modular application structure:

- `src/app` contains route segments, pages, and route handlers
- `src/components` contains UI primitives and feature components
- `src/services` contains business logic and database/demo fallbacks
- `src/lib` contains shared helpers, validation, auth, permissions, and algorithms
- `prisma` contains the schema and seed script
- `docs` contains supplemental operational documentation

The repository favors:

- server components by default
- client components only where interactivity is required
- explicit validation on both the form and API side
- service-layer separation from route handlers
- deterministic algorithms for ranking and suggestions

## Repository Structure

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
    contact/
    dashboard/
    login/
    register/
  components/
    analytics/
    articles/
    comments/
    contact/
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
docs/
  api.md
  algorithms.md
  database-setup.md
  deployment.md
```

## Application Areas

### Public routes

- `/`
- `/community`
- `/article/[slug]`
- `/author/[username]`
- `/about`
- `/contact`

### Authenticated routes

- `/login`
- `/register`
- `/dashboard`
- `/dashboard/articles`
- `/dashboard/articles/new`
- `/dashboard/articles/[id]/edit`
- `/dashboard/bookmarks`
- `/dashboard/history`
- `/dashboard/analytics`
- `/dashboard/profile`
- `/dashboard/settings`

### Admin routes

- `/admin`
- `/admin/messages`

## Environment Variables

Copy [.env.example](D:/LexCircle/.env.example) to `.env` and configure the values appropriate for your environment.

### Required for database-backed operation

| Variable       | Purpose                                                     |
| -------------- | ----------------------------------------------------------- |
| `DATABASE_URL` | Pooled PostgreSQL / Neon connection used by the application |
| `DIRECT_URL`   | Direct PostgreSQL connection used by Prisma migrations      |

### Required for authentication

| Variable               | Purpose                             |
| ---------------------- | ----------------------------------- |
| `AUTH_SECRET`          | Session and token signing secret    |
| `NEXTAUTH_URL`         | Base URL used by Auth.js            |
| `GOOGLE_CLIENT_ID`     | Optional Google OAuth client ID     |
| `GOOGLE_CLIENT_SECRET` | Optional Google OAuth client secret |

### Required for uploads

| Variable                | Purpose               |
| ----------------------- | --------------------- |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY`    | Cloudinary API key    |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

### Required for contact email delivery

| Variable             | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `RESEND_API_KEY`     | Enables Resend delivery path                       |
| `CONTACT_FROM_EMAIL` | Verified sender used by the application            |
| `CONTACT_TO_EMAIL`   | Admin inbox that receives full contact submissions |
| `SMTP_HOST`          | SMTP host when not using Resend                    |
| `SMTP_PORT`          | SMTP port                                          |
| `SMTP_USER`          | SMTP username                                      |
| `SMTP_PASS`          | SMTP password                                      |
| `SMTP_SECURE`        | `true` or `false` for SMTP transport security      |

### Public client configuration

| Variable              | Purpose                |
| --------------------- | ---------------------- |
| `NEXT_PUBLIC_APP_URL` | Public application URL |

## Contact Delivery Behavior

The contact workflow is designed for two-message delivery:

1. The administrator receives the full contact submission at `CONTACT_TO_EMAIL`
2. The user receives a confirmation email at the email address entered in the contact form

### Resend mode

If these variables are present:

- `RESEND_API_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

then the application sends both the admin copy and the user confirmation through Resend.

### SMTP mode

If Resend is not configured, but these variables are present:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

then the application sends both messages through SMTP using Nodemailer.

### Fallback mode

If no mail provider is configured:

- the contact submission still succeeds
- the message can still persist through the contact service
- delivery falls back to a non-email local log path

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file from `.env.example`.

### 3. Generate Prisma client

```bash
npm run db:generate
```

### 4. Run migrations

```bash
npm run db:migrate
```

### 5. Seed the database

```bash
npm run db:seed
```

### 6. Start the development server

```bash
npm run dev
```

Application default URL:

```text
http://localhost:3000
```

## Available Scripts

| Script                | Description                                        |
| --------------------- | -------------------------------------------------- |
| `npm run dev`         | Start local development server                     |
| `npm run build`       | Generate Prisma client and build production bundle |
| `npm run start`       | Start production server                            |
| `npm run lint`        | Run ESLint                                         |
| `npm run typecheck`   | Run TypeScript checking                            |
| `npm run test`        | Run unit tests with Vitest                         |
| `npm run test:watch`  | Run Vitest in watch mode                           |
| `npm run test:e2e`    | Run Playwright tests                               |
| `npm run db:generate` | Generate Prisma client                             |
| `npm run db:migrate`  | Run Prisma development migration                   |
| `npm run db:deploy`   | Apply production migrations                        |
| `npm run db:seed`     | Seed database                                      |
| `npm run db:studio`   | Open Prisma Studio                                 |

## Authentication Design

Authentication is implemented with Auth.js and Prisma.

- Credentials authentication uses bcrypt-hashed passwords
- Google OAuth is enabled when Google credentials are configured
- JWT session strategy is used for compatibility with credentials login
- Session payload includes:
  - `id`
  - `username`
  - `role`
  - `isSuspended`

Auth route:

```text
/api/auth/[...nextauth]
```

## Database Model Coverage

The Prisma schema currently includes:

- `User`
- `Article`
- `Category`
- `Tag`
- `ArticleTag`
- `Comment`
- `Like`
- `Bookmark`
- `BookmarkCollection`
- `Follow`
- `ArticleView`
- `ArticleRevision`
- `ArticleActivity`
- `Report`
- `Notification`
- `AuditLog`
- `Upload`
- `ContactMessage`
- Auth.js support models:
  - `Account`
  - `Session`
  - `VerificationToken`

## API Design

Route handlers follow a consistent JSON envelope.

Successful response:

```json
{
  "success": true,
  "message": "Human readable status",
  "data": {}
}
```

Error response:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
```

Representative endpoints:

- `POST /api/auth/register`
- `GET|POST /api/auth/[...nextauth]`
- `GET|POST /api/articles`
- `GET|PATCH|DELETE /api/articles/[id]`
- `GET /api/articles/slug/[slug]`
- `GET /api/community/articles`
- `GET|POST /api/articles/[id]/comments`
- `POST|DELETE /api/articles/[id]/likes`
- `POST|DELETE /api/articles/[id]/bookmarks`
- `GET /api/users/[username]`
- `POST|DELETE /api/users/[username]/follow`
- `GET /api/analytics/articles/[id]`
- `POST /api/contact`
- `GET /api/admin/contact-messages`
- `PATCH /api/admin/contact-messages/[id]`
- `GET /api/health`

For more detail, see [docs/api.md](D:/LexCircle/docs/api.md).

## Algorithms and Data Structures

The repository includes practical algorithm utilities in `src/lib/algorithms`.

Examples:

- debounce for autosave and suggestions
- trie for prefix lookup
- weighted ranking for trending content
- related-article similarity scoring
- comment tree construction
- cursor helpers for pagination
- slug generation and collision resolution
- sliding-window rate limiting
- LRU cache
- graph similarity helpers
- revision diffing
- article state transition rules

See [docs/algorithms.md](D:/LexCircle/docs/algorithms.md) for details.

## Testing Strategy

### Implemented

- unit tests for core algorithms and permission logic
- TypeScript validation
- ESLint validation

### Scaffolded

- Playwright end-to-end configuration and placeholder spec

### Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
```

## Deployment

Recommended production stack:

- Vercel for hosting
- Neon for PostgreSQL
- Cloudinary for media
- Resend or SMTP for email delivery
- Optional Redis / BullMQ for future background jobs

Deployment steps:

1. Configure all environment variables
2. Run `npm run db:deploy`
3. Run `npm run build`
4. Deploy the application

See [docs/deployment.md](D:/LexCircle/docs/deployment.md) and [docs/database-setup.md](D:/LexCircle/docs/database-setup.md).

## Operational Notes

### Demo fallback behavior

Some services intentionally fall back to demo data when PostgreSQL is not configured. This keeps the UI usable during frontend-first development, but production deployments should use a fully configured database.

### Prisma generate on Windows

If `prisma generate` fails with an `EPERM` rename error on Windows, a running `next dev` or Node process may be locking Prisma engine files. Stop the dev server and retry:

```bash
npx prisma generate
```

If you only need type generation temporarily, this workaround is available:

```bash
npx prisma generate --no-engine
```

### Current lint warning

The repository currently has a pre-existing React Hook Form compiler warning in the draft editor component due to `form.watch(...)`. It is non-blocking, but it is still worth revisiting if you want a warning-clean lint pass.

## Security Notes

The current implementation includes the following foundations:

- password hashing with bcrypt
- structured validation with Zod
- server-side route validation
- role-aware session data
- sanitized content support
- protected contact inbox operations through server APIs

Before production launch, you should still verify:

- live authorization checks across all admin and author mutations
- database migration history in the target environment
- upload ownership enforcement
- rate limiting strategy for public APIs
- production-safe logging and secret handling

## Known Gaps / Next Steps

This repository is strong as a foundation, but some areas remain intentionally incomplete or simplified:

- editor is currently a structured draft form, not a full TipTap/Lexical editor
- several services still support demo fallbacks
- moderator/admin workflows beyond contact inbox are scaffolded more than fully operational
- Playwright flows are scaffolded rather than fully implemented
- distributed queues and caching are not yet integrated

## Supplemental Documentation

- [docs/api.md](D:/LexCircle/docs/api.md)
- [docs/algorithms.md](D:/LexCircle/docs/algorithms.md)
- [docs/database-setup.md](D:/LexCircle/docs/database-setup.md)
- [docs/deployment.md](D:/LexCircle/docs/deployment.md)

## License / Usage

No explicit license file is currently included in this repository. Add a license before public distribution or external commercial use.
