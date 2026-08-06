import Link from "next/link"
import {
  ArrowRight,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"

const footerGroups = [
  {
    title: "For Experts",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Who We Serve", href: "/#who-we-serve" },
      { label: "Become an Expert", href: "/verified-experts" },
      { label: "Expert Resources", href: "/#resources" },
    ],
  },
  {
    title: "For Organizations",
    links: [
      { label: "Solutions", href: "/service" },
      { label: "Industries", href: "/service#industries" },
      { label: "Use Cases", href: "/service#use-cases" },
      { label: "Success Stories", href: "/service#success-stories" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Team", href: "/about#team" },
      { label: "Careers", href: "/about#careers" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Insights", href: "/service" },
      { label: "Webinars", href: "/service" },
      { label: "Help Center", href: "/contact" },
      { label: "Trust & Safety", href: "/policies" },
    ],
  },
]

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com",
    icon: Linkedin,
  },
  {
    label: "X",
    href: "https://x.com",
    icon: Twitter,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com",
    icon: Youtube,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com",
    icon: Instagram,
  },
]

function FooterLogo() {
  return (
    <Link
      href="/"
      aria-label="SharingMinds home"
      className="inline-flex items-center text-white"
    >
      <BrandLogo
        tone="light"
        markClassName="h-11 w-[88px]"
        wordmarkClassName="text-[25px] leading-[0.9]"
        taglineClassName="text-[10px] normal-case tracking-[-0.015em] text-white/90"
      />
    </Link>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-[#2d4155] bg-[#031426] text-white">
      <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-10 lg:px-12">
        <div className="grid gap-x-8 gap-y-10 py-11 sm:grid-cols-2 sm:py-12 lg:grid-cols-[1.65fr_repeat(4,0.9fr)_1.45fr] lg:py-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <FooterLogo />
            <p className="mt-7 max-w-[320px] text-[13px] leading-[1.75] text-[#c8d0d9]">
              We connect organizations with verified experts for high-impact
              conversations that drive clarity, decisions, and growth.
            </p>
          </div>

          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-[14px] font-semibold leading-none text-white">
                {group.title}
              </h2>
              <ul className="mt-6 space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-[#d2d8df] transition-colors hover:text-[#67adff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3f94ef] focus-visible:ring-offset-2 focus-visible:ring-offset-[#031426]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-[14px] font-semibold leading-none text-white">
              Stay Connected
            </h2>
            <p className="mt-4 text-[12px] leading-[1.75] text-[#aeb9c5]">
              Get the latest insights
              <span className="block">and updates.</span>
            </p>

            <form action="/contact" method="get" className="mt-3 flex h-11 w-full max-w-[270px]">
              <label htmlFor="footer-email" className="sr-only">
                Email address
              </label>
              <input
                id="footer-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 rounded-l-[4px] border border-r-0 border-[#465d75] bg-[#06182b] px-4 text-[12px] text-white outline-none placeholder:text-[#8795a5] focus:border-[#378ae6]"
              />
              <button
                type="submit"
                aria-label="Subscribe for SharingMinds updates"
                className="flex w-12 shrink-0 items-center justify-center rounded-r-[4px] border border-[#1768c4] bg-[#0d5fc4] text-white transition-colors hover:bg-[#1675df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4da0f5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#031426]"
              >
                <ArrowRight className="h-5 w-5 stroke-[1.5]" />
              </button>
            </form>

            <div className="mt-4 flex gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={`SharingMinds on ${label}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#667588] text-[#b7c0ca] transition-colors hover:border-[#4a9af0] hover:text-[#67adff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9af0]"
                >
                  <Icon className="h-[18px] w-[18px] stroke-[1.7]" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#2d4155]/80">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-6 py-5 text-[11px] text-[#aeb8c4] sm:px-10 md:flex-row md:items-center md:justify-between lg:px-12">
          <p>© 2025 SharingMinds. All rights reserved.</p>

          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-7 gap-y-3">
            <Link href="/policies#privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <span className="hidden h-4 w-px bg-[#758395]/60 sm:block" aria-hidden="true" />
            <Link href="/policies#terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
            <span className="hidden h-4 w-px bg-[#758395]/60 sm:block" aria-hidden="true" />
            <Link href="/policies#cookies" className="transition-colors hover:text-white">
              Cookie Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
