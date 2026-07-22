export type MentorApplicationOption<T extends string = string> = {
  value: T
  label: string
}

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: 'FULL_TIME', label: 'Full Time' },
  { value: 'CONSULTANT', label: 'Consultant' },
  { value: 'ENTREPRENEUR', label: 'Entrepreneur' },
  { value: 'INDEPENDENT_ADVISOR', label: 'Independent Advisor' },
  { value: 'FRACTIONAL_EXECUTIVE', label: 'Fractional Executive' },
  { value: 'INVESTOR', label: 'Investor' },
  { value: 'ACADEMIC', label: 'Academic' },
  { value: 'RETIRED_EXECUTIVE', label: 'Retired Executive' },
] as const satisfies readonly MentorApplicationOption[]

// These bands deliberately include experts below ten years and never overlap.
export const EXPERIENCE_BAND_OPTIONS = [
  { value: 'YEARS_0_2', label: '0–2 years' },
  { value: 'YEARS_3_5', label: '3–5 years' },
  { value: 'YEARS_6_9', label: '6–9 years' },
  { value: 'YEARS_10_15', label: '10–15 years' },
  { value: 'YEARS_16_20', label: '16–20 years' },
  { value: 'YEARS_21_24', label: '21–24 years' },
  { value: 'YEARS_25_PLUS', label: '25+ years' },
] as const satisfies readonly MentorApplicationOption[]

export const INDUSTRY_OPTIONS = [
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'MANUFACTURING', label: 'Manufacturing' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'REAL_ESTATE', label: 'Real Estate' },
  { value: 'MEDIA', label: 'Media' },
  { value: 'RETAIL', label: 'Retail' },
  { value: 'E_COMMERCE', label: 'E-commerce' },
  { value: 'HOSPITALITY', label: 'Hospitality' },
  { value: 'GOVERNMENT', label: 'Government' },
  { value: 'CONSULTING', label: 'Consulting' },
  { value: 'ENERGY', label: 'Energy' },
  { value: 'LOGISTICS', label: 'Logistics' },
  { value: 'LEGAL', label: 'Legal' },
  { value: 'HUMAN_RESOURCES', label: 'Human Resources' },
  { value: 'OTHER', label: 'Other' },
] as const satisfies readonly MentorApplicationOption[]

export const EXPERTISE_OPTIONS = [
  { value: 'LEADERSHIP', label: 'Leadership' },
  { value: 'BUSINESS_STRATEGY', label: 'Business Strategy' },
  { value: 'SALES', label: 'Sales' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'FINANCE', label: 'Finance' },
  { value: 'HUMAN_RESOURCES', label: 'HR' },
  { value: 'TALENT_ACQUISITION', label: 'Talent Acquisition' },
  { value: 'PRODUCT', label: 'Product' },
  { value: 'TECHNOLOGY', label: 'Technology' },
  { value: 'ARTIFICIAL_INTELLIGENCE', label: 'AI' },
  { value: 'STARTUP_GROWTH', label: 'Startup Growth' },
  { value: 'FUNDRAISING', label: 'Fundraising' },
  { value: 'OPERATIONS', label: 'Operations' },
  { value: 'SUPPLY_CHAIN', label: 'Supply Chain' },
  { value: 'MANUFACTURING', label: 'Manufacturing' },
  { value: 'BRANDING', label: 'Branding' },
  { value: 'DIGITAL_MARKETING', label: 'Digital Marketing' },
  { value: 'CUSTOMER_SUCCESS', label: 'Customer Success' },
  { value: 'CAREER_GROWTH', label: 'Career Growth' },
  { value: 'STUDY_ABROAD', label: 'Study Abroad' },
  { value: 'EXECUTIVE_COACHING', label: 'Executive Coaching' },
  { value: 'PUBLIC_SPEAKING', label: 'Public Speaking' },
  { value: 'PERSONAL_BRANDING', label: 'Personal Branding' },
  { value: 'LEGAL', label: 'Legal' },
  { value: 'ESG', label: 'ESG' },
  { value: 'INNOVATION', label: 'Innovation' },
  { value: 'DATA_ANALYTICS', label: 'Data Analytics' },
  { value: 'CYBERSECURITY', label: 'Cybersecurity' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'OTHER', label: 'Other' },
] as const satisfies readonly MentorApplicationOption[]

export const CREDIBILITY_SIGNAL_OPTIONS = [
  { value: 'LED_COMPANY', label: 'Led a company' },
  { value: 'FOUNDED_STARTUP', label: 'Founded a startup' },
  { value: 'BUILT_BUSINESS', label: 'Built a business' },
  { value: 'MANAGED_LARGE_TEAMS', label: 'Managed large teams' },
  { value: 'RAISED_INVESTMENT', label: 'Raised investment' },
  { value: 'PUBLISHED_BOOKS', label: 'Published books' },
  { value: 'PUBLISHED_ARTICLES', label: 'Published articles' },
  { value: 'SPOKEN_AT_CONFERENCES', label: 'Spoken at conferences' },
  { value: 'FEATURED_IN_MEDIA', label: 'Featured in media' },
  { value: 'BOARD_MEMBER', label: 'Board member' },
  { value: 'ADVISOR', label: 'Advisor' },
  { value: 'CONSULTANT', label: 'Consultant' },
  { value: 'TRAINER', label: 'Trainer' },
  { value: 'COACH', label: 'Coach' },
] as const satisfies readonly MentorApplicationOption[]

export const SERVICE_INTEREST_OPTIONS = [
  { value: 'CAREER_MENTORING', label: 'Career Mentoring' },
  { value: 'STARTUP_ADVISORY', label: 'Startup Advisory' },
  { value: 'LEADERSHIP_COACHING', label: 'Leadership Coaching' },
  { value: 'BUSINESS_CONSULTING', label: 'Business Consulting' },
  { value: 'MOCK_INTERVIEWS', label: 'Mock Interviews' },
  { value: 'RESUME_REVIEW', label: 'Resume Review' },
  { value: 'EXECUTIVE_COACHING', label: 'Executive Coaching' },
  { value: 'SPEAKING_ENGAGEMENTS', label: 'Speaking Engagements' },
  { value: 'WORKSHOPS', label: 'Workshops' },
  { value: 'CORPORATE_CONSULTING', label: 'Corporate Consulting' },
  { value: 'FRACTIONAL_CXO', label: 'Fractional CXO' },
] as const satisfies readonly MentorApplicationOption[]

export const SESSION_MODE_OPTIONS = [
  { value: 'ONLINE', label: 'Online' },
  { value: 'OFFLINE', label: 'Offline' },
  { value: 'BOTH', label: 'Both' },
] as const satisfies readonly MentorApplicationOption[]

export const WEEKLY_AVAILABILITY_OPTIONS = [
  { value: 'HOURS_1_2', label: '1–2 hours' },
  { value: 'HOURS_3_5', label: '3–5 hours' },
  { value: 'HOURS_6_10', label: '6–10 hours' },
  { value: 'MORE_THAN_10_HOURS', label: 'More than 10 hours' },
] as const satisfies readonly MentorApplicationOption[]

export const LANGUAGE_OPTIONS = [
  { value: 'ENGLISH', label: 'English' },
  { value: 'HINDI', label: 'Hindi' },
  { value: 'BENGALI', label: 'Bengali' },
  { value: 'TELUGU', label: 'Telugu' },
  { value: 'MARATHI', label: 'Marathi' },
  { value: 'TAMIL', label: 'Tamil' },
  { value: 'GUJARATI', label: 'Gujarati' },
  { value: 'URDU', label: 'Urdu' },
  { value: 'KANNADA', label: 'Kannada' },
  { value: 'MALAYALAM', label: 'Malayalam' },
  { value: 'PUNJABI', label: 'Punjabi' },
  { value: 'ARABIC', label: 'Arabic' },
  { value: 'FRENCH', label: 'French' },
  { value: 'GERMAN', label: 'German' },
  { value: 'SPANISH', label: 'Spanish' },
  { value: 'MANDARIN', label: 'Mandarin' },
  { value: 'OTHER', label: 'Other' },
] as const satisfies readonly MentorApplicationOption[]

export function optionValues<const T extends readonly MentorApplicationOption[]>(
  options: T,
): [T[number]['value'], ...T[number]['value'][]] {
  return options.map(option => option.value) as [
    T[number]['value'],
    ...T[number]['value'][],
  ]
}

export function optionLabel(
  options: readonly MentorApplicationOption[],
  value: string,
): string {
  return options.find(option => option.value === value)?.label || value
}
