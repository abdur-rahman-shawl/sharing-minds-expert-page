# VIP Badge Feature

> Display VIP badge for registered mentors in the hero section.

---

## Overview

Added VIP badge display in the hero section for users who have registered as mentors. The badge provides visual recognition of their founding mentor status.

---

## Implementation

### Location
[hero-section.tsx](file:///c:/Users/Admin/sm-expert-landing-page/components/hero-section.tsx)

### Change Made

Added VIP badge image next to the mentor info card when `isMentor` is true:

```tsx
<Image
  src="/vip-access.jpeg"
  alt="VIP Access"
  width={40}
  height={40}
  className="h-10 w-10 rounded-full border border-amber-200/60 object-cover shadow-md shadow-amber-500/30"
/>
```

### Display Logic

The VIP badge appears when:
1. User is logged in (`session?.user` exists)
2. User is a registered mentor (`isMentor === true`)
3. Mentor status is not loading (`!mentorStatusLoading`)

---

## Visual Design

| Property | Value |
|----------|-------|
| **Size** | 40x40px |
| **Shape** | Circular (rounded-full) |
| **Border** | 1px amber with 60% opacity |
| **Shadow** | Medium amber glow |
| **Image** | `/vip-access.jpeg` |

---

## Related Files

- **VIP Badge Image**: `/public/vip-access.jpeg`
- **VIP Lounge Page**: Uses same badge styling at larger size
- **Dashboard Page**: Shows badge for VERIFIED mentors

---

## Badge Appearances

| Location | Size | Condition |
|----------|------|-----------|
| Hero Section | 40x40px | `isMentor === true` |
| VIP Lounge Header | 72x72px | Always (page is gated) |
| VIP Lounge Content | Fill container | Always |
| Dashboard | 56x56px | `verificationStatus === 'VERIFIED'` |

---

*Added: January 2026*
