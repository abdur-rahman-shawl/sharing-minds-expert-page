import Image from "next/image"
import Link from "next/link"
import {
  BadgeCheck,
  DoorOpen,
  Globe2,
  Handshake,
  MessageSquareText,
} from "lucide-react"

import { EXPERT_APPLICATION_PATH } from "@/lib/routes"

const platformOutcomes = [
  {
    number: "01",
    title: "Extend Your Reach",
    description:
      "Take your expertise beyond existing networks and make it easier for relevant professionals, founders, businesses and institutions to discover where you can contribute.",
    image: "/professional-mentor-headshot-2.jpg",
    icon: Globe2,
  },
  {
    number: "02",
    title: "Engage Where Decisions Matter",
    description:
      "Bring your experience into active conversations across careers, business, strategy, leadership and education.",
    image: "/professional-mentor-headshot-3.jpg",
    icon: MessageSquareText,
  },
  {
    number: "03",
    title: "Create Meaningful Engagements",
    description:
      "Contribute through advisory conversations, mentoring, professional collaborations and knowledge-led initiatives aligned with your expertise.",
    image: "/professional-mentor-headshot-8.jpg",
    icon: Handshake,
  },
  {
    number: "04",
    title: "Strengthen Your Professional Positioning",
    description:
      "Build a verified expert identity that clearly communicates your experience, credibility and areas of contribution.",
    image: "/professional-mentor-headshot-9.jpg",
    icon: BadgeCheck,
  },
  {
    number: "05",
    title: "Enter More Relevant Conversations",
    description:
      "Connect with people and organisations seeking the judgment, context and practical experience you have developed throughout your career.",
    image: "/business-team-collaboration-with-charts-and-analyt.jpg",
    icon: DoorOpen,
  },
]

export function LeverageLayerSection() {
  return (
    <section
      id="strategic-platform"
      aria-labelledby="leverage-layer-title"
      className="relative scroll-mt-[104px] overflow-hidden bg-[#03172c] px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_34%,rgba(12,92,183,0.16),transparent_40%),linear-gradient(105deg,rgba(3,16,33,0.55),transparent_55%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(93,154,217,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(93,154,217,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative mx-auto w-full max-w-[1380px]">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#72b7ff]">
            Built to Extend the Value of Experience
          </p>
          <h2
            id="leverage-layer-title"
            className="mt-5 font-serif text-[clamp(42px,4vw,60px)] font-normal leading-[1.02] tracking-[-0.03em] text-[#f4f1eb]"
          >
            A Strategic Platform
            <span className="block">for Your Expertise</span>
          </h2>
          <p className="mx-auto mt-7 max-w-[820px] text-[16px] leading-[1.75] text-[#d5dce5] sm:text-[17px]">
            SharingMinds gives experienced professionals a structured way to strengthen their
            professional presence, become discoverable in relevant decision contexts and
            contribute through meaningful expert engagements.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-6">
          {platformOutcomes.map(({ number, title, description, image, icon: Icon }, index) => (
            <li
              key={number}
              className={`group overflow-hidden rounded-2xl border border-[#52708e]/35 bg-[#071c33]/80 shadow-[0_18px_44px_rgba(0,0,0,0.18)] xl:col-span-2 ${
                index === 3 ? "xl:col-start-2" : ""
              }`}
            >
              <div className="relative h-[180px] overflow-hidden border-b border-[#52708e]/30">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1280px) 430px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,23,44,0.08),rgba(3,23,44,0.86))]" />
                <span className="absolute bottom-5 left-6 font-serif text-[30px] text-[#edb46f]">
                  {number}
                </span>
                <span className="absolute bottom-4 right-5 flex h-12 w-12 items-center justify-center rounded-full border border-[#d6a05a]/70 bg-[#061a30]/90 text-[#edb46f] shadow-[0_8px_22px_rgba(0,0,0,0.25)]">
                  <Icon className="h-6 w-6 stroke-[1.5]" aria-hidden="true" />
                </span>
              </div>

              <div className="px-6 py-7 sm:px-7">
                <h3 className="text-[20px] font-semibold leading-[1.3] text-[#f4f5f7]">
                  {title}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.72] text-[#cbd4de]">{description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 text-center">
          <Link
            href={EXPERT_APPLICATION_PATH}
            className="inline-flex min-h-[52px] items-center justify-center rounded-[5px] border border-[#279fff] bg-[#087ee8] px-8 py-3 text-center text-[14px] font-semibold text-white shadow-[0_0_22px_rgba(0,143,255,0.55)] transition-all hover:bg-[#168ef5] hover:shadow-[0_0_28px_rgba(0,143,255,0.72)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#65b9ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#03172c]"
          >
            Start My Expert Application
          </Link>
        </div>
      </div>
    </section>
  )
}
