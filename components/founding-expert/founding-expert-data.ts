import {
  BriefcaseBusiness,
  GraduationCap,
  LockKeyhole,
  MapPin,
  Network,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  type LucideIcon,
} from "lucide-react"

export type FoundingProfileAttribute = {
  label: string
  icon: LucideIcon
}

export type FoundingExpertProfile = {
  id: string
  eyebrow: string
  title: string
  disciplines: string
  image: string
  imageAlt: string
  attributes: FoundingProfileAttribute[]
  specialisms: string[]
}

export type FoundingPathStep = {
  title: string
  description: string
  icon: LucideIcon
}

export type FoundingBenefit = {
  title: string
  description: string
  icon: LucideIcon
}

export const foundingExpertProfiles = [
  {
    id: "strategy-advisor",
    eyebrow: "Representative Expert Profile",
    title: "Senior Strategy Advisor",
    disciplines: "Strategy · Growth · Innovation · Leadership",
    image: "/founding-expert-generated-headshot.jpg",
    imageAlt: "Representative fictional senior strategy advisor",
    attributes: [
      { label: "Global", icon: MapPin },
      { label: "15+ Years Experience", icon: BriefcaseBusiness },
      { label: "Advanced Degree", icon: GraduationCap },
    ],
    specialisms: ["Strategy", "Market Entry", "M&A", "Digital Transformation"],
  },
  {
    id: "technology-transformation-executive",
    eyebrow: "Representative Expert Profile",
    title: "Technology Transformation Executive",
    disciplines: "Technology · AI · Transformation · Product",
    image: "/founding-expert-technology-headshot.jpg",
    imageAlt: "Representative fictional technology transformation executive",
    attributes: [
      { label: "Global", icon: MapPin },
      { label: "20+ Years Experience", icon: BriefcaseBusiness },
      { label: "Technology Leader", icon: Network },
    ],
    specialisms: ["AI Strategy", "Digital Platforms", "Product Innovation", "Transformation"],
  },
  {
    id: "finance-growth-advisor",
    eyebrow: "Representative Expert Profile",
    title: "Finance & Growth Advisor",
    disciplines: "Finance · Growth · Capital · Governance",
    image: "/founding-expert-finance-headshot.jpg",
    imageAlt: "Representative fictional finance and growth advisor",
    attributes: [
      { label: "Global", icon: MapPin },
      { label: "25+ Years Experience", icon: BriefcaseBusiness },
      { label: "Board Advisor", icon: ShieldCheck },
    ],
    specialisms: ["Growth Finance", "Capital Strategy", "M&A", "Governance"],
  },
  {
    id: "operations-scale-leader",
    eyebrow: "Representative Expert Profile",
    title: "Operations & Scale Leader",
    disciplines: "Operations · Scale · Execution · Performance",
    image: "/founding-expert-operations-headshot.jpg",
    imageAlt: "Representative fictional operations and scale leader",
    attributes: [
      { label: "Asia & Global", icon: MapPin },
      { label: "18+ Years Experience", icon: BriefcaseBusiness },
      { label: "Operating Leader", icon: UserCheck },
    ],
    specialisms: ["Operating Models", "Scale Up", "Process Excellence", "Performance"],
  },
  {
    id: "people-organisation-strategist",
    eyebrow: "Representative Expert Profile",
    title: "People & Organisation Strategist",
    disciplines: "Leadership · Culture · Talent · Organisation",
    image: "/founding-expert-people-headshot.jpg",
    imageAlt: "Representative fictional people and organisation strategist",
    attributes: [
      { label: "Global", icon: MapPin },
      { label: "20+ Years Experience", icon: BriefcaseBusiness },
      { label: "People Leader", icon: UserCheck },
    ],
    specialisms: ["Leadership", "Organisation Design", "Culture", "Talent Strategy"],
  },
] satisfies FoundingExpertProfile[]

export const foundingPathSteps = [
  {
    title: "Application",
    description: "Share your professional experience and expertise.",
    icon: Sparkles,
  },
  {
    title: "Verification",
    description: "Confirm relevant credentials and contribution.",
    icon: UserCheck,
  },
  {
    title: "Final Review",
    description: "Complete the curated selection process.",
    icon: ShieldCheck,
  },
] satisfies FoundingPathStep[]

export const foundingCohort = {
  capacity: 25,
  label: "Spots Available",
  description: "Building the foundation of a trusted network of leading experts.",
}

export const foundingBenefits = [
  {
    title: "Rigorous Verification",
    description: "Trusted quality",
    icon: ShieldCheck,
  },
  {
    title: "Elite Network Access",
    description: "High-impact connections",
    icon: Network,
  },
  {
    title: "Early Ecosystem Role",
    description: "Shape what comes next",
    icon: LockKeyhole,
  },
  {
    title: "Founding Recognition",
    description: "Lasting distinction",
    icon: Star,
  },
] satisfies FoundingBenefit[]
