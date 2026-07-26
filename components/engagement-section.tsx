import Image from "next/image"
import {
  Building2,
  ChartNoAxesCombined,
  GraduationCap,
  Network,
} from "lucide-react"

const audiences = [
  {
    title: "Careers",
    description:
      "Professionals navigating growth, transitions, leadership, and global mobility.",
    image: "/professional-mentor-headshot-2.jpg",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Businesses",
    description:
      "Founders, MSMEs, operators, and owners making GTM, hiring, scaling, and execution decisions.",
    image: "/professional-mentor-headshot-3.jpg",
    icon: Building2,
  },
  {
    title: "Corporates",
    description:
      "Leaders and teams navigating capability, strategic shifts, and organisational change.",
    image: "/business-team-collaboration-with-charts-and-analyt.jpg",
    icon: Network,
  },
  {
    title: "Education",
    description:
      "Students and families making high-stakes study abroad and career-aligned education decisions.",
    image: "/professional-mentor-headshot-9.jpg",
    icon: GraduationCap,
  },
]

export function EngagementSection() {
  return (
    <section
      id="who-you-engage-with"
      aria-labelledby="engagement-title"
      className="scroll-mt-[104px] overflow-hidden border-b border-[#dbe2e9] bg-[#fbfcfd] px-5 py-8 text-[#0d2147] sm:px-8 sm:py-10 lg:px-12"
    >
      <div className="mx-auto grid w-full max-w-[1380px] gap-10 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:gap-7">
        <div className="max-w-[300px]">
          <div className="mb-6 flex items-end gap-3">
            <span className="font-serif text-[33px] leading-none text-[#d79d42]">04</span>
            <span className="pb-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#2775d6]">
              Who You Engage With
            </span>
          </div>

          <h2
            id="engagement-title"
            className="font-serif text-[clamp(29px,2.1vw,34px)] font-normal leading-[1.08] tracking-[-0.025em]"
          >
            <span className="block lg:whitespace-nowrap">Where Your Expertise</span>
            <span className="block lg:whitespace-nowrap">Creates Real Leverage</span>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map(({ title, description, image, icon: Icon }) => (
            <article
              key={title}
              className="group overflow-hidden rounded-[5px] border border-[#b8c1cc] bg-white shadow-[0_4px_16px_rgba(20,42,68,0.06)]"
            >
              <div className="relative h-[142px] overflow-hidden border-b border-[#c8d0d8]">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 250px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_52%,rgba(3,21,39,0.48)_100%)]" />
                <Icon
                  className="absolute bottom-4 right-4 h-10 w-10 stroke-[1.25] text-[#e0aa53] drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]"
                  aria-hidden="true"
                />
              </div>

              <div className="min-h-[148px] px-4 py-4">
                <h3 className="text-[14px] font-bold text-[#11254a]">{title}</h3>
                <p className="mt-2 text-[12px] leading-[1.55] text-[#172842]">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
