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
      className="flex scroll-mt-[104px] items-center overflow-hidden border-b border-[#dbe2e9] bg-[#fbfcfd] px-5 py-16 text-[#0d2147] sm:px-8 sm:py-20 lg:min-h-[clamp(620px,72vh,740px)] lg:px-12 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1380px]">
        <div className="max-w-[820px]">
          <h2
            id="engagement-title"
            className="font-serif text-[clamp(42px,4vw,60px)] font-normal leading-[1.02] tracking-[-0.03em]"
          >
            <span className="block">Where Your Expertise</span>
            <span className="block">Creates Real Leverage</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {audiences.map(({ title, description, image, icon: Icon }) => (
            <article
              key={title}
              className="group overflow-hidden rounded-xl border border-[#b8c8d9] bg-white shadow-[0_14px_38px_rgba(20,42,68,0.08)]"
            >
              <div className="relative h-[220px] overflow-hidden border-b border-[#c8d0d8] sm:h-[240px] xl:h-[220px]">
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 250px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_52%,rgba(3,21,39,0.48)_100%)]" />
                <Icon
                  className="absolute bottom-5 right-5 h-14 w-14 stroke-[1.25] text-[#e0aa53] drop-shadow-[0_2px_6px_rgba(0,0,0,0.55)]"
                  aria-hidden="true"
                />
              </div>

              <div className="min-h-[182px] px-6 py-6">
                <h3 className="text-[20px] font-bold text-[#11254a]">{title}</h3>
                <p className="mt-3 text-[15px] leading-[1.65] text-[#172842]">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
