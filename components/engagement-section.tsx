import Image from "next/image"
import Link from "next/link"
import {
  BriefcaseBusiness,
  Building2,
  Check,
  GraduationCap,
  Network,
} from "lucide-react"

import { EXPERT_APPLICATION_PATH } from "@/lib/routes"

const applicantAreas = [
  {
    title: "Careers",
    description:
      "For working professionals navigating career growth, transitions, leadership and global mobility.",
    applications: [
      "Business and functional leaders",
      "Human resources and talent professionals",
      "Leadership and executive coaches",
      "Career transition specialists",
      "Global mobility and international careers experts",
      "Former executives and senior practitioners",
    ],
    image: "/professional-mentor-headshot-2.jpg",
    icon: BriefcaseBusiness,
  },
  {
    title: "Businesses",
    description:
      "For founders, MSMEs, operators and business owners making decisions related to growth, hiring, scaling and execution.",
    applications: [
      "Founders and entrepreneurs",
      "Business operators",
      "Functional and commercial leaders",
      "Consultants and professional advisors",
      "Go-to-market and growth specialists",
      "Finance, operations, hiring and technology experts",
      "Independent professionals with relevant business expertise",
    ],
    image: "/professional-mentor-headshot-3.jpg",
    icon: Building2,
  },
  {
    title: "Corporates",
    description:
      "For leaders and teams navigating capability development, strategic shifts and organisational change.",
    applications: [
      "Senior business and functional leaders",
      "Industry and domain specialists",
      "Strategy and transformation professionals",
      "Organisational development experts",
      "Technical and subject-matter experts",
      "Leadership, capability and talent specialists",
      "Former executives with relevant corporate experience",
    ],
    image: "/business-team-collaboration-with-charts-and-analyt.jpg",
    icon: Network,
  },
  {
    title: "Education",
    description:
      "For students and families making high-stakes education, study-abroad and career-aligned learning decisions.",
    applications: [
      "Academics and researchers",
      "Education leaders and counsellors",
      "Study-abroad and admissions specialists",
      "Career-aligned education advisors",
      "Industry professionals who can connect education with real-world careers",
      "Subject-matter experts with relevant practical experience",
    ],
    image: "/professional-mentor-headshot-9.jpg",
    icon: GraduationCap,
  },
]

export function EngagementSection() {
  return (
    <section
      id="who-we-serve"
      aria-labelledby="engagement-title"
      className="scroll-mt-[104px] overflow-hidden border-b border-[#dbe2e9] bg-[#fbfcfd] px-5 py-16 text-[#0d2147] sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <div className="mx-auto max-w-[900px] text-center">
          <h2
            id="engagement-title"
            className="font-serif text-[clamp(42px,4vw,60px)] font-normal leading-[1.02] tracking-[-0.03em]"
          >
            Who May Apply?
          </h2>
          <p className="mx-auto mt-7 max-w-[820px] text-[16px] leading-[1.75] text-[#33445b] sm:text-[17px]">
            SharingMinds invites applications from experienced professionals whose expertise can
            support decisions across one or more of the following areas.
          </p>
        </div>

        <div className="mt-12 grid gap-7 lg:grid-cols-2">
          {applicantAreas.map(({ title, description, applications, image, icon: Icon }) => (
            <article
              key={title}
              className="overflow-hidden rounded-2xl border border-[#c3d0dd] bg-white shadow-[0_18px_48px_rgba(20,42,68,0.08)]"
            >
              <div className="relative h-[175px] overflow-hidden border-b border-[#c8d0d8] sm:h-[195px]">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,21,39,0.76),rgba(3,21,39,0.14)_72%)]" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 px-7 pb-6">
                  <h3 className="font-serif text-[34px] leading-none text-white sm:text-[38px]">
                    {title}
                  </h3>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#e1aa58]/75 bg-[#071b31]/90 text-[#e1aa58]">
                    <Icon className="h-7 w-7 stroke-[1.45]" aria-hidden="true" />
                  </span>
                </div>
              </div>

              <div className="px-6 py-7 sm:px-8 sm:py-8">
                <p className="text-[16px] font-medium leading-[1.7] text-[#253951]">
                  {description}
                </p>
                <p className="mt-6 text-[12px] font-bold uppercase tracking-[0.14em] text-[#b77e2f]">
                  Applications may include
                </p>
                <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
                  {applications.map((application) => (
                    <li
                      key={application}
                      className="flex items-start gap-3 text-[14px] leading-[1.55] text-[#33445b]"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 stroke-[2.2] text-[#2674d3]" />
                      {application}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-10 max-w-[980px] rounded-2xl border border-[#c8d6e4] bg-[#f1f7fd] px-6 py-7 text-center shadow-[0_12px_32px_rgba(21,55,94,0.06)] sm:px-10">
          <p className="text-[16px] font-medium leading-[1.7] text-[#1d3552]">
            Applicants may apply across more than one area where they can demonstrate credible
            and relevant expertise.
          </p>
          <p className="mt-3 text-[15px] leading-[1.7] text-[#42546a]">
            Every application is individually reviewed based on professional experience, domain
            credibility, measurable contribution and the applicant&apos;s ability to provide
            practical, responsible guidance.
          </p>
        </div>

        <div className="mt-10 text-center">
          <Link
            href={EXPERT_APPLICATION_PATH}
            className="inline-flex min-h-[52px] items-center justify-center rounded-[5px] bg-[#1673d8] px-8 py-3 text-center text-[14px] font-semibold text-white shadow-[0_8px_22px_rgba(22,115,216,0.3)] transition-colors hover:bg-[#0e64c0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1673d8] focus-visible:ring-offset-2"
          >
            Start My Expert Application
          </Link>
        </div>
      </div>
    </section>
  )
}
