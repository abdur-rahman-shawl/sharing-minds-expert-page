# SharingMinds — Mentor Onboarding Platform Overview

## 1. Purpose & Context

SharingMinds is a **mentor-mentee connect platform** currently in its **pre-launch phase**. This particular application serves as the **mentor onboarding portal** — its sole job is to attract, register, and onboard expert mentors _before_ the main platform launches, ensuring there is a critical mass of mentors ready on day one.

The app is **not** the main product. It is a standalone recruitment funnel that:

- Markets the platform's value proposition to potential mentors via a polished landing page.
- Handles user authentication (email, Google, LinkedIn).
- Collects detailed mentor applications through a multi-step registration form.
- Tracks each application through a verification pipeline (`YET_TO_APPLY → IN_PROGRESS → VERIFIED / REJECTED / REVERIFICATION`).
- Provides a status-aware dashboard and an exclusive VIP Lounge for registered mentors.

---

## 2. Tech Stack

| Layer             | Technology                                                   |
| ----------------- | ------------------------------------------------------------ |
| **Framework**     | Next.js 14 (App Router) with React 18, TypeScript            |
| **Styling**       | Tailwind CSS 3.4 + `tailwindcss-animate`                     |
| **UI Primitives** | Radix UI (Accordion, Dialog, Select, Tabs, Toast, etc.)      |
| **Icons**         | Lucide React, React Icons (Google/LinkedIn brand icons)       |
| **Auth**          | `better-auth` (email/password, Google OAuth, LinkedIn OAuth)  |
| **Database**      | PostgreSQL (via Supabase-hosted)                              |
| **ORM**           | Drizzle ORM with `postgres` driver                            |
| **Backend BaaS**  | Supabase (storage for files, admin client for direct DB ops)  |
| **State/Data**    | TanStack React Query (server-state caching)                   |
| **Forms**         | React Hook Form + Zod schema validation                       |
| **Emails**        | Nodemailer (Gmail SMTP)                                       |
| **Theming**       | `next-themes` (system/light/dark)                             |
| **Analytics**     | Vercel Analytics                                              |
| **Fonts**         | Montserrat (headings), Open Sans (body) — via `next/font`     |

---

## 3. Project Structure

```
sm-expert-landing-page/
├── app/                        # Next.js App Router pages & API routes
│   ├── layout.tsx              # Root layout (providers, fonts, metadata)
│   ├── AppLayout.tsx           # Client layout (header/footer toggle, mentor redirect)
│   ├── page.tsx                # Landing page (/)
│   ├── about/                  # About Us page
│   ├── auth/
│   │   ├── login/              # Sign-in / sign-up page (LoginPageClient.tsx)
│   │   └── verify-email/       # Email verification callback
│   ├── contact/                # Contact form page
│   ├── dashboard/              # Mentor dashboard (status-based)
│   ├── policies/               # Legal policies display page
│   ├── registration/           # Multi-step mentor registration form
│   ├── service/                # Services description page
│   ├── verify-email/           # OTP email verification page
│   ├── vip-lounge/             # Exclusive VIP area for registered mentors
│   └── api/                    # API route handlers
│       ├── auth/               # Auth endpoints (better-auth catch-all, OTP, sessions)
│       ├── consents/           # Consent event logging
│       ├── contact/            # Contact form submission
│       ├── locations/          # Countries/states/cities lookups
│       └── mentors/            # Mentor application & status check
├── components/                 # UI components
│   ├── header.tsx              # Responsive nav header with auth controls
│   ├── footer.tsx              # Site footer
│   ├── hero-section.tsx        # Landing page hero
│   ├── benefits-section.tsx    # Landing page benefits
│   ├── testimonial-section.tsx # Landing page testimonials
│   ├── final-cta-section.tsx   # Landing page final CTA
│   ├── auth/                   # Auth-related components
│   ├── common/                 # Error boundary, reusable components
│   ├── ui/                     # 51 Radix-based UI primitives (Button, Card, Dialog, etc.)
│   └── vip/                    # VIP invitation component
├── contexts/
│   └── auth-context.tsx        # Global auth state (session, roles, mentor profile)
├── hooks/
│   ├── use-mentor-status.ts    # Hook to check mentor registration & verification
│   ├── use-mobile.tsx          # Responsive breakpoint hook
│   ├── use-scroll-animation.tsx# Scroll-triggered animation hook
│   ├── use-toast.ts            # Toast notification hook
│   └── queries/                # TanStack Query hooks for session
├── lib/
│   ├── auth.ts                 # better-auth server config (providers, DB hooks)
│   ├── auth-client.ts          # better-auth client-side helper
│   ├── supabase.ts             # Supabase client (anon + service role)
│   ├── emails.ts               # Email sending functions (Nodemailer)
│   ├── otp.ts                  # OTP generation & verification logic
│   ├── consent-client.ts       # Client-side consent logging
│   ├── legal-documents.ts      # Legal document content (T&C, Privacy, etc.)
│   ├── react-query.ts          # TanStack Query session hooks
│   ├── utils.ts                # General utilities (cn helper)
│   ├── db/
│   │   ├── index.ts            # Drizzle DB initialisation (postgres driver)
│   │   ├── user-helpers.ts     # Helper to fetch user with joined roles
│   │   ├── schema/             # All Drizzle schema definitions
│   │   └── migrations/         # DB migration files
│   ├── storage/                # Supabase Storage upload helpers
│   └── validations/            # Zod schemas for form validation
├── providers/
│   └── query-provider.tsx      # TanStack QueryClientProvider wrapper
├── styles/
│   └── (global styles)
├── documentation/              # Project documentation
└── public/                     # Static assets
```

---

## 4. Pages & Routes

### 4.1 Public Pages

| Route        | Component                  | Description                                                                                             |
| ------------ | -------------------------- | ------------------------------------------------------------------------------------------------------- |
| `/`          | `page.tsx`                 | **Landing page** — Hero, Benefits, Testimonials, Final CTA sections. Main entry point for mentor recruitment. |
| `/about`     | `about/AboutPageClient`    | About Us — Mission, values, team behind SharingMinds.                                                   |
| `/service`   | `service/ServicePageClient`| Services — Description of the mentoring services offered.                                               |
| `/contact`   | `contact/ContactPageClient`| Contact form — Submits to API, sends notification email to team.                                        |
| `/policies`  | `policies/page.tsx`        | Legal policies — Parsed and displayed from `legal-documents.ts` (T&C, Privacy Policy, etc.).            |

### 4.2 Auth Pages

| Route              | Component                        | Description                                                         |
| ------------------ | -------------------------------- | ------------------------------------------------------------------- |
| `/auth/login`      | `LoginPageClient.tsx`            | **Sign in / Sign up** — Email+password, Google OAuth, LinkedIn OAuth. Toggleable sign-in/sign-up forms. |
| `/auth/verify-email`| `auth/verify-email`             | Email verification callback handler.                                 |
| `/verify-email`    | `verify-email/`                  | OTP-based email verification page (during registration).             |

### 4.3 Authenticated / Role-Based Pages

| Route            | Component                    | Description                                                                                      |
| ---------------- | ---------------------------- | ------------------------------------------------------------------------------------------------ |
| `/dashboard`     | `dashboard/page.tsx`         | **Mentor dashboard** — Displays a status card based on auth state and verification status.       |
| `/registration`  | `RegistrationForm.tsx`       | **Multi-step mentor application form** — Personal info, professional details, file uploads, legal consents, OTP verification. |
| `/vip-lounge`    | `vip-lounge/page.tsx`        | **VIP area** — Exclusive page for registered mentors. Shows `VipInvitation` component. Verified mentors can also navigate to dashboard. |

### 4.4 Navigation & Layout Behaviour

- **`AppLayout.tsx`** wraps all pages and:
  - Hides the Header & Footer on `/auth/*` and `/vip-lounge` routes.
  - Auto-redirects authenticated mentors to `/vip-lounge` (unless already there).
- The **Header** includes: logo, nav links (Service, About, Contact), auth buttons (Sign In / Dashboard / Sign Out), and a mobile hamburger menu.

---

## 5. Authentication System

### 5.1 Provider: `better-auth`

Configured in [`lib/auth.ts`](file:///c:/Users/Admin/sm-expert-landing-page/lib/auth.ts):

- **Email + Password** sign-in/sign-up.
- **Google OAuth** (with offline access, consent prompt).
- **LinkedIn OAuth** (OpenID Connect scopes).
- Sessions expire after **7 days**, refreshed every **24 hours**.

### 5.2 Auto Role Assignment

On session creation, a database hook automatically assigns the **`mentee`** role to any new user who doesn't have roles yet. This ensures every new sign-up starts as a mentee.

### 5.3 Auth Context (`contexts/auth-context.tsx`)

A global React context providing:

| Property                       | Description                                          |
| ------------------------------ | ---------------------------------------------------- |
| `session`                      | Raw session object from better-auth                  |
| `isAuthenticated`              | Boolean — is the user logged in?                     |
| `roles`                        | Array of `{ name, displayName }`                     |
| `primaryRole`                  | Highest priority role (mentor > mentee > admin)      |
| `mentorProfile`                | Full mentor profile data (if the user is a mentor)   |
| `isAdmin` / `isMentor` / `isMentee` | Role convenience flags                         |
| `isMentorWithIncompleteProfile`| Mentor whose verification is `IN_PROGRESS`           |
| `signIn` / `signOut` / `refreshUserData` | Auth action methods                      |

### 5.4 Session API

- **`GET /api/auth/session-with-roles`** — Returns session + user roles + mentor profile in a single request (used by the AuthContext).

---

## 6. Database Schema (Drizzle ORM + PostgreSQL)

All schemas are defined in `lib/db/schema/` and use Drizzle ORM with a direct PostgreSQL connection.

### 6.1 Core Tables

#### `users`
| Column          | Type      | Notes                          |
| --------------- | --------- | ------------------------------ |
| `id`            | text (PK) | Primary key                    |
| `email`         | text      | Unique, required               |
| `email_verified`| boolean   | Default: false                 |
| `name`          | text      |                                |
| `image`         | text      | Profile image URL              |
| `google_id`     | text      | Unique Google identifier       |
| `first_name`    | text      |                                |
| `last_name`     | text      |                                |
| `phone`         | text      |                                |
| `bio`           | text      |                                |
| `timezone`      | text      | Default: 'UTC'                 |
| `is_active`     | boolean   | Default: true                  |
| `is_blocked`    | boolean   | Default: false                 |
| `created_at`    | timestamp |                                |
| `updated_at`    | timestamp |                                |

#### `roles`
| Column        | Type      | Notes                  |
| ------------- | --------- | ---------------------- |
| `id`          | uuid (PK) |                        |
| `name`        | text      | Unique (admin, mentor, mentee) |
| `display_name`| text      | Human-readable name    |
| `description` | text      |                        |

#### `user_roles` (junction table)
| Column        | Type      | Notes                            |
| ------------- | --------- | -------------------------------- |
| `user_id`     | text (FK) | → `users.id` (cascade delete)    |
| `role_id`     | text (FK) | → `roles.id` (cascade delete)    |
| `assigned_at` | timestamp |                                  |
| `assigned_by` | text (FK) | → `users.id`                     |

Composite primary key: `(user_id, role_id)`.

### 6.2 Mentor & Mentee Tables

#### `mentors`
| Column               | Type               | Notes                                               |
| -------------------- | ------------------ | --------------------------------------------------- |
| `id`                 | uuid (PK)          |                                                     |
| `user_id`            | text (FK, unique)  | → `users.id`                                        |
| `full_name`          | text               |                                                     |
| `email`              | text               |                                                     |
| `phone`              | text               |                                                     |
| `title`              | text               | Job title                                           |
| `company`            | text               |                                                     |
| `industry`           | text               |                                                     |
| `expertise`          | text               |                                                     |
| `experience_years`   | integer            |                                                     |
| `hourly_rate`        | decimal(10,2)      | Default: hardcoded to 50.00 on apply                |
| `currency`           | text               | Default: 'USD'                                      |
| `availability`       | text               |                                                     |
| `max_mentees`        | integer            | Default: 10                                         |
| `headline`           | text               |                                                     |
| `about`              | text               | Bio / description                                   |
| `linkedin_url`       | text               |                                                     |
| `github_url`         | text               |                                                     |
| `website_url`        | text               |                                                     |
| `city`               | text               | Resolved name (not ID)                              |
| `state`              | text               | Resolved name                                       |
| `country`            | text               | Resolved name                                       |
| `profile_image_url`  | text               | Supabase Storage URL                                |
| `resume_url`         | text               | Supabase Storage URL                                |
| `verification_status`| enum               | `YET_TO_APPLY` / `IN_PROGRESS` / `VERIFIED` / `REJECTED` / `REVERIFICATION` |
| `verification_notes` | text               | Admin notes                                         |
| `is_available`       | boolean            | Default: true                                       |
| `created_at`         | timestamp          |                                                     |
| `updated_at`         | timestamp          |                                                     |

#### `mentees`
| Column                        | Type      | Notes            |
| ----------------------------- | --------- | ---------------- |
| `id`                          | uuid (PK) |                  |
| `user_id`                     | uuid (FK) | → `users.id`     |
| `current_role`                | text      |                  |
| `current_company`             | text      |                  |
| `education`                   | text      |                  |
| `career_goals`                | text      |                  |
| `interests`                   | text      |                  |
| `skills_to_learn`             | text      |                  |
| `current_skills`              | text      |                  |
| `learning_style`              | text      |                  |
| `preferred_meeting_frequency` | text      |                  |

### 6.3 Auth Tables (better-auth)

| Table                 | Purpose                                   |
| --------------------- | ----------------------------------------- |
| `auth_sessions`       | Active user sessions (token, expiry, IP)  |
| `auth_accounts`       | Linked OAuth/credential accounts          |
| `auth_verifications`  | Verification tokens (email confirm, etc.) |

### 6.4 Supporting Tables

| Table                 | Purpose                                                         |
| --------------------- | --------------------------------------------------------------- |
| `email_verifications` | OTP codes for email verification during registration            |
| `contact_submissions` | Contact form submissions (name, email, subject, message, consent)|
| `consent_events`      | GDPR consent audit log (action, source, type, IP, user agent)   |

---

## 7. API Routes

### 7.1 Auth

| Route                              | Method | Description                                                  |
| ---------------------------------- | ------ | ------------------------------------------------------------ |
| `/api/auth/[...better-auth]`       | ALL    | better-auth catch-all handler (sign-in, sign-up, OAuth, etc.)|
| `/api/auth/send-otp`               | POST   | Generate and email a 6-digit OTP for email verification      |
| `/api/auth/verify-otp`             | POST   | Verify a submitted OTP code                                  |
| `/api/auth/session-with-roles`     | GET    | Fetch current session + user roles + mentor profile           |

### 7.2 Mentors

| Route                    | Method | Description                                                      |
| ------------------------ | ------ | ---------------------------------------------------------------- |
| `/api/mentors/apply`     | POST   | Submit a full mentor application (FormData with files)            |
| `/api/mentors/status`    | GET    | Check if the current user has a mentor profile & its status       |

### 7.3 Other

| Route                         | Method | Description                                     |
| ----------------------------- | ------ | ----------------------------------------------- |
| `/api/contact`                | POST   | Submit contact form, sends notification email    |
| `/api/consents`               | POST   | Log consent events (GDPR compliance)             |
| `/api/locations/countries`    | GET    | List all countries                               |
| `/api/locations/states`       | GET    | List states by country                           |
| `/api/locations/cities`       | GET    | List cities by state                             |

---

## 8. Mentor Application Flow

This is the core user journey of the application:

```
┌─────────────┐     ┌──────────────┐     ┌────────────────────┐     ┌──────────────────┐
│  Landing    │────▸│  Sign Up /   │────▸│  Registration Form │────▸│   Dashboard      │
│  Page (/)   │     │  Sign In     │     │  (/registration)   │     │   (/dashboard)   │
└─────────────┘     └──────────────┘     └────────────────────┘     └──────────────────┘
                                                │                          │
                                                │ On submit:               │ Shows status:
                                                │ 1. Upload files          │ • YET_TO_APPLY
                                                │ 2. Create mentor record  │ • IN_PROGRESS
                                                │ 3. Assign mentor role    │ • VERIFIED
                                                │ 4. Send confirm email    │ • REJECTED
                                                │ 5. Status → IN_PROGRESS  │ • REVERIFICATION
                                                ▼                          │
                                         ┌─────────────┐                   │
                                         │ VIP Lounge  │◂──────────────────┘
                                         │(/vip-lounge)│  (auto-redirect for mentors)
                                         └─────────────┘
```

### 8.1 Registration Form Details

The registration form (`RegistrationForm.tsx`, ~1240 lines) is a comprehensive multi-step form:

1. **Step 1 — Authentication**: Email OTP verification or Google/LinkedIn OAuth sign-in.
2. **Step 2 — Personal Info**: Full name, email, phone, country/state/city (cascading selects via API).
3. **Step 3 — Professional Details**: Title, company, industry, years of experience, expertise, about/bio, LinkedIn URL, availability.
4. **Step 4 — File Uploads**: Profile picture (image preview) and resume (PDF).
5. **Step 5 — Legal Consents**: Accept Terms & Conditions, Privacy Policy, and other legal documents. Consent events are logged for GDPR compliance.
6. **Step 6 — Review & Submit**: Preview all entered data before final submission.

### 8.2 Verification Statuses

| Status            | Meaning                                         | Dashboard Action                    |
| ----------------- | ----------------------------------------------- | ----------------------------------- |
| `YET_TO_APPLY`    | Mentor record exists but form is incomplete     | Prompt to continue registration     |
| `IN_PROGRESS`     | Application submitted, under admin review       | Show "under review" message         |
| `VERIFIED`        | Approved — full platform access                 | Show "Dashboard Coming Soon" + VIP  |
| `REJECTED`        | Application denied                              | Option to update & reapply          |
| `REVERIFICATION`  | Needs profile update to maintain verified status| Prompt to update profile            |

---

## 9. Email System

Emails are sent via **Nodemailer** using a Gmail SMTP account. Defined in [`lib/emails.ts`](file:///c:/Users/Admin/sm-expert-landing-page/lib/emails.ts):

| Email                            | Trigger                        | Recipient            |
| -------------------------------- | ------------------------------ | -------------------- |
| **Application Received**         | Mentor submits application     | The mentor           |
| **Contact Form Notification**    | User submits contact form      | Team (community@, support@, admin) |
| **OTP Verification**             | User requests email OTP        | The user             |

---

## 10. Key Components

### 10.1 Layout Components

| Component          | File                          | Description                                               |
| ------------------ | ----------------------------- | --------------------------------------------------------- |
| `AppLayout`        | `app/AppLayout.tsx`           | Conditional header/footer, mentor auto-redirect            |
| `Header`           | `components/header.tsx`       | Responsive nav bar with auth state awareness               |
| `Footer`           | `components/footer.tsx`       | Site footer with links                                     |

### 10.2 Landing Page Components

| Component            | File                              | Description                          |
| -------------------- | --------------------------------- | ------------------------------------ |
| `HeroSection`        | `components/hero-section.tsx`     | Main hero with CTA to register       |
| `BenefitsSection`    | `components/benefits-section.tsx` | Benefits of becoming a mentor         |
| `TestimonialSection` | `components/testimonial-section.tsx` | Social proof from existing mentors |
| `FinalCTASection`    | `components/final-cta-section.tsx`| Final call-to-action to register      |

### 10.3 Auth Components

| Component          | File                                    | Description                               |
| ------------------ | --------------------------------------- | ----------------------------------------- |
| `SignInForm`       | `app/auth/login/LoginPageClient.tsx`    | Email/password sign-in form               |
| `SignUpForm`       | `app/auth/login/LoginPageClient.tsx`    | Email/password sign-up with name fields   |
| `LoginPageClient`  | `app/auth/login/LoginPageClient.tsx`    | Container with tabs + OAuth buttons        |

### 10.4 Dashboard Component

The [`DashboardCard`](file:///c:/Users/Admin/sm-expert-landing-page/app/dashboard/page.tsx) is a reusable card component used to render different states:
- **Not logged in** → Sign In prompt
- **Logged in but not a mentor** → "Become a Founding Mentor" CTA
- **Mentor with status** → Config-driven card based on `verificationStatus`

### 10.5 VIP Components

| Component          | File                              | Description                               |
| ------------------ | --------------------------------- | ----------------------------------------- |
| `VipInvitation`    | `components/vip/vip-invitation`   | Exclusive VIP experience for mentors      |

---

## 11. State Management

| Concern           | Solution                                              |
| ----------------- | ----------------------------------------------------- |
| **Auth state**    | `AuthContext` (React Context) + `useAuth()` hook      |
| **Server data**   | TanStack React Query (`QueryProvider`)                |
| **Mentor status** | `useMentorStatus()` hook (fetches `/api/mentors/status`) |
| **Form state**    | React Hook Form + Zod validation                      |
| **Theme**         | `next-themes` ThemeProvider                            |
| **Toasts**        | Custom `useToast()` hook with Radix Toast              |

---

## 12. Environment Variables

The application requires the following environment variables (set in `.env.local`):

| Variable                        | Purpose                                |
| ------------------------------- | -------------------------------------- |
| `DATABASE_URL`                  | PostgreSQL connection string           |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key               |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key (server-only)|
| `BETTER_AUTH_SECRET`            | Secret for better-auth sessions        |
| `GOOGLE_CLIENT_ID`              | Google OAuth client ID                 |
| `GOOGLE_CLIENT_SECRET`          | Google OAuth client secret             |
| `LINKEDIN_CLIENT_ID`            | LinkedIn OAuth client ID               |
| `LINKEDIN_CLIENT_SECRET`        | LinkedIn OAuth client secret           |
| `GMAIL_APP_USER`                | Gmail address for sending emails       |
| `GMAIL_APP_PASSWORD`            | Gmail App Password for SMTP            |

---

## 13. Development Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```
