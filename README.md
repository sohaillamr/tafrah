# Tafrah V4

Tafrah V4 is a Next.js education and accessibility platform focused on neuro-inclusive learning, adaptive user preferences, course progression, center-based student management, support workflows, and an AI learning assistant named Nour.

The application is built as a full-stack Next.js App Router project with Prisma/PostgreSQL for persistent data, JWT cookies for authentication, Tailwind CSS for the interface, Zustand for client-side preference state, and Groq-backed AI endpoints for assistant and speech workflows. A separate `tafrah-video/` package contains a Remotion project for video generation work.

> Current repository status: this README reflects the codebase as reviewed on 2026-05-18. The project is not build-clean at the moment; see [Known Issues](#known-issues).

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Application Routes](#application-routes)
- [API Routes](#api-routes)
- [Data Model](#data-model)
- [Authentication and Authorization](#authentication-and-authorization)
- [AI Assistant](#ai-assistant)
- [Course Content](#course-content)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Database Workflow](#database-workflow)
- [Scripts](#scripts)
- [Deployment Notes](#deployment-notes)
- [Known Issues](#known-issues)
- [Companion Video Package](#companion-video-package)

## Features

- Bilingual Arabic/English UI shell with RTL/LTR switching through `tafrah_lang`.
- Student authentication, signup, recovery, onboarding, dashboard, profile, messages, and course learning flows.
- Adaptive UI preference layer for categories such as autism, cerebral palsy, and learning difficulties.
- Course catalog, enrollment tracking, unit progress, quiz progress, and completion worker hooks.
- Admin panel for users, courses, support tickets, activity logs, and system statistics.
- Separate staff vault under `/staff` with admin authentication, user management, system pulse, and impersonation tooling.
- Center management APIs for center students, chapters, and chapter assignment.
- Support ticket API and contact form wiring.
- Internal message API for user-to-user communication.
- Nour AI assistant API with Groq streaming responses, rate limiting, progress-aware context, user preference context, and basic frustration detection.
- Speech-to-text endpoint for assistant voice workflows.
- Security middleware for protected routes, same-origin checks on mutating API requests, and security headers.

## Tech Stack

- Framework: Next.js `15.5.10` with App Router
- Runtime UI: React `18.3.1`
- Language: TypeScript `5.5.4`
- Styling: Tailwind CSS `3.4.7`, PostCSS, global CSS
- Database: PostgreSQL through Prisma
- ORM: Prisma `5.22.0`
- Authentication: JWT via `jose`, password hashing via `bcryptjs`
- State: Zustand
- UI/visuals: Lucide React, Framer Motion, Recharts
- AI provider: Groq API
- Deployment config: Vercel and Netlify files are present
- Video companion: Remotion in `tafrah-video/`

## Repository Structure

```text
.
+-- app/                         # Next.js pages, layouts, route handlers, app-local components
|   +-- api/                     # Backend API routes
|   +-- auth/                    # Login, signup, recovery, quiz, center signup
|   +-- courses/                 # Course catalog, detail, and learning player
|   +-- dashboard/               # Unified learner dashboard and center dashboard
|   +-- staff/                   # Staff vault login and dashboard
|   +-- components/              # App-level UI providers and shared components
+-- components/                  # Shared cross-app components
+-- data/                        # Static course and quiz content
+-- lib/                         # Auth, Prisma, security, data fetching, stores
+-- prisma/                      # Prisma schema and seed script
+-- public/                      # Static images and logos
+-- services/                    # Background-like service helpers
+-- tafrah-video/                # Remotion video project
+-- middleware.ts                # Edge middleware for route protection and headers
+-- package.json                 # Main app scripts and dependencies
+-- README.md                    # This file
```

## Application Routes

Primary pages in the current app:

- `/` - home page
- `/about` - about page
- `/our-science` - science/research page
- `/privacy` - privacy page
- `/contact` - support/contact page
- `/auth/select` - account type selection
- `/auth/login` - user login
- `/auth/user-signup` - student/user signup
- `/auth/center-signup` - center signup
- `/auth/recovery` - account recovery
- `/auth/quiz` - discovery/adaptive quiz
- `/onboarding` - onboarding flow
- `/dashboard` - unified authenticated dashboard
- `/dashboard/center` - center dashboard
- `/courses` - course catalog
- `/courses/[id]` - course details
- `/courses/[id]/learn` - protected learning player
- `/assistant` - Nour assistant UI
- `/messages` - internal messages
- `/profile/[id]` - user profile
- `/admin` - application admin panel
- `/staff/login` - staff vault login
- `/staff/dashboard` - staff command dashboard
- `/staff/dashboard/users` - staff user management

## API Routes

Current API route handlers under `app/api`:

| Route | Methods | Purpose |
| --- | --- | --- |
| `/api/health` | `GET` | Health check |
| `/api/auth/signup` | `POST` | Create user account |
| `/api/auth/login` | `POST` | Login, set `tafrah_token` cookie |
| `/api/auth/logout` | `GET`, `POST` | Clear session |
| `/api/auth/me` | `GET` | Return current authenticated user |
| `/api/auth/recovery` | `POST` | Account recovery workflow |
| `/api/user/onboarding` | `PATCH` | Save onboarding state/preferences |
| `/api/users` | `GET` | Admin user list with pagination/filtering |
| `/api/users/[id]` | `GET`, `PATCH`, `DELETE` | User profile, update, delete |
| `/api/users/preferences` | `PUT` | Save user preference profile |
| `/api/courses` | `GET`, `POST` | List courses, create admin course |
| `/api/courses/[id]` | `GET`, `PATCH`, `DELETE` | Course detail/update/delete |
| `/api/enrollments` | `GET`, `POST` | List/create enrollments |
| `/api/progress` | `GET`, `POST` | Read and upsert course unit progress |
| `/api/messages` | `GET`, `POST` | Conversation list and message creation |
| `/api/tickets` | `GET`, `POST` | List/create support tickets |
| `/api/tickets/[id]` | `PATCH`, `DELETE` | Update/delete support tickets |
| `/api/admin/stats` | `GET` | Admin metrics and charts |
| `/api/assistant` | `POST` | Nour chat completion stream via Groq |
| `/api/assistant/stt` | `POST` | Assistant speech-to-text workflow |
| `/api/assistant/analyze-strengths` | `POST` | Skill/strength analysis |
| `/api/staff/auth` | `POST` | Staff vault authentication |
| `/api/staff/admin/pulse` | `GET` | Staff system pulse |
| `/api/staff/admin/users` | `POST` | Staff user administration |
| `/api/staff/admin/impersonate` | `POST` | Staff impersonation |
| `/api/center/students` | `GET` | Center student list |
| `/api/center/chapters` | `GET`, `POST` | Center chapters |
| `/api/center/assign-chapter` | `POST` | Assign student to chapter |

## Data Model

The current Prisma schema uses PostgreSQL and defines these models:

- `User` - account identity, role, status, category, UI preferences, profile fields, center/chapter links
- `UserPreference` - long-term formatting, sensory, theme, motion, mascot, and learning preferences
- `SkillProfile` - skill metrics, badges, projects, strengths summary, career readiness
- `Course` - course metadata, availability, archive state, category, difficulty, hours, modules
- `Enrollment` - user/course enrollment with progress and completion state
- `Progress` - per-user per-course unit progress, step index, quiz status, score
- `Message` - internal direct messages
- `Ticket` - support requests
- `ActivityLog` - user/admin activity stream
- `SiteSetting` - key/value site settings
- `PasswordResetToken` - recovery token tracking
- `RateLimitEntry` - persisted rate-limit counters
- `AuditLog` - admin audit entries
- `Center` - center organization records
- `Chapter` - center chapters and student grouping

Important: the current Prisma schema does not define `Job` or `Application` models, even though some older UI/docs/seed code still reference job-matching concepts.

## Authentication and Authorization

The main app uses a JWT stored in the `tafrah_token` HTTP-only cookie.

- Tokens are signed in `lib/auth.ts` with `jose`.
- Passwords are checked with `bcryptjs`.
- `getSession()` validates the JWT and tries to refresh user role/name/status from the database.
- `middleware.ts` protects `/admin`, `/dashboard`, `/messages`, `/assistant`, and staff dashboard routes.
- Mutating `/api/*` requests are guarded with same-origin `Origin`/`Referer` checks.
- Security headers are set in middleware, including frame protection, content type protection, referrer policy, HSTS, permissions policy, and CSP.

There is also a separate staff vault path using `__tafrah_admin_vault` and helpers in `lib/admin-auth.ts`.

## AI Assistant

Nour is implemented primarily through `app/api/assistant/route.ts`.

Behavior:

- Requires an authenticated user.
- Rate-limits by user and IP.
- Accepts recent user/assistant messages.
- Pulls the user's latest progress, category, UI preferences, and saved `UserPreference`.
- Builds a neuro-inclusive system prompt with category-specific guidance.
- Detects simple frustration signals and switches to a calmer response style.
- Streams Groq chat completions as `text/event-stream`.
- Tries primary and secondary Groq keys, with a backup model fallback.

Environment variables used:

- `GROQ_API_KEY`
- `GROQ_API_KEY_SECONDARY`
- `GROQ_API_KEY_VOICE`

## Course Content

Course metadata lives in the database through `Course`, while lesson content is loaded from static files in `data/` through `lib/data/course-fetcher.ts`.

Current content families include:

- Data entry units: `Unit1Content.js` through `Unit7Content.js`
- Python units: `PythonUnit1Content.js` through `PythonUnit7Content.js`
- Finance units: `FinanceUnit1Content.js` through `FinanceUnit4Content.js`
- Quizzes: `quizzes.js`, `pythonQuizzes.js`, `financeQuizzes.js`
- Catalog seed/static metadata: `data/courses.json`

The learning route `/courses/[id]/learn` requires authentication and enrollment unless the user is an admin.

## Environment Variables

Create `.env.local` from `.env.example` and fill the values:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="replace-with-a-secure-random-string"
GROQ_API_KEY=""
GROQ_API_KEY_SECONDARY=""
GROQ_API_KEY_VOICE=""
```

Notes:

- `DATABASE_URL` is used by Prisma at runtime.
- `DIRECT_URL` is used by Prisma for direct migration access.
- `JWT_SECRET` must be strong in production.
- Groq keys are required for the assistant and voice features.

## Local Development

Install dependencies:

```bash
npm install
```

Prepare Prisma:

```bash
npm run db:generate
```

Apply the schema to the configured database:

```bash
npm run db:push
```

Start the dev server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Database Workflow

Generate Prisma client:

```bash
npm run db:generate
```

Create and apply a development migration:

```bash
npm run db:migrate
```

Deploy migrations:

```bash
npm run db:migrate:deploy
```

Push schema without a migration:

```bash
npm run db:push
```

Open Prisma Studio:

```bash
npm run db:studio
```

Seed/reset caveat: `prisma/seed.js` is currently stale and references models/fields that are not present in `prisma/schema.prisma`. Do not rely on `npm run db:seed`, `npm run db:setup`, or `npm run db:reset` until the seed script is reconciled with the schema.

## Scripts

Main app scripts:

| Script | Command | Purpose |
| --- | --- | --- |
| `dev` | `next dev` | Start local Next.js server |
| `build` | `npx prisma generate && next build` | Generate Prisma client and build app |
| `start` | `next start` | Start production server after build |
| `lint` | `next lint` | Run Next linting |
| `db:generate` | `npx prisma generate` | Generate Prisma client |
| `db:migrate` | `npx prisma migrate dev` | Create/apply local migration |
| `db:migrate:deploy` | `npx prisma migrate deploy` | Apply migrations in deployment |
| `db:push` | `npx prisma db push` | Push schema to DB |
| `db:seed` | `node prisma/seed.js` | Seed demo data, currently stale |
| `db:setup` | `npx prisma generate && npx prisma db push && node prisma/seed.js` | Full setup, currently blocked by stale seed |
| `db:studio` | `npx prisma studio` | Open Prisma Studio |
| `db:reset` | `npx prisma db push --force-reset && node prisma/seed.js` | Reset/seed DB, currently blocked by stale seed |

## Deployment Notes

The repository includes:

- `vercel.json`
- `netlify.toml`
- `@netlify/plugin-nextjs`

Before deploying:

- Ensure production `DATABASE_URL`, `DIRECT_URL`, and `JWT_SECRET` are configured.
- Configure Groq keys if assistant features should be available.
- Run `npm run build` locally before pushing a release.

## Known Issues

Current known risks:

1. Some older Arabic text in untouched legacy pages may still need UTF-8 copy review.
2. `lib/auth.ts` signs tokens for `7d`, while `app/api/auth/login/route.ts` sets the cookie `maxAge` to 30 days. The cookie can outlive the token.
3. Middleware decodes JWTs at the edge without signature verification for route gating. API handlers still verify sessions, but page-level redirects rely on decoded role data.
4. Playwright is not currently installed in this workspace, so visual browser QA should be added to the project before a larger UI release.

Recent verification:

```text
npx prisma validate
Result: schema is valid.

npm run build
Result: passes.
```

## Companion Video Package

`tafrah-video/` is a separate Remotion project.

Commands:

```bash
cd tafrah-video
npm install
npm run dev
npm run build
npm run lint
```

It uses React 19, Remotion 4, Tailwind 4, TypeScript 5.9, and its own package lock.

## Suggested Next Steps

1. Fix the syntax error in `app/page.tsx`.
2. Decide whether job/application functionality should return. If yes, restore Prisma models and API routes; if no, remove stale UI and seed references.
3. Repair or regenerate mojibaked Arabic text from a clean UTF-8 source.
4. Align center auth with the main `tafrah_token` session system.
5. Rewrite `prisma/seed.js` against the current schema.
6. Run `npm run build` again and address the next surfaced issue.
