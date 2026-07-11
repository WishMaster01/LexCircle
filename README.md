# LexCircle

LexCircle is a full-stack law student publishing platform built for legal blogs, articles, case analysis, research papers, notes, and legal news.

It combines public discovery, an authenticated writing workflow, engagement features, admin moderation, and a legal-community-focused information architecture in one product.

## Hero

| Area | Details |
| --- | --- |
| **Live Demo** | `https://lexcircle.vercel.app` |
| **Project Type** | Full-stack legal publishing and community platform |
| **Built For** | Law students, legal societies, campus journals, research contributors |
| **Core Stack** | Next.js 16, React 19, TypeScript, Prisma, PostgreSQL, Auth.js |
| **Focus** | Structured legal writing, approval workflow, community engagement |
| **Status** | Functional MVP with public publishing, dashboard flows, and admin review |

## Project Snapshot

LexCircle is positioned as a niche publishing product rather than a generic blogging site. The platform is structured around law subjects, legal document types, author identity, and moderated publishing.

That gives it a clearer product direction for portfolio review:

- domain-specific content model for legal writing
- real user workflow from draft to admin approval to publication
- public engagement through likes, comments, views, bookmarks, sharing, and download
- role-based access for users and admins
- production-ready database and deployment workflow

## Features

### Public Experience

- home page organized around latest posts, featured writing, subjects, and authors
- latest page with filterable legal content discovery
- subject-driven navigation across 12 law categories
- public article pages with reading time, views, likes, comments, share link, copy link, and download
- author profile pages for published contributors

### Writing Workflow

- protected write flow for authenticated users
- support for:
  - Blog
  - Article
  - Case Analysis
  - Research Paper
  - Notes
  - Legal News
- cover image upload
- title, subtitle, tags, SEO fields, and structured legal metadata
- draft and approval workflow before public publication

### Community And Admin

- user engagement stored against actual platform data
- admin-only dashboard access
- dedicated admin login route
- moderation workflow for pending submissions
- contact and support message management

## Product Structure

### Top Navigation

- `Home`
- `Latest`
- `Subjects`
- `Write`
- `Community`
- `About`

### Subjects

- Constitutional Law
- Criminal Law
- Contract Law
- Family Law
- Property Law
- Company & Commercial Law
- Civil Procedure
- Administrative Law
- Intellectual Property Law
- Environmental Law
- International Law
- Miscellaneous

### Core Routes

- `/`
- `/latest`
- `/subjects`
- `/subjects/[slug]`
- `/write`
- `/community`
- `/article/[slug]`
- `/author/[username]`
- `/dashboard`
- `/admin`
- `/admin/login`

## Architecture

| Layer | Implementation |
| --- | --- |
| **Frontend** | Next.js App Router with Server Components by default and client components for interactive UI |
| **Styling** | Tailwind CSS 4 with responsive layouts across mobile, tablet, and desktop |
| **Authentication** | Auth.js with user login plus protected admin access |
| **Database** | PostgreSQL on Neon through Prisma ORM |
| **API Layer** | Route handlers under `src/app/api` |
| **Content Model** | users, articles, categories, tags, comments, likes, bookmarks, contact messages, uploads |
| **Publishing Logic** | draft submission, admin approval, publish visibility, author-specific history |

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma
- PostgreSQL / Neon
- Auth.js
- Zod
- React Hook Form
- Recharts
- Sonner

## Screenshots

This README is prepared for real screenshots later. Add your final images to `public/screenshots/`.

Recommended files:

- `public/screenshots/home.png`
- `public/screenshots/latest.png`
- `public/screenshots/write.png`
- `public/screenshots/admin.png`

Example markdown once those files exist:

```md
![LexCircle Home](public/screenshots/home.png)
![LexCircle Latest](public/screenshots/latest.png)
![LexCircle Write](public/screenshots/write.png)
![LexCircle Admin](public/screenshots/admin.png)
```

Suggested capture order:

1. Home page
2. Latest page with filters
3. Write page editor
4. Admin dashboard analytics or approvals

## Local Setup

```bash
npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Copy `.env.example` to `.env` before starting local development.

## Available Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start local development server |
| `npm run build` | Generate Prisma client and build the production app |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run Prisma development migration |
| `npm run db:deploy` | Apply production migrations |
| `npm run db:seed` | Seed the database |

## Documentation

- [Operations Guide](docs/operations.md)
- [Deployment](docs/deployment.md)
- [Database Setup](docs/database-setup.md)
- [API Overview](docs/api.md)
- [Algorithms](docs/algorithms.md)

## Notes

- The current editor is a structured legal draft form rather than a full rich-text editor.
- Article download is currently a text export workflow, not PDF generation.
- Some non-critical public pages can fall back to demo content when live data is unavailable.
