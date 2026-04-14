# CODEBASE SUMMARY - Tafrah

This document serves as the conceptual blueprint and source-of-truth for the Tafrah multi-sided platform architecture, capturing its high-level design, primary integrations, security models, and front-to-back logic flows.

## 1. High-Level Architecture

**Stack Overview:**
*   **Framework:** Next.js 15.5.x (App Router)
*   **Language:** TypeScript 5.5
*   **Styling:** Tailwind CSS 3.4
*   **Database Engine:** PostgreSQL
*   **ORM:** Prisma 5.22
*   **State Management:** Zustand (Client-side)
*   **Icons & Visualization:** Lucide-React, Recharts

**Directory Structure:**
```text
/
├── app/               # Next.js App Router root (Pages, Layouts, API routes)
│   ├── api/           # Backend JSON APIs and Middlewares
│   ├── (routes)/      # Frontend views (admin, auth, courses, dashboard, jobs, etc.)
│   └── globals.css    # Global stylesheets and Tailwind directives
├── components/        # Reusable UI components (TopBar, Breadcrumbs, Toast, BetaNote)
├── data/              # Static JSON and JS content layers (quizzes, course metadata)
├── lib/               # Core utility functions (DB clients, auth utilities, sanitization)
├── prisma/            # Database schema definitions and seed scripts
└── public/            # Static assets
```

**Entry Points:**
*   **Frontend:** `app/layout.tsx` and `app/page.tsx` act as the primary UI entry bounds. `middleware.ts` runs at the edge for route interception.
*   **Backend:** `app/api/**/route.ts` handlers defined using the App Router convention route incoming API requests.

## 2. Backend & API Logic

**Core Modules:**
*   **Auth:** JWT-based stateless authentication (`jose`, `bcryptjs`) spanning sign up, login, recovery, and role-based access.
*   **Course Management:** Retrieval of static lesson content alongside dynamic PostgreSQL schema mapping for enrollments and progress tracking.
*   **Job Matching Engine:** Handled via APIs correlating user profiles (students/candidates) and HR job postings.
*   **Admin/Metrics:** Secured routes aggregating global system usage metrics, ticket queues, and user lifecycle states.

**Primary API Endpoints (`app/api/`):**
*   `/api/auth/[action]`: Handles `login`, `logout`, `signup`, `recovery`, and `me` (session recovery).
*   `/api/courses/[id]`: Serves individual course data.
*   `/api/enrollments & /api/progress`: Manages user trajectory, completion tracking, and quiz evaluations.
*   `/api/jobs/[id]`: Job definitions and HR application bindings.
*   `/api/admin/stats`: Master aggregation query handler for administration.
*   `/api/assistant`: Integrates proxy requests to underlying LLM APIs.

**Middleware & Security:**
*   **Data Validation & Rate Limiting:** Found in `lib/rate-limit.ts` (restricts endpoint spam, e.g., 30 requests/minute per IP on the assistant endpoint) and `lib/sanitize.ts`.
*   **Request Interception:** `middleware.ts` guards specific page scopes against unauthenticated or unauthorized roles.
*   **Protection Layers:** CSRF helper implementations in `lib/csrf.ts`.

## 3. Frontend & User Experience (UX)

**Component Map:**
*   **Navigation / Shell:** `TopBar.tsx`, `Footer.tsx`, `Breadcrumbs.tsx`.
*   **System Layouts:** Dedicated sub-layouts isolate HR flows (`app/dashboard/hr/`), Student flows (`app/dashboard/student/`), and Admin workflows (`app/admin/`).
*   **Providers:** `AuthProvider.tsx` wraps session integrity, while `LanguageProvider.tsx` dictates bilingual (Ar/En) rendering.
*   **Feedback:** `Toast.tsx` and `BetaNote.tsx` form the primary micro-interactions tier.

**State Management:**
*   Employs **Zustand** for lightweight, decentralized global client state, bridging cross-component data requirements without prop drilling.

**Neuro-Inclusion & Accessibility Patterns:**
*   The architecture includes localized (Ar/En) structures to support broad demographics.
*   Styling relies heavily on highly legible utility-class strategies (Tailwind) to allow easy adjustment of contrast ratios and layout density, fitting neuro-inclusion criteria natively.

## 4. AI & Integration Layer

**Model Integration:**
*   **Service Provider:** Groq API (Inferred via `GROQ_API_KEY` environmental binding).
*   **Orchestration Route:** `app/api/assistant/route.ts`. 
*   **Logic:** The assistant route provisions a conversational agent. It filters input shapes, enforces strict token/message length limits, enforces dynamic API key rotation (Primary/Secondary), and ensures queries are tied to authenticated session limits.

**Automation Logic:**
*   LLM-driven inferences operate securely behind the proxy API, empowering users with workforce accessibility assistance, semantic breakdown of dense documentation, or guidance during coursework within the `/assistant/` bounds.

## 5. Data Schema & Relationships

*The Prisma schema establishes a rigorously relation-mapped SQL schema:*

**Models/Entities:**
*   **User:** Segregated by role (`student`, `hr`, `admin`) and status (`pending`, `verified`, `banned`). Maintains commercial details, avatars, and aggregate scores.
*   **Course / Enrollment / Progress:** The curriculum backbone. Tracks progress via scalar bounds (`0-100`), Boolean milestones (`completed`), and unit/step matrices.
*   **Job & Application:** Correlates `User` (acting as HR `JobPoster`) to generated jobs, allowing multiple `Users` (students) to bridge via `Application` records.
*   **Communication:** Internal messaging (`Message` entities with bidirectional relations) and support queues (`Ticket`).

**Privacy Controls:**
*   Database connections split into pool strategies (`DATABASE_URL`) vs direct (`DIRECT_URL`).
*   Password cryptographically hashed via `bcryptjs`.
*   Data cascading deletes ensure PII stripping on account removals (`onDelete: Cascade` applied to relations like enrollments).

## 6. DevOps & Environment

**Dependencies:**
*   Next.js edge operations configured via `netlify.toml` / `vercel.json` (Dual-adapter potential).
*   Styling pipelines ran cleanly through PostCSS (`postcss.config.js`).

**Deployment & CI/CD:**
*   Includes Netlify builder plugin (`@netlify/plugin-nextjs`).
*   Database workflows rely on Prisma migration commands (`db:migrate:deploy`, `db:push`) integrated directly into the deployment steps in `package.json`.
*   The environment leverages `.env` configurations mapped through `lib/env.ts` defensively across builds.
