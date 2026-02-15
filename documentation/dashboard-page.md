# Dashboard Page Implementation

> Full sidebar-based mentor dashboard, restricted to **verified mentors only**. Uses Next.js nested layouts with 12 sections organized in a tiered early-access model. Supports **dark and light mode** via `next-themes` with a toggle in the dashboard header.

---

## Overview

The `/dashboard` is built as a sidebar-based application shell. It uses Next.js nested routing — a shared `layout.tsx` renders the sidebar and access control gate, while each section is a sub-route (`/dashboard/mentees`, `/dashboard/profile`, etc.).

Since this is a **pre-launch early-access** site, sections are organized into 3 tiers:
- **Tier 1 (Functional):** Dashboard overview, Profile
- **Tier 2 (Visual preview):** My Mentees, Schedule, Availability, Earnings, Reviews, Analytics, Messages, Subscription
- **Tier 3 (Coming Soon):** My Content, Settings

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
- Hides global header/footer on `/dashboard` routes (dashboard has its own header)
- Exempts verified mentors on `/dashboard` from the VIP auto-redirect

---

## File Structure

```
app/dashboard/
├── layout.tsx              # Dashboard header + sidebar layout + access control
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
├── dashboard-sidebar.tsx   # Sidebar with nav links
├── coming-soon-card.tsx    # Reusable Tier 2/3 placeholder
├── stat-card.tsx           # Reusable stat card for overview
├── mentor-profile-edit.tsx # Full mentor profile editing form
```

---

## Routes

| Route | Section | Tier | Description |
|---|---|---|---|
| `/dashboard` | Dashboard | 1 | Welcome banner, stat cards, quick actions |
| `/dashboard/mentees` | My Mentees | 2 | Visual placeholder with user illustrations |
| `/dashboard/schedule` | Schedule | 2 | Google Calendar-style weekly grid (empty) |
| `/dashboard/availability` | Availability | 2 | Weekly time-slot table (visual only) |
| `/dashboard/earnings` | Earnings | 2 | Bar chart, summary cards, transactions table |
| `/dashboard/reviews` | Reviews | 2 | Star breakdown, rating cards, satisfaction metrics |
| `/dashboard/analytics` | Analytics | 2 | Metric cards, bar chart, donut chart, skill bars |
| `/dashboard/messages` | Messages | 2 | Split-pane chat UI with conversation list |
| `/dashboard/subscription` | Subscription | 2 | 3-tier plan cards with feature lists |
| `/dashboard/content` | My Content | 3 | Coming soon card |
| `/dashboard/profile` | Profile | 1 | View mentor profile with all fields |
| `/dashboard/settings` | Settings | 3 | Coming soon card |

---

## Key Components

### `layout.tsx` — Dashboard Header + Shared Layout

- **Access control gate** via `useEffect` — redirects non-verified users
- **Standalone dashboard header** (sticky, full-width, `h-[5.5rem]`) containing:
  - SharingMinds logo (links to home)
  - Section title (derived from pathname)
  - Home link
  - **Dark/light mode toggle** (Sun/Moon icons via `useTheme` from `next-themes`)
  - User avatar + name
  - Sign out button
- Wraps all sub-routes with `SidebarProvider` + `SidebarInset` below the header
- Uses the existing `shadcn/ui` Sidebar component system

### `dashboard-sidebar.tsx` — Sidebar Navigation

- **Header:** Mentor avatar (initials fallback) + full name + "Founding Mentor" badge
- **Navigation:** 12 items with icons, active state highlighting (indigo), badge support (Messages)
- Theme-aware styling with `dark:` prefix classes

### `coming-soon-card.tsx` — Tier 2/3 Placeholder

Reusable component with: section icon, title, description, "Coming Soon" badge, optional teaser text. Theme-aware.

### `stat-card.tsx` — Overview Stats

Small metric card with: icon, value, label, optional subtitle. Used in the overview grid. Theme-aware.

### `mentor-profile-edit.tsx` — Profile Editor

Full mentor profile editing component with banner/avatar uploads, form sections, resume upload, and inline toggle. Theme-aware with light and dark mode support.

---

## Dependencies

- `@/components/ui/sidebar` — SidebarProvider, Sidebar, SidebarInset, etc.
- `@/components/ui/avatar` — Avatar, AvatarFallback, AvatarImage
- `@/components/ui/separator` — Separator
- `@/lib/auth-client` — `useSession()`, `signOut()` for authentication
- `@/hooks/use-mentor-status` — `useMentorStatus()` for mentor data
- `next-themes` — `useTheme()` for dark/light mode toggle
- `next/image` — Logo rendering in header
- `lucide-react` — All section icons (including `Sun`, `Moon` for theme toggle)

---

## Styling & Theming

The dashboard uses **Tailwind's `dark:` variant** for theme-aware styling, controlled by `next-themes`.

### Theme Pattern

All components follow the pattern: `className="bg-gray-50 dark:bg-slate-900"`

| Element | Light Mode | Dark Mode |
|---|---|---|
| **Page background** | `bg-gray-50` | `bg-slate-950` |
| **Header** | `bg-white` | `bg-slate-950` |
| **Sidebar** | `bg-white` | `bg-slate-900` |
| **Cards** | `bg-gray-50` | `bg-slate-900/60` |
| **Borders** | `border-gray-200` | `border-slate-800` |
| **Primary text** | `text-gray-900` | `text-white` |
| **Secondary text** | `text-gray-600` | `text-slate-400` |
| **Active nav item** | `bg-indigo-50` | `bg-indigo-600/20` |
| **Accents** | Amber (founding mentor), Indigo (active/links), Emerald (verified) | Same palette with adjusted opacity |

### Chrome Handling

The global `AppLayout` hides the header and footer on dashboard routes:
```tsx
const hideChrome = isAuthPage || isVipPage || isDashboardPage
```
The dashboard renders its **own standalone header** (inside `layout.tsx`) with the logo, theme toggle, user info, and sign-out. This replaces the global header.

### Theme Toggle

The dark/light mode toggle is in the dashboard header (layout.tsx):
```tsx
const { resolvedTheme, setTheme } = useTheme()
// ...
<button onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
    {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
</button>
```

---

## Related Files

- [AppLayout.tsx](file:///c:/Users/Admin/sm-expert-landing-page/app/AppLayout.tsx) — Global layout (hides chrome + VIP redirect exemption)
- [globals.css](file:///c:/Users/Admin/sm-expert-landing-page/app/globals.css) — CSS variables for dark mode (`.dark` block)
- [Mentor Schema](file:///c:/Users/Admin/sm-expert-landing-page/lib/db/schema/mentors.ts) — Verification status enum + mentor fields
- [useMentorStatus](file:///c:/Users/Admin/sm-expert-landing-page/hooks/use-mentor-status.ts) — Mentor data fetching hook
- [Sidebar UI](file:///c:/Users/Admin/sm-expert-landing-page/components/ui/sidebar.tsx) — shadcn/ui sidebar primitives

---

*Updated: 15 February 2026*
