export type JourneySignal = {
  title: string
  description: string
}

export type JourneyOutcome = {
  label: string
  value: string
}

export type JourneyStage = {
  id: number
  category: string
  title: string
  description: string
  centerLabel: string
  centerTitle: string
  signals: [JourneySignal, JourneySignal, JourneySignal, JourneySignal]
  outcomes: [JourneyOutcome, JourneyOutcome, JourneyOutcome, JourneyOutcome]
}

export const journeyStages: JourneyStage[] = [
  {
    id: 1,
    category: "Application",
    title: "Submit Your Expert Application",
    description:
      "Tell us about your experience, expertise, operating context and the decisions where your judgment creates value.",
    centerLabel: "Your starting point",
    centerTitle: "Experience Profile",
    signals: [
      {
        title: "Professional Experience",
        description: "What you have led, built, solved or influenced.",
      },
      {
        title: "Operating Context",
        description: "Industries, functions and environments you understand.",
      },
      {
        title: "Areas of Expertise",
        description: "Where your judgment is strongest.",
      },
      {
        title: "Decision Value",
        description: "Where your experience can improve decisions.",
      },
    ],
    outcomes: [
      { label: "Apply across", value: "Careers" },
      { label: "Apply across", value: "Businesses" },
      { label: "Apply across", value: "Corporates" },
      { label: "Apply across", value: "Education" },
    ],
  },
  {
    id: 2,
    category: "Review",
    title: "Application Review",
    description:
      "Every application is individually reviewed to understand the strength, credibility and practical relevance of your experience.",
    centerLabel: "Individual review",
    centerTitle: "Expertise Assessment",
    signals: [
      {
        title: "Relevant Experience",
        description: "Depth and relevance of your professional track record.",
      },
      {
        title: "Measurable Contribution",
        description: "What changed because of your work.",
      },
      {
        title: "Domain Credibility",
        description: "Evidence that you understand the context in which you operate.",
      },
      {
        title: "Practical Expertise",
        description: "Judgment built through real operating experience.",
      },
    ],
    outcomes: [
      { label: "Review lens", value: "Experience" },
      { label: "Review lens", value: "Credibility" },
      { label: "Review lens", value: "Contribution" },
      { label: "Review lens", value: "Practical Judgment" },
    ],
  },
  {
    id: 3,
    category: "Verification",
    title: "Complete Verification",
    description:
      "Shortlisted applicants may be asked for additional information, supporting evidence, references or a verification conversation.",
    centerLabel: "Credibility check",
    centerTitle: "Expertise Verification",
    signals: [
      {
        title: "Professional Information",
        description: "Additional context where required.",
      },
      {
        title: "References",
        description: "Credibility signals from relevant professional sources.",
      },
      {
        title: "Supporting Evidence",
        description: "Proof of experience or contribution.",
      },
      {
        title: "Verification Conversation",
        description: "A focused discussion where useful.",
      },
    ],
    outcomes: [
      { label: "Establish", value: "Credibility" },
      { label: "Confirm", value: "Relevance" },
      { label: "Validate", value: "Experience" },
      { label: "Build", value: "Trust" },
    ],
  },
  {
    id: 4,
    category: "Selection",
    title: "Expert Selection",
    description:
      "Applicants who meet the required standards are invited to become SharingMinds Verified Experts.",
    centerLabel: "Selection outcome",
    centerTitle: "Verified Expert",
    signals: [
      {
        title: "Required Standards",
        description: "Your application meets the applicable expert criteria.",
      },
      {
        title: "Verified Status",
        description: "Your expertise moves from claimed to reviewed.",
      },
      {
        title: "Approved Expertise",
        description: "The areas where you are cleared to contribute.",
      },
      {
        title: "Representation",
        description: "Your professional identity is structured around relevance.",
      },
    ],
    outcomes: [
      { label: "Outcome", value: "Selected" },
      { label: "Identity", value: "Verified" },
      { label: "Expertise", value: "Approved" },
      { label: "Position", value: "Defined" },
    ],
  },
  {
    id: 5,
    category: "Activation",
    title: "Activate Your Expert Membership",
    description:
      "Selected experts receive the applicable membership, profile activation and participation details.",
    centerLabel: "Activation",
    centerTitle: "Expert Profile",
    signals: [
      {
        title: "Membership",
        description: "Receive the applicable expert membership details.",
      },
      {
        title: "Expertise Structure",
        description: "Present your experience by relevant contribution areas.",
      },
      {
        title: "Profile Activation",
        description: "Move your verified identity into the ecosystem.",
      },
      {
        title: "Participation Details",
        description: "Understand the applicable engagement framework.",
      },
    ],
    outcomes: [
      { label: "Activate", value: "Membership" },
      { label: "Publish", value: "Profile" },
      { label: "Structure", value: "Expertise" },
      { label: "Prepare", value: "Participation" },
    ],
  },
  {
    id: 6,
    category: "Contribution",
    title: "Engage Where Your Expertise Matters",
    description:
      "Your verified expertise can contribute through relevant formats across Careers, Businesses, Corporates and Education.",
    centerLabel: "Expertise in action",
    centerTitle: "Meaningful Contribution",
    signals: [
      {
        title: "Consultations",
        description: "Focused expert conversations around real decisions.",
      },
      {
        title: "Workshops & Programmes",
        description: "Structured knowledge and capability engagements.",
      },
      {
        title: "Mentoring",
        description: "Practical guidance grounded in experience.",
      },
      {
        title: "Strategic Assignments",
        description: "Deeper contribution aligned with relevant expertise.",
      },
    ],
    outcomes: [
      { label: "Across", value: "Careers" },
      { label: "Across", value: "Businesses" },
      { label: "Across", value: "Corporates" },
      { label: "Across", value: "Education" },
    ],
  },
]
