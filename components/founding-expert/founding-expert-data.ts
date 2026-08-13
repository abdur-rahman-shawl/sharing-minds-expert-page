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

export const foundingExpertProfile = {
  eyebrow: "Expert Profile",
  title: "Senior Strategy Advisor",
  disciplines: "Strategy · Growth · Innovation · Leadership",
  image: "/founding-expert-generated-headshot.jpg",
  attributes: [
    { label: "Global", icon: MapPin },
    { label: "15+ Years Experience", icon: BriefcaseBusiness },
    { label: "Advanced Degree", icon: GraduationCap },
  ] satisfies FoundingProfileAttribute[],
  specialisms: ["Strategy", "Market Entry", "M&A", "Digital Transformation"],
}

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
