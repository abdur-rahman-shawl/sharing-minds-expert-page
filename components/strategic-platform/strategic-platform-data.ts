import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Compass,
  Eye,
  GraduationCap,
  Handshake,
  Landmark,
  Lightbulb,
  MessageCircle,
  MessagesSquare,
  Network,
  Presentation,
  Rocket,
  ShieldCheck,
  Star,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react"

export type PlatformScenario = {
  title: string
  description: string
  image: string
  icon: LucideIcon
}

export type PlatformBenefit = {
  title: string
  description: string
  icon: LucideIcon
  accent?: "blue"
}

export type PlatformOutcome = {
  id: number
  title: string
  description: string
  icon: LucideIcon
  centralImage: string
  scenarios: [
    PlatformScenario,
    PlatformScenario,
    PlatformScenario,
    PlatformScenario,
    PlatformScenario,
    PlatformScenario,
  ]
  benefitsTitle: string
  benefits: [PlatformBenefit, PlatformBenefit, PlatformBenefit, PlatformBenefit]
}

const verifiedExpertImage = "/professional-mentor-headshot-1.jpg"

export const platformOutcomes: PlatformOutcome[] = [
  {
    id: 1,
    title: "Extend Your Reach",
    description:
      "Take your expertise beyond existing networks and make it easier for relevant professionals, founders, businesses and institutions to discover where you can contribute.",
    icon: Users,
    centralImage: verifiedExpertImage,
    scenarios: [
      {
        title: "Business Leader",
        description: "Looking for expert perspectives",
        image: "/business-team-collaboration-with-charts-and-analyt.jpg",
        icon: BriefcaseBusiness,
      },
      {
        title: "Investment Partner",
        description: "Evaluating opportunities and risks",
        image: "/professional-mentor-headshot-3.jpg",
        icon: Target,
      },
      {
        title: "Founder",
        description: "Seeking domain expertise",
        image: "/images/mentor-connection.jpg",
        icon: Rocket,
      },
      {
        title: "Institution Leader",
        description: "Shaping strategy and impact",
        image: "/professional-mentor-headshot-9.jpg",
        icon: Landmark,
      },
      {
        title: "Policy Professional",
        description: "Exploring expert insights",
        image: "/professional-headshot.png",
        icon: Landmark,
      },
      {
        title: "Professional Peer",
        description: "Interested in shared interests",
        image: "/professional-mentor-headshot-4.jpg",
        icon: Network,
      },
    ],
    benefitsTitle: "Why extending your reach matters",
    benefits: [
      {
        title: "Professional visibility",
        description: "Be discoverable to the right people and opportunities.",
        icon: Eye,
      },
      {
        title: "Relevant decision contexts",
        description: "Get connected to conversations where your expertise counts.",
        icon: Target,
      },
      {
        title: "Meaningful engagements",
        description: "Contribute through high-impact, purpose-aligned interactions.",
        icon: Users,
        accent: "blue",
      },
      {
        title: "Credible positioning",
        description: "Strengthen trust and influence through expert contribution.",
        icon: ShieldCheck,
      },
    ],
  },
  {
    id: 2,
    title: "Engage Where Decisions Matter",
    description:
      "Bring your experience into active conversations across careers, business, strategy, leadership and education.",
    icon: Target,
    centralImage: verifiedExpertImage,
    scenarios: [
      {
        title: "Career Transition",
        description: "Navigating next steps",
        image: "/professional-mentor-headshot-4.jpg",
        icon: Compass,
      },
      {
        title: "Leadership Challenge",
        description: "Team and capability decisions",
        image: "/professional-mentor-headshot-7.jpg",
        icon: Users,
      },
      {
        title: "Founder Decision",
        description: "Growth and execution choices",
        image: "/professional-headshot.png",
        icon: Target,
      },
      {
        title: "Education Pathway",
        description: "High-stakes guidance",
        image: "/professional-mentor-headshot-2.jpg",
        icon: GraduationCap,
      },
      {
        title: "Business Strategy",
        description: "Evaluating priorities",
        image: "/images/professional-woman.jpg",
        icon: Presentation,
      },
      {
        title: "Institutional Decision",
        description: "Policy, talent or change",
        image: "/professional-mentor-headshot-8.jpg",
        icon: Building2,
      },
    ],
    benefitsTitle: "Why this matters",
    benefits: [
      {
        title: "Practical relevance",
        description: "Contribute where real decisions are being made.",
        icon: Target,
      },
      {
        title: "High-stakes conversations",
        description: "Bring judgment into important moments.",
        icon: MessagesSquare,
      },
      {
        title: "Cross-domain contribution",
        description: "Support careers, business, leadership and education.",
        icon: Users,
        accent: "blue",
      },
      {
        title: "Trusted guidance",
        description: "Add clarity through real-world experience.",
        icon: ShieldCheck,
      },
    ],
  },
  {
    id: 3,
    title: "Create Meaningful Engagements",
    description:
      "Contribute through advisory conversations, mentoring, collaborations and knowledge-led initiatives aligned with your expertise.",
    icon: Handshake,
    centralImage: verifiedExpertImage,
    scenarios: [
      {
        title: "Advisory Conversation",
        description: "Strategic guidance",
        image: "/images/mentor-connection.jpg",
        icon: Compass,
      },
      {
        title: "Knowledge Initiative",
        description: "Expert-led learning",
        image: "/images/workshop-mentor.jpg",
        icon: Lightbulb,
      },
      {
        title: "Mentoring Session",
        description: "Practical growth support",
        image: "/images/mentoring-session.jpg",
        icon: Users,
      },
      {
        title: "Workshop Engagement",
        description: "Structured group contribution",
        image: "/images/team-meeting.jpg",
        icon: Presentation,
      },
      {
        title: "Professional Collaboration",
        description: "Working with peers",
        image: "/business-team-collaboration-with-charts-and-analyt.jpg",
        icon: Handshake,
      },
      {
        title: "Strategic Assignment",
        description: "Outcome-focused expertise",
        image: "/professional-man-working-on-laptop.jpg",
        icon: Target,
      },
    ],
    benefitsTitle: "Why this matters",
    benefits: [
      {
        title: "High-impact contribution",
        description: "Put experience to work where it matters.",
        icon: Target,
      },
      {
        title: "Advisory & mentoring",
        description: "Support others through practical guidance.",
        icon: MessagesSquare,
      },
      {
        title: "Professional collaboration",
        description: "Work with peers, teams and organisations.",
        icon: Users,
        accent: "blue",
      },
      {
        title: "Knowledge-led value",
        description: "Turn expertise into meaningful engagement.",
        icon: Lightbulb,
      },
    ],
  },
  {
    id: 4,
    title: "Strengthen Your Professional Positioning",
    description:
      "Build a verified expert identity that clearly communicates your experience, credibility and areas of contribution.",
    icon: BadgeCheck,
    centralImage: verifiedExpertImage,
    scenarios: [
      {
        title: "Verified Expert Profile",
        description: "Clear professional identity",
        image: "/professional-mentor-headshot-3.jpg",
        icon: BadgeCheck,
      },
      {
        title: "Professional Identity",
        description: "Represent experience and contribution",
        image: "/images/professional-mentor.jpg",
        icon: Users,
      },
      {
        title: "Credibility Signal",
        description: "Trusted experience and proof",
        image: "/professional-mentor-headshot-2.jpg",
        icon: ShieldCheck,
      },
      {
        title: "Expertise Positioning",
        description: "Define where your judgment adds value",
        image: "/images/workshop-mentor.jpg",
        icon: Target,
      },
      {
        title: "Authority Presence",
        description: "Communicate expertise clearly",
        image: "/professional-mentor-headshot-8.jpg",
        icon: Presentation,
      },
      {
        title: "Trusted Representation",
        description: "Strengthen visibility and confidence",
        image: "/professional-mentor-headshot-4.jpg",
        icon: Star,
      },
    ],
    benefitsTitle: "Why this matters",
    benefits: [
      {
        title: "Credible identity",
        description: "Present your experience with trust.",
        icon: ShieldCheck,
      },
      {
        title: "Clear positioning",
        description: "Show where your expertise fits.",
        icon: Target,
      },
      {
        title: "Professional authority",
        description: "Strengthen relevance and visibility.",
        icon: BadgeCheck,
      },
      {
        title: "Distinct expert presence",
        description: "Stand apart with practical credibility.",
        icon: Star,
      },
    ],
  },
  {
    id: 5,
    title: "Enter More Relevant Conversations",
    description:
      "Connect with people and organisations seeking the judgment, context and practical experience you have developed throughout your career.",
    icon: MessageCircle,
    centralImage: verifiedExpertImage,
    scenarios: [
      {
        title: "Founder Conversation",
        description: "Growth, hiring and execution",
        image: "/images/mentor-connection.jpg",
        icon: BriefcaseBusiness,
      },
      {
        title: "Institutional Discussion",
        description: "Policy, education and capability",
        image: "/professional-mentor-headshot-2.jpg",
        icon: Landmark,
      },
      {
        title: "Career Guidance",
        description: "Transitions and leadership decisions",
        image: "/images/mentoring-session.jpg",
        icon: Compass,
      },
      {
        title: "Peer Exchange",
        description: "Shared expertise and insight",
        image: "/business-team-collaboration-with-charts-and-analyt.jpg",
        icon: Users,
      },
      {
        title: "Strategic Dialogue",
        description: "Business priorities and judgment",
        image: "/images/workshop-mentor.jpg",
        icon: Presentation,
      },
      {
        title: "Advisory Conversation",
        description: "Practical perspective where it matters",
        image: "/professional-man-working-on-laptop.jpg",
        icon: MessageCircle,
      },
    ],
    benefitsTitle: "Why this matters",
    benefits: [
      {
        title: "Relevant connections",
        description: "Reach people where your expertise fits.",
        icon: Users,
      },
      {
        title: "Better conversations",
        description: "Enter discussions that matter.",
        icon: MessagesSquare,
      },
      {
        title: "Contextual relevance",
        description: "Be sought where judgment is needed.",
        icon: Target,
      },
      {
        title: "Professional visibility",
        description: "Turn experience into meaningful dialogue.",
        icon: Eye,
      },
    ],
  },
]
