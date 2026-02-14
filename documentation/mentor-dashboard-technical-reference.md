# Mentor Dashboard Replication: Technical Documentation

This document provides a low-level, detailed breakdown of all changes made to replicate the Mentor Dashboard in `sm-expert-landing-page`. It covers architectural changes, new API routes, database schema integration, component implementation, and security measures.

## 1. Architecture & Routing

### New Route Structure
We implemented a dedicated route group for the mentor dashboard to isolate its layout and logic.

*   **Logic Root**: `app/dashboard/mentor/layout.tsx`
    *   **Protection**: Implements a client-side check using `useMentorStatus`.
    *   **Redirects**: Automatically redirects unverified or non-mentor users to `/dashboard`.
    *   **Layout**: Wraps all child pages with the `SidebarProvider` and `MentorSidebar`.

*   **Pages Created**:
    *   `/dashboard/mentor/page.tsx`: The main statistics dashboard (Active Mentees, Earnings, Recent Activity).
    *   `/dashboard/mentor/profile/page.tsx`: Full profile editor (Personal, Social, Professional, Rates).
    *   `/dashboard/mentor/availability/page.tsx`: Weekly schedule and exception management.
    *   `/dashboard/mentor/content/page.tsx`: Course builder and resource management.

### Main Navigation Updates
*   **`components/header.tsx`**: Added a "Dashboard" link for easy access.
*   **`app/AppLayout.tsx`**: Removed legacy automatic redirects to `/vip-lounge` to prevent routing loops.
*   **`app/dashboard/page.tsx`**: Updated to serve as a smart "router":
    *   **Verified Mentors**: auto-redirected to `/dashboard/mentor`.
    *   **Applicants/Others**: see their specific status card (e.g., "Application Under Review").

---

## 2. API Implementation (`app/api/mentors/*`)

We created a suite of REST endpoints to serve the dashboard.

### Dashboard Stats
*   **Endpoint**: `GET /api/mentors/dashboard-stats`
*   **Logic**: Fetches parallel data counts:
    *   `sessions` (upcoming, completed, this month, last month).
    *   `mentoringRelationships` (active, total).
    *   `reviews` (average rating, total count).
    *   `messages` (unread count).
*   **Fixes**: Corrected schema mapping (replaced `startTime` → `scheduledAt`).

### Sessions
*   **Endpoint**: `GET /api/mentors/sessions?limit=5`
*   **Logic**: Returns the most recent sessions for the logged-in mentor using `scheduledAt` sort.
*   **Schema**: Joins `sessions` with `users` (mentee) to return mentee details (name, image, email).

### Messages
*   **Endpoint**: `GET /api/mentors/messages?limit=5`
*   **Logic**: Returns the most recent unread messages for the mentor.
*   **Schema**: Joins `messages` with `users` (sender).

### Reviews
*   **Endpoint**: `GET /api/mentors/reviews/pending`
*   **Logic**: Validates valid session but missing review record. (Currently returning empty array placeholder).

---

## 3. Database Schema Integration (`lib/db/schema/*`)

We synchronized the Drizzle schema definitions with the shared Supabase database.

*   **`sessions.ts`**: Validated fields `scheduledAt`, `endedAt`, `status`, `meetingUrl`.
*   **`mentoring-relationships.ts`**: Confirmed `status`, `mentorId`, `menteeId` relationships.
*   **`reviews.ts`**: Confirmed `finalScore`, `reviewerRole` fields.
*   **`mentor-content.ts`**: Verified structure for `courses`, `modules`, `sections`, `items` (JSONB content).

---

## 4. Component Implementation

### Sidebar (`components/mentor/sidebars/mentor-sidebar.tsx`)
*   **Features**:
    *   Dynamic navigation based on active path.
    *   Embedded "User Card" with avatar and mini-stats.
    *   Logout functionality.

### Dashboard Widgets (`components/mentor/dashboard/*`)
*   **`mentor-only-dashboard.tsx`**: The container for the main view.
*   **`mentor-stats.tsx`**: Reusable card component for displaying individual metrics.
*   **`recent-activity.tsx`**: Lists upcoming sessions and messages.

### Profile Editor (`components/mentor/dashboard/mentor-profile-edit.tsx`)
*   **Form Management**: Uses `react-hook-form` and `zod` for validation.
*   **Sections**:
    *   **Header**: Banner & Profile Image upload.
    *   **Personal**: Name, Title, Bio.
    *   **Social**: LinkedIn, GitHub, Website.
    *   **Professional**: Company, Experience, Industry.
    *   **Mentorship**: Hourly Rate, Currency, Availability boolean.
*   **Note**: File upload is currently client-side simulated pending final Bucket policy.

### Course Builder (`components/mentor/content/course-builder.tsx`)
*   **Drag & Drop**: Implemented using `@dnd-kit` for reordering modules and lessons.
*   **Structure**: Supports 3-level hierarchy (Course -> Module -> Lesson).
*   **Content Types**: Supports Video, Text, and Quiz item creation.

### Availability Manager (`components/mentor/availability/*`)
*   **`schedule-editor.tsx`**: a 7-day weekly grid to set recurring hours.
*   **`date-exceptions.tsx`**: overrides for specific dates (holidays/leave).

---

## 5. Security & Hooks

*   **`hooks/use-mentor-dashboard.ts`**:
    *   Custom React Query hooks (`useMentorDashboardStats`, `useMentorRecentSessions`) to manage data fetching and caching.
    *   Implements `refetchInterval` (60s) for near-real-time updates.
*   **`hooks/use-mentor-status.ts`**:
    *   Centralized logic to determine if a user is a verified mentor.
    *   Used in `layout.tsx` for route protection.

## 6. Dependencies Added
*   `framer-motion`: For sidebar animations and dashboard transitions.
*   `lucide-react`: For all UI icons.
*   `date-fns`: For date formatting in sessions and schedules.
*   `@dnd-kit/core`: For the course builder drag-and-drop.

## 7. Next Steps for Developer
1.  **File Storage**: Configure Supabase Storage buckets for `avatars` and `banners`. Update `lib/storage.ts` with real upload logic.
2.  **Email Triggers**: Hook up the `reschedule_requests` table triggers to the email service.
3.  **Real Payments**: Replace the placeholder `monthlyEarnings` in `dashboard-stats` with a real aggregation from the `transactions` table.
