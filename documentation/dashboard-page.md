# Dashboard Page Implementation

> Status-aware dashboard page that handles all mentor verification states.

---

## Overview

The `/dashboard` page serves as the central hub for mentors. It displays different content based on the user's authentication and verification status.

---

## User States Handled

| State | Condition | UI Response |
|-------|-----------|-------------|
| **Loading** | Session/mentor data loading | Spinner with "Loading your dashboard..." |
| **Not Logged In** | `!session?.user` | Login prompt with redirect to `/auth/login` |
| **Not a Mentor** | `!isMentor \|\| !mentor` | "Become a Founding Mentor" invitation |
| **YET_TO_APPLY** | Mentor record exists, incomplete | "Complete Your Registration" prompt |
| **IN_PROGRESS** | Application submitted | "Under Review" status with timeline |
| **VERIFIED** | Approved mentor | "Dashboard Coming Soon" + VIP badge |
| **REJECTED** | Application denied | Rejection notice with reapply option |
| **REVERIFICATION** | Needs profile update | "Update Required" prompt |

---

## File Location

```
app/
└── dashboard/
    └── page.tsx
```

---

## Dependencies

- `@/lib/auth-client` - `useSession()` for authentication
- `@/hooks/use-mentor-status` - `useMentorStatus()` for mentor data
- `@/components/ui/button` - Button component
- `next/image` - VIP badge image
- `lucide-react` - Status icons

---

## Key Components

### `DashboardPage`
Main page component that:
1. Fetches session and mentor status
2. Determines which UI state to render
3. Passes config to `DashboardCard`

### `DashboardCard`
Reusable card component with:
- Icon with colored background
- Optional VIP badge
- Mentor info display
- Title and description
- Primary/secondary action buttons

---

## Status Configuration

Each status has a configuration object:

```typescript
interface StatusConfig {
  icon: React.ReactNode      // Lucide icon
  iconBg: string            // Tailwind bg class
  title: string             // Main heading
  description: string       // Body text
  subdescription?: string   // Additional context
  primaryAction?: {         // Main CTA
    label: string
    href: string
    variant?: 'default' | 'outline'
  }
  secondaryAction?: {       // Secondary link
    label: string
    href: string
  }
  showVipBadge?: boolean    // Show VIP badge (VERIFIED only)
}
```

---

## Styling

- **Background**: Dark gradient (`from-slate-950 via-slate-900 to-black`)
- **Card**: Glassmorphic with glow effect
- **Primary Button**: Amber gradient for CTAs
- **Icons**: Status-specific colors (amber, blue, emerald, red, orange)

### Header Offset Pattern

The dashboard uses negative margins to extend the dark background behind the header:

```tsx
className="mt-[-80px] sm:mt-[-96px] pt-20 sm:pt-24"
```

This offsets the `pt-20 sm:pt-24` padding added by `AppLayout` and ensures no white gap appears between the header and the dark gradient background.

---

## Related Files

- [Mentor Schema](file:///c:/Users/Admin/sm-expert-landing-page/lib/db/schema/mentors.ts) - Verification status enum
- [useMentorStatus Hook](file:///c:/Users/Admin/sm-expert-landing-page/hooks/use-mentor-status.ts) - Mentor data fetching
- [VIP Lounge](file:///c:/Users/Admin/sm-expert-landing-page/app/vip-lounge/page.tsx) - Related VIP page

---

*Created: January 2026*
