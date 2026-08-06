"use client"

import * as TabsPrimitive from "@radix-ui/react-tabs"
import Image from "next/image"
import Link from "next/link"
import {
  BriefcaseBusiness,
  Building2,
  GraduationCap,
  Network,
  type LucideIcon,
} from "lucide-react"

import { EXPERT_APPLICATION_PATH } from "@/lib/routes"

type ApplicantArea = {
  id: string
  title: string
  image: string
  imageAlt: string
  icon: LucideIcon
}

const applicantAreas: ApplicantArea[] = [
  {
    id: "careers",
    title: "Careers",
    image: "/who-may-apply/careers.webp",
    imageAlt:
      "Careers infographic showing professional profiles that may apply and the outcomes their expertise can support.",
    icon: BriefcaseBusiness,
  },
  {
    id: "businesses",
    title: "Businesses",
    image: "/who-may-apply/businesses.webp",
    imageAlt:
      "Businesses infographic showing business expert profiles that may apply and the outcomes their expertise can support.",
    icon: Building2,
  },
  {
    id: "corporates",
    title: "Corporates",
    image: "/who-may-apply/corporates.webp",
    imageAlt:
      "Corporates infographic showing corporate expert profiles that may apply and the outcomes their expertise can support.",
    icon: Network,
  },
  {
    id: "education",
    title: "Education",
    image: "/who-may-apply/education.webp",
    imageAlt:
      "Education infographic showing education expert profiles that may apply and the outcomes their expertise can support.",
    icon: GraduationCap,
  },
]

export function EngagementSection() {
  return (
    <section
      id="who-we-serve"
      aria-labelledby="engagement-title"
      className="scroll-mt-[88px] overflow-hidden border-b border-[#dbe2e9] bg-[#fbfcfd] px-5 py-14 text-[#0d2147] sm:scroll-mt-[104px] sm:px-8 sm:py-10 lg:min-h-[calc(100svh-104px)] lg:px-7 lg:py-[clamp(16px,2.2vh,24px)] xl:px-10 2xl:px-12"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <TabsPrimitive.Root
          defaultValue="careers"
          className="who-may-apply-layout lg:grid lg:min-h-[calc(100svh-152px)] lg:grid-cols-[minmax(248px,290px)_minmax(0,1fr)] lg:grid-rows-[auto_auto_auto] lg:content-start lg:gap-x-6 lg:gap-y-3 xl:grid-cols-[310px_minmax(0,1fr)] xl:content-center xl:gap-x-7 2xl:grid-cols-[340px_minmax(0,1fr)] 2xl:gap-x-8"
        >
          <header className="mx-auto max-w-[900px] text-center lg:col-start-1 lg:row-start-1 lg:mx-0 lg:text-left">
            <h2
              id="engagement-title"
              className="who-may-apply-title text-[clamp(38px,9vw,52px)] font-normal leading-[1.02] tracking-[-0.03em] lg:text-[42px] xl:text-[46px] 2xl:text-[52px]"
            >
              Who May Apply?
            </h2>
            <p className="who-may-apply-intro mx-auto mt-3 max-w-[820px] text-[15px] leading-[1.6] text-[#33445b] lg:mx-0 lg:text-[13px] lg:leading-[1.5] xl:text-[14px] 2xl:mt-4 2xl:text-[15px] 2xl:leading-[1.6]">
              SharingMinds invites applications from experienced professionals whose expertise can
              support decisions across one or more of the following areas.
            </p>
          </header>

          <TabsPrimitive.List
            aria-label="Who may apply categories"
            className="who-may-apply-tabs mx-auto mt-7 grid max-w-[980px] grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3 lg:col-start-1 lg:row-start-2 lg:mx-0 lg:mt-0 lg:grid-cols-1 lg:gap-1.5 2xl:gap-2"
          >
            {applicantAreas.map(({ id, title, icon: Icon }) => (
              <TabsPrimitive.Trigger
                key={id}
                value={id}
                className="who-may-apply-tab group flex min-h-[50px] items-center justify-center gap-2.5 rounded-xl border border-[#bdcad7] bg-white px-3 py-2.5 text-[13px] font-semibold text-[#31465d] shadow-[0_8px_22px_rgba(24,55,88,0.05)] transition-[border-color,background-color,color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[#4386c7] hover:text-[#114f91] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1673d8] focus-visible:ring-offset-2 data-[state=active]:border-[#1673d8] data-[state=active]:bg-[#0b2b4d] data-[state=active]:text-white data-[state=active]:shadow-[0_10px_28px_rgba(15,73,132,0.2)] sm:text-[14px] lg:min-h-[40px] lg:justify-start lg:px-3.5 lg:py-1.5 2xl:min-h-[44px] 2xl:px-4 2xl:py-2"
              >
                <Icon
                  className="h-5 w-5 shrink-0 stroke-[1.6] text-[#178f9c] group-data-[state=active]:text-[#61d2d7]"
                  aria-hidden="true"
                />
                {title}
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>

          <div className="mx-auto mt-5 w-full max-w-[1180px] sm:mt-6 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mt-0 lg:max-w-none lg:self-start">
            {applicantAreas.map((area) => (
              <TabsPrimitive.Content
                key={area.id}
                value={area.id}
                className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1673d8] focus-visible:ring-offset-4"
              >
                <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#bccbd9] bg-white shadow-[0_22px_58px_rgba(20,42,68,0.13)] sm:h-[clamp(360px,44svh,460px)] sm:aspect-auto lg:h-[clamp(400px,calc(100svh-210px),660px)]">
                  <Image
                    src={area.image}
                    alt={area.imageAlt}
                    fill
                    sizes="(min-width: 1280px) 1000px, (min-width: 1024px) calc(100vw - 350px), (min-width: 768px) calc(100vw - 64px), calc(100vw - 40px)"
                    className="object-contain"
                  />
                </figure>
              </TabsPrimitive.Content>
            ))}
          </div>

          <div className="who-may-apply-note mx-auto mt-7 max-w-[1180px] rounded-2xl border border-[#c8d6e4] bg-[#eef6fc] px-5 py-5 shadow-[0_12px_32px_rgba(21,55,94,0.06)] sm:px-7 lg:col-start-1 lg:row-start-3 lg:mx-0 lg:mt-0 lg:px-3.5 lg:py-3 2xl:px-4 2xl:py-4">
            <p className="who-may-apply-note-title text-[14px] font-semibold leading-[1.5] text-[#1d3552] lg:text-[13px] 2xl:text-[14px]">
              Apply where your expertise is strongest.
            </p>
            <p className="who-may-apply-note-copy mt-1 text-[12px] leading-[1.5] text-[#4a5f75] lg:text-[11px] lg:leading-[1.45] xl:text-[12px] 2xl:mt-1.5 2xl:text-[13px] 2xl:leading-[1.5]">
              Applications are individually reviewed for experience, credibility, contribution and
              practical judgment.
            </p>
            <Link
              href={EXPERT_APPLICATION_PATH}
              className="who-may-apply-cta mt-3 inline-flex min-h-[44px] w-full items-center justify-center rounded-[5px] bg-[#1673d8] px-4 py-2 text-center text-[12px] font-semibold text-white shadow-[0_8px_22px_rgba(22,115,216,0.3)] transition-colors hover:bg-[#0e64c0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1673d8] focus-visible:ring-offset-2 2xl:mt-4 2xl:min-h-[48px] 2xl:px-5 2xl:py-2.5 2xl:text-[13px]"
            >
              Start My Expert Application
            </Link>
          </div>
        </TabsPrimitive.Root>
      </div>
    </section>
  )
}
