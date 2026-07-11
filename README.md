# LexCircle

LexCircle is a law student community platform built with Next.js App Router, TypeScript, Prisma, PostgreSQL, and Auth.js. It supports public legal publishing, structured writing workflows, admin approval, community engagement, contact/inbox management, and an admin dashboard for platform operations.

## Overview

LexCircle is structured around two connected experiences:

- a public-facing legal writing platform for discovery, reading, sharing, and author profiles
- an authenticated workspace for article drafting, approval history, bookmarks, profile management, and administration

The current application is designed for:

- law students
- student journals and law societies
- legal blogs and case analysis
- research papers, notes, and legal news

## Product Structure

### Top navigation

- `Home`
- `Latest`
- `Subjects`
- `Write`
- `Community`
- `About`

### Subjects

The current subject structure is:

1. Constitutional Law
2. Criminal Law
3. Contract Law
4. Family Law
5. Property Law
6. Company & Commercial Law
7. Civil Procedure
8. Administrative Law
9. Intellectual Property Law
10. Environmental Law
11. International Law
12. Miscellaneous

### Document types

The current supported writing types are:

- Blog
- Article
- Case Analysis
- Research Paper
- Notes
- Legal News

These are filters and writing formats, not top-level navigation items.

## Current Capabilities

### Public experience

- Homepage with:
  - search
  - latest posts
  - popular subjects
  - featured articles
  - recent case analysis
  - recent research papers
  - top authors
- Latest feed with subject, type, and sort filters
- Subject directory and subject-specific reading pages
- Community feed with filtering and engagement
- Individual article pages with:
  - title
  - subject
  - document type
  - author
  - reading time
  - published date
  - likes
  - views
  - comments
  - share link
  - copy link
  - download action
- Public author profiles
- About, Contact, Privacy Policy, Terms, and Disclaimer pages

### Author experience

- User registration and login
- Dedicated write page
- Draft editor with:
  - legal format selector
  - subject selector
  - cover image upload
  - content editor
  - tags
  - SEO fields
  - local autosave
  - reading metrics
  - preview mode
- Submission flow with admin approval requirement
- Dashboard overview
- My Articles
- History
- Bookmarks
- Analytics
- Profile
- Settings

### Admin experience

- Admin credentials loaded from environment variables
- Dedicated admin login page at `/admin/login`
- Protected admin route group
- Admin dashboard access button shown only to authenticated admin users
- Admin dashboard with approval queue and analytics
- Admin contact inbox

### Community and interaction

- Likes
- Bookmarks
- Comments
- Public author pages
- Shareable article URLs
- Downloadable article text export

## Technology Stack

### Application

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- App Router

### Data and authentication

- Prisma ORM
- PostgreSQL / Neon
- Auth.js (`next-auth`)
- Prisma adapter for Auth.js
- bcrypt password hashing

### Forms and UI

- React Hook Form
- Zod
- Sonner
- Lucide React
- Recharts
- Framer Motion
- sanitize-html

### Email delivery

- Resend
- SMTP / Nodemailer

### Testing

- Vitest
- Playwright scaffold

## Repository Structure

```text
prisma/
  migrations/
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
    latest/
    login/
    privacy-policy/
    register/
    subjects/
    terms/
    write/
  components/
    admin/
    analytics/
    articles/
    auth/
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
docs/
  algorithms.md
  api.md
  database-setup.md
  deployment.md
```

## Route Map

### Public routes

- `/`
- `/latest`
- `/subjects`
- `/subjects/[slug]`
- `/community`
- `/article/[slug]`
- `/author/[username]`
- `/about`
- `/contact`
- `/privacy-policy`
- `/terms`
- `/disclaimer`

### Authenticated user routes

- `/login`
- `/register`
- `/write`
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

- `/admin/login`
- `/admin`
- `/admin/messages`

## Environment Variables

Copy `.env.example` to `.env` and set the values for your environment.

### Database

| Variable       | Purpose                                                     |
| -------------- | ----------------------------------------------------------- |
| `DATABASE_URL` | Pooled PostgreSQL / Neon connection used by the app runtime |
| `DIRECT_URL`   | Direct PostgreSQL connection used by Prisma migrations      |

### Authentication

| Variable               | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `AUTH_SECRET`          | Auth.js session and token signing secret |
| `NEXTAUTH_URL`         | Base URL used by Auth.js                 |
| `GOOGLE_CLIENT_ID`     | Optional Google OAuth client ID          |
| `GOOGLE_CLIENT_SECRET` | Optional Google OAuth client secret      |

### Admin credentials

| Variable         | Purpose                                      |
| ---------------- | -------------------------------------------- |
| `ADMIN_NAME`     | Display name for the environment admin user  |
| `ADMIN_EMAIL`    | Admin login email                            |
| `ADMIN_PASSWORD` | Admin login password                         |

### Email delivery

| Variable             | Purpose                                            |
| -------------------- | -------------------------------------------------- |
| `RESEND_API_KEY`     | Enables Resend delivery path                       |
| `CONTACT_FROM_EMAIL` | Sender used by the application                     |
| `CONTACT_TO_EMAIL`   | Admin inbox that receives full contact submissions |
| `SMTP_HOST`          | SMTP host when not using Resend                    |
| `SMTP_PORT`          | SMTP port                                          |
| `SMTP_USER`          | SMTP username                                      |
| `SMTP_PASS`          | SMTP password                                      |
| `SMTP_SECURE`        | `true` or `false` for SMTP transport security      |

### Upload and media

| Variable                | Purpose                  |
| ----------------------- | ------------------------ |
| `CLOUDINARY_CLOUD_NAME` | Reserved for future use  |
| `CLOUDINARY_API_KEY`    | Reserved for future use  |
| `CLOUDINARY_API_SECRET` | Reserved for future use  |

Note: the current article cover upload path stores uploaded images through the application upload flow and does not yet provide a full Cloudinary-backed production media pipeline.

### Public app URL

| Variable              | Purpose                |
| --------------------- | ---------------------- |
| `NEXT_PUBLIC_APP_URL` | Public application URL |

## Contact Email Behavior

The contact workflow is set up for dual delivery:

1. the admin inbox receives the full submitted message
2. the submitting user receives a confirmation email

### Resend mode

If the following are configured:

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

then both emails are sent through SMTP using Nodemailer.

### Fallback mode

If no mail provider is configured:

- the contact submission still succeeds
- persistence still works when PostgreSQL is configured
- no actual email is delivered

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env`

Copy `.env.example` to `.env` and fill in your values.

### 3. Generate Prisma client

```bash
npm run db:generate
```

### 4. Run development migrations

```bash
npm run db:migrate
```

### 5. Seed the database

```bash
npm run db:seed
```

### 6. Start the dev server

```bash
npm run dev
```

Default local URL:

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

## Authentication and Access Control

Authentication is implemented with Auth.js and Prisma.

- credentials login is enabled for users
- Google OAuth is optional
- JWT session strategy is used
- admin credentials from `.env` create a special environment admin session
- admin-only UI and routes are protected with role-aware guards

Session payload includes:

- `id`
- `username`
- `role`
- `isSuspended`
- `isPortalAdmin`

Admin access behavior:

- regular users sign in through `/login`
- admin users can sign in through `/login` or `/admin/login`
- only admin sessions can access `/admin`
- only admin sessions see the admin dashboard shortcut from profile

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

Route handlers use a consistent response envelope.

### Success response

```json
{
  "success": true,
  "message": "Human readable status",
  "data": {}
}
```

### Error response

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
- `GET /api/articles/slug/[slug]`
- `GET /api/community/articles`
- `GET|POST /api/articles/[id]/comments`
- `POST|DELETE /api/articles/[id]/likes`
- `POST|DELETE /api/articles/[id]/bookmarks`
- `GET /api/users/[username]`
- `POST|DELETE /api/users/[username]/follow`
- `POST /api/contact`
- `POST /api/admin/articles/[id]/review`
- `GET /api/admin/contact-messages`
- `PATCH /api/admin/contact-messages/[id]`
- `GET /api/health`

See [`docs/api.md`](docs/api.md) for supplemental detail.

## Production Database Migration

Use Prisma deploy migrations in production, not development migrations.

### Generate client

```bash
npx prisma generate
```

### Check migration status

```bash
npx prisma migrate status
```

### Apply production migrations

```bash
npx prisma migrate deploy
```

For this repository, the package script equivalent is:

```bash
npm run db:deploy
```

## Deployment

Recommended stack:

- Vercel for hosting
- Neon for PostgreSQL
- Resend or SMTP for email delivery

Recommended deployment flow:

1. Configure all required environment variables
2. Apply production migrations:
   ```bash
   npm run db:deploy
   ```
3. Build the app:
   ```bash
   npm run build
   ```
4. Deploy or redeploy the application

If you use Vercel with Git integration, a `git push` to the connected branch is usually enough to trigger redeployment.

See:

- [`docs/deployment.md`](docs/deployment.md)
- [`docs/database-setup.md`](docs/database-setup.md)

## Testing and Quality

### Current commands

```bash
npm run typecheck
npm run lint
npm run test
npm run test:e2e
```

### Current status

- TypeScript checking is enabled
- ESLint is enabled
- Vitest is configured
- Playwright is scaffolded

## Operational Notes

### Demo fallback behavior

Some public services fall back to demo data when database configuration is missing or a non-critical public query fails. This helps keep the public UI usable during early setup and certain production recovery scenarios, but a real production deployment should use a working database.

### Prisma warning

Prisma currently warns that `package.json#prisma` is deprecated and will be removed in Prisma 7. The project still works, but it should eventually move to `prisma.config.ts`.

### Current lint warning

The repository currently has one pre-existing React Hook Form compiler warning in the editor component because of `form.watch(...)`. It is non-blocking but still worth cleaning up if you want a warning-clean lint pass.

### Windows Prisma note

If `prisma generate` fails on Windows with `EPERM`, a running `next dev` or Node process may be locking Prisma engine files. Stop the dev server and retry.

## Security Notes

Current foundations include:

- password hashing with bcrypt
- Zod validation on API and form inputs
- session-based admin protection
- sanitized article content handling
- guarded admin route handlers

Before production launch, still verify:

- authorization coverage on all sensitive mutations
- rate limiting strategy for public APIs
- upload ownership enforcement
- secret handling and logging policy
- database migration state in the target environment

## Known Limitations

- the editor is still a structured draft form, not a full rich-text legal editor
- some public flows still support demo fallback behavior
- admin/moderation beyond the implemented approval and inbox flow can be expanded further
- article download is currently a client-side text export, not PDF generation
- Cloudinary variables exist but the project is not yet a complete Cloudinary media pipeline

## Supplemental Documentation

- [`docs/api.md`](docs/api.md)
- [`docs/algorithms.md`](docs/algorithms.md)
- [`docs/database-setup.md`](docs/database-setup.md)
- [`docs/deployment.md`](docs/deployment.md)

## License

No explicit license file is currently included in this repository. Add one before public redistribution or commercial use.
