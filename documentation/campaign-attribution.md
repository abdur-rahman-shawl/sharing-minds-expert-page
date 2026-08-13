# Campaign attribution and expert-application insights

Last updated: 27 July 2026

## Purpose

SharingMinds records first-party acquisition visits and connects one acquisition
visit to an expert application when that application is first created. The link
is retained through draft, submission, review, and decision states so campaign
performance always reflects the application's current outcome.

The existing `mentor_applications.source` column remains an identity-entry
classification (`GUEST`, `AUTHENTICATED`, or `MIGRATED`). Marketing source is
stored separately in `campaign_visits`.

## Campaign link format

Use standard lowercase UTM values without spaces:

```text
https://your-domain.com/verified-experts
  ?utm_source=linkedin
  &utm_medium=paid_social
  &utm_campaign=founding_experts_2026_q3
  &utm_content=founder_video_01
  &utm_term=leadership
```

Recommended controlled values:

- `utm_source`: platform or partner, such as `linkedin`, `google`, or
  `founder_newsletter`.
- `utm_medium`: channel type, such as `paid_social`, `cpc`, `email`, `partner`,
  or `organic`.
- `utm_campaign`: stable campaign identifier including the initiative and
  period.
- `utm_content`: creative, placement, or ad-set variation.
- `utm_term`: optional keyword or targeting label.

Never place names, email addresses, phone numbers, or other personal information
in UTM parameters.

## Attribution rules

1. A visit is a 30-minute first-party session. Page navigation extends it.
2. A new explicit campaign or external referral starts a new acquisition visit.
3. Direct navigation does not overwrite a non-direct touch for 30 days.
4. The active non-direct touch is linked when OTP verification creates the
   application. The authenticated-application path follows the same rule.
5. An existing application is never re-attributed. Historical applications
   without a link remain `UNATTRIBUTED`.
6. Cookie identifiers are random, signed, `HttpOnly`, `SameSite=Lax`, and
   `Secure` in production. They contain no applicant identity.

Supported click-id inference includes Google (`gclid`, `gbraid`, `wbraid`),
Meta (`fbclid`), Microsoft (`msclkid`), LinkedIn (`li_fat_id`), and TikTok
(`ttclid`). UTMs remain the authoritative source for campaign and creative
names.

## Funnel definitions

- **Visits:** `campaign_visits` rows whose `started_at` falls in the selected
  acquisition range.
- **Unique visitors:** distinct signed visitor identifiers.
- **Application views:** visits that reached `/verified-experts`.
- **OTP starts:** visits that requested an application-access OTP.
- **Applications:** all applications linked to those acquisition visits,
  including `DRAFT`.
- **Submitted:** linked applications whose `submitted_at` is not null,
  regardless of their current review status.
- **Approved:** linked applications whose current status is `APPROVED`.

The campaign comparison is a visit cohort: the date range selects acquisition
visits, then follows attributed applications to their current status even when
submission or approval happened later.

## Reporting

The administrator-only `/reports/expert-applications` page supports grouping by
source, campaign, or creative. It displays visits, application views, OTP
starts, applications, drafts, submissions, approvals, and conversion rates.

The aggregate-only `/campaign-stats` dashboard can be made publicly accessible
with `PUBLIC_CAMPAIGN_STATS_ENABLED=true`. It accepts start and end date-times
in IST, refreshes once per minute while visible, and supports comparison by:

- Source and medium (`utm_source` + `utm_medium`)
- Campaign (`utm_campaign`)
- Ad variation (`utm_content`)

The public dashboard calls:

```text
GET /api/public/campaign-performance
  ?startAt=2026-07-20T00:00
  &endAt=2026-07-27T23:59
  &groupBy=content
```

The start is inclusive, the end is exclusive, and public ranges are limited to
90 days. The endpoint is unauthenticated while the public flag is enabled, but
returns aggregate KPIs only. It never returns applicant identity, contact
details, application content, review notes, visit identifiers, click IDs, or
cookie identifiers. Responses are not stored and requests are rate limited.
The route is excluded from attribution capture so viewing the dashboard does
not inflate acquisition traffic.

The Excel workbook contains:

- `Summary`
- `Applications`, including marketing attribution columns
- `Status Guide`
- `Campaign Performance`

## Rollout

1. Apply `documentation/migrations/005-campaign-attribution.sql`.
2. Configure a dedicated `CAMPAIGN_ATTRIBUTION_SECRET` of at least 32
   characters.
3. Deploy with `CAMPAIGN_ATTRIBUTION_ENABLED=false`.
4. Verify the table, foreign key, indexes, and administrator access.
5. Set `CAMPAIGN_ATTRIBUTION_ENABLED=true`.
6. Set `PUBLIC_CAMPAIGN_STATS_ENABLED=true` only when aggregate KPIs may be
   viewed by anyone who knows the dashboard or API URL.
7. Run a tagged test visit through OTP verification, draft save, and submission.
8. Verify `/campaign-stats` in source, campaign, and ad-variation views.
9. Record the enablement timestamp; earlier applications remain explicitly
   unattributed.
