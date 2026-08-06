import Image from "next/image"
import Link from "next/link"

import { EXPERT_APPLICATION_PATH } from "@/lib/routes"
import { cn } from "@/lib/utils"

const lightNetworkPortraits = [
  {
    source: "/professional-mentor-headshot-8.jpg",
    className: "left-[8%] top-[18%] h-16 w-16",
  },
  {
    source: "/professional-mentor-headshot-3.jpg",
    className: "left-[28%] top-[2%] h-14 w-14",
  },
  {
    source: "/professional-mentor-headshot-11.jpg",
    className: "left-[49%] top-[1%] h-14 w-14",
  },
  {
    source: "/professional-mentor-headshot-5.jpg",
    className: "right-[5%] top-[25%] h-16 w-16",
  },
  {
    source: "/professional-mentor-headshot-7.jpg",
    className: "left-[8%] bottom-[15%] h-16 w-16",
  },
  {
    source: "/professional-mentor-headshot-9.jpg",
    className: "left-[39%] bottom-[2%] h-16 w-16",
  },
  {
    source: "/professional-mentor-headshot-12.jpg",
    className: "right-[7%] bottom-[9%] h-14 w-14",
  },
]

const lightNetworkLines = [
  { left: "17%", top: "33%", width: "28%", rotate: "-27deg" },
  { left: "17%", top: "39%", width: "34%", rotate: "16deg" },
  { left: "35%", top: "17%", width: "29%", rotate: "5deg" },
  { left: "51%", top: "18%", width: "35%", rotate: "28deg" },
  { left: "51%", top: "51%", width: "39%", rotate: "-18deg" },
  { left: "18%", top: "69%", width: "34%", rotate: "-4deg" },
  { left: "47%", top: "54%", width: "31%", rotate: "40deg" },
]

function LightExpertNetwork() {
  return (
    <div
      className="relative mx-auto h-[340px] w-full max-w-[620px] sm:h-[390px]"
      aria-label="A connected network of high-quality experts"
      role="img"
    >
      <span className="absolute left-1/2 top-1/2 h-64 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#277bd8]/10 blur-3xl" />

      {lightNetworkLines.map((line) => (
        <span
          key={line.left + line.top}
          className="absolute h-px origin-left bg-[linear-gradient(90deg,rgba(54,130,211,0.14),rgba(54,130,211,0.52),rgba(54,130,211,0.14))]"
          style={{
            left: line.left,
            top: line.top,
            width: line.width,
            transform: "rotate(" + line.rotate + ")",
          }}
        />
      ))}

      <span className="absolute left-1/2 top-1/2 z-10 h-[116px] w-[200px] -translate-x-1/2 -translate-y-1/2">
        <Image
          src="/brand/sharingminds-infinity.png"
          alt=""
          fill
          sizes="200px"
          className="object-contain drop-shadow-[0_7px_12px_rgba(35,110,210,0.22)]"
        />
      </span>

      {lightNetworkPortraits.map(({ source, className }) => (
        <span
          key={source}
          className={cn(
            "absolute z-20 overflow-hidden rounded-full border border-[#5c94cd] bg-white p-0.5 shadow-[0_3px_9px_rgba(18,60,108,0.14)]",
            className,
          )}
        >
          <span className="relative block h-full w-full overflow-hidden rounded-full">
            <Image src={source} alt="" fill sizes="64px" className="object-cover" />
          </span>
        </span>
      ))}

      {["22% 22%", "69% 18%", "82% 58%", "30% 81%", "63% 78%"].map(
        (position) => {
          const [left, top] = position.split(" ")

          return (
            <span
              key={position}
              className="absolute h-1.5 w-1.5 rounded-full bg-[#dfa650] shadow-[0_0_7px_rgba(223,166,80,0.7)]"
              style={{ left, top }}
            />
          )
        },
      )}
    </div>
  )
}

export function AudienceCtaSection() {
  return (
    <section
      id="final-cta"
      aria-labelledby="final-cta-title"
      className="relative overflow-hidden border-y border-[#cfd8e2] bg-[#fbfcfd] bg-[radial-gradient(circle_at_72%_50%,rgba(39,117,214,0.12),transparent_38%)] px-5 py-16 text-[#0d2147] sm:px-8 sm:py-20 lg:min-h-[clamp(600px,70vh,720px)] lg:px-12 lg:py-24"
    >
      <div className="mx-auto grid w-full max-w-[1380px] gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
        <div className="max-w-[600px]">
          <h2
            id="final-cta-title"
            className="font-serif text-[clamp(44px,4.2vw,62px)] font-normal leading-[1.02] tracking-[-0.03em]"
          >
            Founding Expert
            <span className="block">Applications</span>
          </h2>

          <p className="mt-7 text-[16px] leading-[1.75] text-[#233851] sm:text-[17px]">
            SharingMinds is currently evaluating applications for its Founding Expert Cohort.
          </p>
          <p className="mt-4 text-[16px] leading-[1.75] text-[#334960] sm:text-[17px]">
            Professionals selected during this phase may receive Founding Expert recognition and
            the opportunity to establish an early presence within the SharingMinds ecosystem.
          </p>

          <div className="mt-6 max-w-[570px] rounded-xl border border-[#d8b477]/55 bg-[#fff8ed] px-5 py-5">
            <p className="text-[16px] font-semibold leading-[1.55] text-[#9d6827]">
              Founding status is limited.
            </p>
            <p className="mt-2 text-[14px] leading-[1.65] text-[#5b4b39]">
              It is available only to professionals who successfully complete the application
              and verification process during the founding phase.
            </p>
          </div>

          <Link
            href={EXPERT_APPLICATION_PATH}
            className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-[5px] bg-[#1673d8] px-7 text-[15px] font-semibold text-white shadow-[0_8px_22px_rgba(22,115,216,0.3)] transition-colors hover:bg-[#0e64c0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1673d8] focus-visible:ring-offset-2"
          >
            Start My Expert Application
          </Link>
        </div>

        <LightExpertNetwork />
      </div>
    </section>
  )
}
