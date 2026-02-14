# Dashboard Page Implementation

> Full sidebar-based mentor dashboard, restricted to **verified mentors only**. Uses Next.js nested layouts with 12 sections organized in a tiered early-access model.

---

## Overview

The `/dashboard` is built as a sidebar-based application shell. It uses Next.js nested routing — a shared `layout.tsx` renders the sidebar and access control gate, while each section is a sub-route (`/dashboard/mentees`, `/dashboard/profile`, etc.).

Since this is a **pre-launch early-access** site, sections are organized into 3 tiers:
- **Tier 1 (Functional):** Dashboard overview, Profile
- **Tier 2 (Visual placeholder):** My Mentees, Schedule, Availability
- **Tier 3 (Coming Soon):** Messages, Subscription, Earnings, Reviews, Analytics, My Content, Settings

---

## Access Control Flow

```
User visits /dashboard/*
        │
        ▼
   ┌─────────┐     No     ┌──────────────────────┐
   │ Loading? │──────────▸ │ Signed in?           │
   └────┬─────┘            └──────────────────────┘
        │ Yes                      │ No
    Show spinner          Redirect → /auth/login
                                   │ Yes
                                   ▼
                          ┌──────────────────────┐
                          │ Has mentor record?    │
                          └──────────────────────┘
                                   │ No → /registration
                                   │ Yes
                                   ▼
                          ┌──────────────────────┐
                          │ Status === VERIFIED?  │
                          └──────────────────────┘
                                   │ No → /vip-lounge
                                   │ Yes
                                   ▼
                            ✅ Render Dashboard
```

This gate lives in `layout.tsx` so **all sub-routes are automatically protected**.

`AppLayout.tsx` was also updated:
- Hides global header/footer on `/dashboard` routes (sidebar replaces them)
- Exempts verified mentors on `/dashboard` from the VIP auto-redirect

---

## File Structure

```
app/dashboard/
├── layout.tsx              # Shared sidebar layout + access control
├── page.tsx                # Overview (Tier 1)
├── mentees/page.tsx        # My Mentees (Tier 2)
├── schedule/page.tsx       # Schedule (Tier 2)
├── availability/page.tsx   # Availability (Tier 2)
├── messages/page.tsx       # Messages (Tier 3)
├── subscription/page.tsx   # Subscription (Tier 3)
├── earnings/page.tsx       # Earnings (Tier 3)
├── reviews/page.tsx        # Reviews (Tier 3)
├── analytics/page.tsx      # Analytics (Tier 3)
├── content/page.tsx        # My Content (Tier 3)
├── profile/page.tsx        # Profile (Tier 1)
├── settings/page.tsx       # Settings (Tier 3)

components/dashboard/
├── dashboard-sidebar.tsx   # Sidebar with nav + profile header
├── coming-soon-card.tsx    # Reusable Tier 3 placeholder
├── stat-card.tsx           # Reusable stat card for overview
```

---

## Routes

| Route | Section | Tier | Description |
|---|---|---|---|
| `/dashboard` | Dashboard | 1 | Welcome banner, stat cards, quick actions |
| `/dashboard/mentees` | My Mentees | 2 | Visual placeholder with user illustrations |
| `/dashboard/schedule` | Schedule | 2 | Google Calendar-style weekly grid (empty) |
| `/dashboard/availability` | Availability | 2 | Weekly time-slot table (visual only) |
| `/dashboard/messages` | Messages | 3 | Coming soon card |
| `/dashboard/subscription` | Subscription | 3 | Coming soon + founding mentor pricing teaser |
| `/dashboard/earnings` | Earnings | 3 | Coming soon card |
| `/dashboard/reviews` | Reviews | 3 | Coming soon card |
| `/dashboard/analytics` | Analytics | 3 | Coming soon + AI insights teaser |
| `/dashboard/content` | My Content | 3 | Coming soon card |
| `/dashboard/profile` | Profile | 1 | View mentor profile with all fields |
| `/dashboard/settings` | Settings | 3 | Coming soon card |

---

## Key Components

### `layout.tsx` — Shared Dashboard Layout

- **Access control gate** via `useEffect` — redirects non-verified users
- Wraps all sub-routes with `SidebarProvider` + `SidebarInset`
- Renders top bar with `SidebarTrigger` + section title (derived from pathname)
- Uses the existing `shadcn/ui` Sidebar component system

### `dashboard-sidebar.tsx` — Sidebar Navigation

- **Header:** Mentor avatar (initials fallback) + full name + "Founding Mentor" badge
- **Navigation:** 12 items with icons, active state highlighting (indigo), badge support (Messages)
- **Footer:** Back to Home + Sign Out buttons
- Dark theme (slate-900) matching the app aesthetic

### `coming-soon-card.tsx` — Tier 3 Placeholder

Reusable component with: section icon, title, description, "Coming Soon" badge, optional teaser text.

### `stat-card.tsx` — Overview Stats

Small metric card with: icon, value, label, optional subtitle. Used in the overview grid.

---

## Dependencies

- `@/components/ui/sidebar` — SidebarProvider, Sidebar, SidebarInset, SidebarTrigger, etc.
- `@/components/ui/avatar` — Avatar, AvatarFallback, AvatarImage
- `@/components/ui/separator` — Separator
- `@/lib/auth-client` — `useSession()` for authentication
- `@/hooks/use-mentor-status` — `useMentorStatus()` for mentor data
- `@/contexts/auth-context` — `useAuth()` for sign-out
- `lucide-react` — All section icons

---

## Styling

- **Background:** `bg-slate-950` across all dashboard pages
- **Sidebar:** `bg-slate-900` with `border-slate-800` separator
- **Active nav item:** `bg-indigo-600/20` with indigo text and border
- **Cards:** `bg-slate-900/60` with `border-slate-800`
- **Accents:** Amber (founding mentor), Indigo (active/links), Emerald (verified)

### Chrome Handling

The global `AppLayout` hides the header and footer on dashboard routes:
```tsx
const hideChrome = isAuthPage || isVipPage || isDashboardPage
```

---

## Related Files

- [AppLayout.tsx](file:///c:/Users/Admin/sm-expert-landing-page/app/AppLayout.tsx) — Global layout (hides chrome + VIP redirect exemption)
- [Mentor Schema](file:///c:/Users/Admin/sm-expert-landing-page/lib/db/schema/mentors.ts) — Verification status enum + mentor fields
- [useMentorStatus](file:///c:/Users/Admin/sm-expert-landing-page/hooks/use-mentor-status.ts) — Mentor data fetching hook
- [Sidebar UI](file:///c:/Users/Admin/sm-expert-landing-page/components/ui/sidebar.tsx) — shadcn/ui sidebar primitives

---

*Updated: February 2026*
