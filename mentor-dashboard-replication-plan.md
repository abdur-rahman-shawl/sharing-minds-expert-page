# Mentor Dashboard Replication Plan

This document outlines the step-by-step plan to replicate the Mentor Dashboard from `young-minds-landing-page` to `sm-expert-landing-page`.

## Objective
Replicate the exact functionality and UI of the `young-minds` mentor dashboard, section by section. The database schemas are identical, so we will focus on porting components, hooks, and creating the necessary page routes.

## Strategy
We will tackle one section at a time. For each section, we will:
1.  **Analyze**: Check the source component in `young-minds`.
2.  **Port**: specific components and their dependencies to `sm-expert`.
3.  **Route**: Create the `page.tsx` in `app/dashboard/mentor/[section]`.
4.  **Verify**: Ensure it loads and fetches data correctly.

---

## checklist

### Phase 1: Foundation (Completed)
- [x] Basic Layout & Sidebar (`mentor-sidebar.tsx`)
- [x] Dashboard Home (`mentor-only-dashboard.tsx`)
- [x] Stats API (`dashboard-stats`)
- [x] Sessions API (`sessions`)
- [x] Messages API (`messages`)

### Phase 2: Mentees Section (`/mentees`) (Completed)
- [x] **Analyze**: `mentor-mentees.tsx`, `mentee-card.tsx`.
- [x] **Port**: Copy components to `components/mentor/dashboard`.
- [x] **Route**: Create `app/dashboard/mentor/mentees/page.tsx`.
- [x] **API**: Verify/Create `api/mentors/mentees` endpoint.

### Phase 3: Schedule Section (`/schedule`)
- [ ] **Analyze**: Review `young-minds` schedule components (likely reused from availability or a dedicated calendar view).
- [ ] **Port**: Implement the calendar view for upcoming sessions.
- [ ] **Route**: Create `app/dashboard/mentor/schedule/page.tsx`.

### Phase 4: Availability Section (`/availability`)
- [ ] **Analyze**: `mentor-availability-manager.tsx`, `weekly-schedule-editor.tsx`, `availability-exceptions.tsx`.
- [ ] **Port**: Ensure all sub-components are present and linked.
- [ ] **Route**: Create `app/dashboard/mentor/availability/page.tsx`.
- [ ] **API**: Verify `api/mentors/availability` endpoints.

### Phase 5: Messages Section (`/messages`)
- [ ] **Analyze**: `young-minds` messaging system (likely `useMessaging`, chat interface).
- [ ] **Port**: replicate the chat UI.
- [ ] **Route**: Create `app/dashboard/mentor/messages/page.tsx`.

### Phase 6: Earnings Section (`/earnings`)
- [ ] **Analyze**: `mentor-payment-gate.tsx` (or earnings specific view).
- [ ] **Port**: Replicate earnings & transaction history view.
- [ ] **Route**: Create `app/dashboard/mentor/earnings/page.tsx`.

### Phase 7: Reviews Section (`/reviews`)
- [ ] **Analyze**: Review list component.
- [ ] **Route**: Create `app/dashboard/mentor/reviews/page.tsx`.

### Phase 8: Analytics Section (`/analytics`)
- [ ] **Analyze**: `mentor-analytics-section.tsx`.
- [ ] **Port**: Ensure charts and detailed stats work.
- [ ] **Route**: Create `app/dashboard/mentor/analytics/page.tsx`.

### Phase 9: Content Section (`/content`)
- [ ] **Analyze**: `course-builder.tsx`, dialogs.
- [ ] **Port**: Ensure drag-and-drop and creation flows work.
- [ ] **Route**: Create `app/dashboard/mentor/content/page.tsx`.

### Phase 10: Profile & Settings (`/profile`, `/settings`)
- [ ] **Analyze**: `mentor-profile-edit.tsx`.
- [ ] **Port**: Ensure profile validation and upload works.
- [ ] **Route**: Create `app/dashboard/mentor/profile/page.tsx` & `settings/page.tsx`.

---

## Current Focus: Phase 3 - Schedule Section
**Goal**: Implement the Schedule page.
1. Analyze schedule components.
2. Port calendar views.
3. Create route.
