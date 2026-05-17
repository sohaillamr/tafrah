# Platform Upgrade Audit & Task Breakdown

Based on the required upgrade phases, this document outlines an audit of the current codebase state, followed by a divided task list to implement the required capabilities.

## Phase 1: Data Architecture & Multi-Tenancy

### Audit of Current State
- **Center Model:** A `Center` model exists with `id`, `name`, `code`, and `location`.
- **User Model:** Has an existing `centerId` relation to `Center`. There is a `disabilityType` string field (`AUTISM` | `CP` | `LEARNING_DIS`), but it needs converting to an Enum (`UserCategory`) and renaming `LEARNING_DIS` to `LEARNING_HARDENING`.
- **UI Preferences:** There is an existing `UserPreference` separate model handling themes and settings. We need to either consolidate this into a JSONB `uiPreferences` field on `User` as requested or update the current setup.
- **Chapter Model:** Does not currently exist.

### Action Tasks
- [ ] **Task 1.1:** Refactor the `Center` model in `prisma/schema.prisma` to use `licenseKey` instead of/alongside `code`.
- [ ] **Task 1.2:** Refactor `User` model:
  - Add the `enum UserCategory { AUTISM, CP, LEARNING_HARDENING, NONE }`.
  - Replace `disabilityType` with `category UserCategory @default(NONE)`.
  - Consolidate or add the `uiPreferences Json?` field to `User` for simpler JSONB storage.
- [ ] **Task 1.3:** Create `Chapter` model in schema:
  - Fields: `id`, `name`, `centerId` (relation to Center), `courses` (array or many-to-many relation), `createdAt`.
  - Add relations from `User` to `Chapter` (e.g., `chapterId` on User).
- [ ] **Task 1.4:** Generate and apply Prisma migrations.

---

## Phase 2: Dual Entry & The Diagnostic Wizard

### Audit of Current State
- Route handling happens in `app/auth/user-signup` and `app/auth/hr-signup`.
- Currently, onboarding lacks an adaptive Welcome Wizard logic branching.

### Action Tasks
- [ ] **Task 2.1:** Create a new split selector in `app/auth/page.tsx` or similar routing entry for "Join as Center" vs "Join as Individual".
- [ ] **Task 2.2:** Build the Welcome Wizard component (`app/onboarding/WelcomeWizard.tsx`):
  - Step 1: Ask for category (AUTISM, CP, LEARNING_HARDENING, NONE).
  - Step 2: Render logic gates based on selection.
  - Form state collection for sensory output, motor accessibility, and cognitive load formatting.
- [ ] **Task 2.3:** Implement `PATCH /api/user/onboarding` to save payload into `User.uiPreferences` and `User.category`.

---

## Phase 3: B2B Center Admin Dashboard

### Audit of Current State
- There are specific dashboards for students and HR. No dedicated Center Owner/Admin portal.

### Action Tasks
- [ ] **Task 3.1:** Scaffold `app/(dashboard)/center/page.tsx` with edge-protection ensuring the user has a `CENTER_ADMIN` role. (May need to add `CENTER_ADMIN` to User roles if not present).
- [ ] **Task 3.2:** Develop the **Student Manager Component**:
  - Requires a new API route (e.g. `GET /api/center/students`) to fetch users where `centerId` matches the admin's center.
  - Implement a table showing Name, Category, Current Chapter, and progress aggregation.
- [ ] **Task 3.3:** Build Chapter Assignment Modal:
  - UI for multi-selecting students in the Student Manager.
  - Dropdown to select a built `Chapter`.
  - `POST /api/center/assign-chapter` endpoint to update the selected students' `chapterId`.
- [ ] **Task 3.4:** Create "Add Student" functionality:
  - Form to directly provision a student OR generate a magic link containing `?centerId=xxx`.

---

## Phase 4: The Neuro-Adaptive Frontend Engine

### Audit of Current State
- The app uses CSS classes and Tailwind structure, but no global adaptive provider reacting purely to `uiPreferences` JSON dynamically natively exists (has existing separate `theme` states).

### Action Tasks
- [ ] **Task 4.1:** Overhaul `lib/store/usePreferencesStore.ts`:
  - Fetch `uiPreferences` on app load or post-login.
  - Define exact typed states: `largeButtons`, `dyslexicFont`, `highContrast`, `simplifiedText`.
- [ ] **Task 4.2:** Implement `GlobalThemeProvider` (`app/components/Adaptive/GlobalThemeProvider.tsx`):
  - Wraps the application root (`app/layout.tsx`).
  - Watches Zustand store and injects class names (`scale-110`, `font-dyslexia`, etc.) into `<body>` or specific containers.
- [ ] **Task 4.3:** Build LMS Adaptive Content Swapper:
  - Detect if `UserCategory === 'LEARNING_HARDENING'` in LMS modules (`app/courses/[id]...`).
  - Introduce generic toggle to swap dense text descriptions for audio components and concise Groq-generated summaries.

---

## Phase 5: AI Context Injection

### Audit of Current State
- `app/api/assistant/route.ts` already connects to Groq API. The prompt is somewhat static or handles basic user context.

### Action Tasks
- [ ] **Task 5.1:** Update `app/api/assistant/route.ts` to fetch the current user's `UserCategory` and `uiPreferences` from the DB or session token.
- [ ] **Task 5.2:** Modify the orchestration prompt template:
  - Add dynamic interpolation blocks inside the system instructions for `[UserCategory]` and `[uiPreferences]`.
  - Include specific directives for handling "AUTISM" vs "LEARNING_HARDENING" tone.