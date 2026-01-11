# Policies Page Implementation

> Legal documents page with markdown-style content formatting.

---

## Overview

The `/policies` page displays legal documents (Terms of Use, Privacy Policy, Pricing Policy, Community Conduct) with smart formatting that parses plain text content into structured, styled elements.

---

## Content Source

Legal documents are stored in:
- [legal-documents.ts](file:///c:/Users/Admin/sm-expert-landing-page/lib/legal-documents.ts)

Each document has:
```typescript
type LegalDocument = {
  id: string      // e.g., 'privacy-policy'
  label: string   // e.g., 'Privacy Policy'
  content: string // Plain text with numbered sections
}
```

---

## Content Parser

The `parseContent()` function converts plain text into structured elements:

| Element Type | Detection Pattern | Styling |
|--------------|------------------|---------|
| `section-heading` | `"1. Title"`, `"10. Title"` | Indigo numbered badge + bold heading |
| `emoji-heading` | `"1️⃣ Title"` | Emoji preserved + bold heading |
| `subtitle` | Short lines ending in "Policy", "Terms", etc. | Underlined subheading |
| `contact` | `📧 email@example.com` | Indigo box with mail icon + mailto link |
| `paragraph` | Everything else | Indented body text |

---

## Visual Design

- **Header**: Indigo gradient with document icon
- **Quick Navigation**: Pill badges linking to each document section
- **Section Numbers**: Styled indigo badges (h-7 w-7 rounded-lg)
- **Contact Emails**: Highlighted box with clickable mailto link
- **Paragraphs**: Indented under section headings for readability

---

## Available Documents

| ID | Label |
|----|-------|
| `terms-of-use` | Terms of Use |
| `privacy-policy` | Privacy Policy |
| `pricing-policy` | Pricing Policy |
| `community-conduct-policy` | Community & Conduct Policy |

---

## Page Structure

```
PoliciesPage
├── Hero Section
│   ├── Badge: "Trust & Compliance"
│   ├── Title: "Policies & Legal"
│   ├── Description
│   └── Quick Links (pills to each doc)
└── Documents Section
    └── Card (for each document)
        ├── CardHeader (icon + title + date)
        └── CardContent (parsed elements)
```

---

## Related Files

- [legal-documents.ts](file:///c:/Users/Admin/sm-expert-landing-page/lib/legal-documents.ts) - Document content storage
- [Card components](file:///c:/Users/Admin/sm-expert-landing-page/components/ui/card.tsx) - UI primitives
- [Badge component](file:///c:/Users/Admin/sm-expert-landing-page/components/ui/badge.tsx) - Quick links styling

---

*Created: January 2026*
