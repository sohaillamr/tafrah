# Tafrah Platform Architecture & Technical Overview

## 📖 Platform Description

**Tafrah** is a multi-sided educational, workforce accessibility, and job-matching platform designed with a native emphasis on neuro-inclusion and accessibility. It acts as an integrated ecosystem connecting three primary user groups:
1. **Students/Candidates:** Learn via tech and finance courses, track progress, utilize AI for semantic assistance, and apply for jobs tailored to their capabilities.
2. **HR Professionals:** Source verified candidates, post targeted job openings, and streamline application processes.
3. **Administrators:** Monitor global system metrics, handle support queues (tickets), and oversee user lifecycle management.

By seamlessly bridging Learning Management System (LMS) capabilities with an HR Job Board and AI-driven accessibility tooling, Tafrah ensures an equitable, frictionless pipeline from education directly into employment. 

---

## 🏗️ System Architecture

Tafrah leverages a modern, highly scalable full-stack TypeScript architecture built around modern React paradigms and Edge computing.

* **Core Framework:** Next.js 15.5 (App Router)
* **Language:** TypeScript (v5.5)
* **Database Engine:** PostgreSQL
* **ORM:** Prisma (v5.22)
* **Styling & UI:** Tailwind CSS, PostCSS, Framer Motion (for animations), and Lucide-React (icons)
* **State Management:** Zustand (for lightweight, decentralized global client state)
* **Security & Tokens:** Stateless JWT (`jose`), `bcryptjs`, CSRF protection, and custom Rate Limiting.
* **Specialized Subsystems:** `tafrah-video` (a video generation pipeline utilizing Remotion for dynamic video/marketing content).

### Directory & Component Structure

The monolith is organized into distinct logical bounds to separate concerns effectively:
* **`app/`**: Contains the Next.js App Router root, UI pages, Layouts, and the backend JSON APIs (`app/api/`).
* **`app/api/`**: Houses all backend request handlers, structured by feature domain.
* **`components/`**: Reusable frontend elements (`TopBar`, `Breadcrumbs`, `Toast`, `BetaNote`).
* **`data/`**: Static data layers (course metadata, JSON quizzes, Python/Finance unit content).
* **`lib/`**: Core utilities, database singletons, JWT authentication strategies, and sanitizers.
* **`prisma/`**: Database schema definitions (`schema.prisma`) and seed logic.
* **`tafrah-video/`**: Microservice directory containing the Remotion application for automated video generation.

---

## ⚙️ Core Modules & Pipelines

### 1. Authentication & Authorization Pipeline
* **Flow:** Implements a headless, stateless JWT workflow. Users register with role-specific entry points (`/auth/user-signup`, `/auth/hr-signup`).
* **Functions:** Passwords are cryptographically hashed using `bcryptjs`. Session persistence is managed securely, with Next.js Edge Middleware (`middleware.ts`) intercepting unauthenticated or unauthorized route attempts (e.g., stopping a Student from accessing an HR dashboard).

### 2. Learning Management System (LMS) Module
* **Flow:** Curriculum content is largely statically hosted in `/data/` (for speed and localization) while real-time user progress is tracked in the PostgreSQL database.
* **Functions:** 
  * `/api/courses/`: Retrieves curriculum data.
  * `/api/enrollments/` & `/api/progress/`: Manages step matrices, milestone tracking, and quiz evaluations. 
* **Accessibility:** Component styling heavily utilizes highly legible utility-class strategies (Tailwind) to allow easy adjustment of contrast ratios, tailored for neuro-divergent users.

### 3. HR & Job Matching Engine
* **Flow:** Connects educated candidates to hiring managers. HR users create `Job` entities linked to their profiles. Students create `Application` entities against these jobs.
* **Functions:** `/api/jobs/` orchestrates job definitions, correlates student profiles, and facilitates application bindings. 

### 4. AI Assistant Orchestration layer
* **Flow:** Provides users with real-time course assistance and semantic documentation breakdowns to aid neuro-inclusion and ease of learning.
* **Functions:** Operated via `/api/assistant/route.ts`, the backend proxies requests directly to the **Groq API**. It enforces dynamic API key rotation, restricts token/message lengths, checks session bounds, and utilizes rate limiters (`lib/rate-limit.ts`) to prevent abuse (e.g., localized to 30 requests/minute/IP).

### 5. internal Communications & Support Pipeline
* **Flow:** Ensures robust support and communication between platform layers without relying on external email chains.
* **Functions:**
  * **Messaging:** `/api/messages/` handles internal peer-to-peer or HR-to-Candidate inbox features.
  * **Ticketing:** `/api/tickets/` routes technical or account-based issues directly to the Admin dashboard context.

---

## 🗄️ Database Relationships (Prisma Maps)

Tafrah’s entity relations are strictly mapped using Prisma to ensure referential integrity and optimized queries:

* **User Entity:** The absolute core. Segmented by Role (`student`, `hr`, `admin`) and Status (`pending`, `verified`, `banned`). Maintains commercial details, avatars, and aggregate scores.
* **Course & Progress Schema:** Tracks progression via scalar bounds (0-100), Boolean milestones (completion markers), and unit checks.
* **Job & Application Trees:** Correlates a `User` acting as `JobPoster` to a `Job`, allowing multiple `Users` (candidates) to attach `Application` records onto that job.
* **Data Privacy:** Cascading deletes are explicitly defined across relations to guarantee full PII (Personally Identifiable Information) stripping upon account deletion.

---

## 🚀 DevOps, Security & Deployment

* **Edge Protection:** Route logic checks are maintained on the Edge via Next.js Middleware. `lib/sanitize.ts` and `lib/csrf.ts` guarantee protection against XSS and Cross-Site Request Forgery scenarios.
* **Adapter Readiness:** The application configuration dynamically supports multiple deployment adapters (notably verified through `vercel.json` and `netlify.toml` presence) for seamless serverless/edge deployments.
* **Database Pooling:** Configuration allows connection splitting by distinguishing a pooled connection string (`DATABASE_URL`) from a direct connection (`DIRECT_URL`) for migrations, maximizing concurrency limits on standard PostgreSQL deployments.

***