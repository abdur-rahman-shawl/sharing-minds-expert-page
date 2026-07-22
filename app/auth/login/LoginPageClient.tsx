import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, ShieldCheck } from 'lucide-react'

export default function LoginPageClient() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f8fa] text-slate-950 lg:grid lg:h-screen lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <section className="relative flex min-h-[62svh] flex-col px-6 pb-12 pt-6 sm:px-10 sm:pb-16 sm:pt-8 lg:h-screen lg:min-h-0 lg:overflow-y-auto lg:px-12 lg:pb-6 lg:pt-6 xl:px-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-cyan-100/40 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
        </div>

        <nav className="relative z-10 flex items-center justify-between" aria-label="Access page">
          <Link
            href="/"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f8fa]"
          >
            <ArrowLeft
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            />
            Back to SharingMinds
          </Link>

          <span className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 sm:flex">
            <ShieldCheck aria-hidden="true" className="h-4 w-4 text-blue-600" />
            Private network
          </span>
        </nav>

        <main className="relative z-10 my-auto w-full max-w-xl py-12 lg:py-4 2xl:py-8">
          <Link
            href="/"
            className="inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f8fa]"
            aria-label="SharingMinds home"
          >
            <Image
              src="/sharing-minds-logo.png"
              alt="SharingMinds — a human intelligence network"
              width={285}
              height={132}
              priority
              className="h-auto w-[164px] object-contain sm:w-[176px] lg:w-[152px] 2xl:w-[176px]"
            />
          </Link>

          <div className="mt-7 flex items-center gap-3 lg:mt-4 2xl:mt-6">
            <span className="h-px w-8 bg-blue-600" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
              Private client access
            </p>
          </div>

          <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[2.625rem] xl:text-[2.875rem] 2xl:text-[3.5rem]">
            A more considered way to connect is taking shape.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 xl:text-lg xl:leading-8">
            SharingMinds is curating a private environment for founders, senior
            leaders, and verified experts who value relevance, discretion, and
            high-context exchange.
          </p>

          <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/80 px-4 py-2.5 shadow-sm shadow-slate-200/50 backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-40" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600" />
            </span>
            <span className="text-sm font-semibold text-slate-700">
              Invitation-led access opening soon
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f8fa] lg:text-[13px] 2xl:px-6 2xl:text-sm"
            >
              Return to SharingMinds
            </Link>
            <Link
              href="/verified-experts"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/80 px-5 py-3 text-sm font-bold text-slate-800 transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f8fa] lg:text-[13px] 2xl:px-6 2xl:text-sm"
            >
              Apply for expert verification
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <p className="mt-4 max-w-md text-sm leading-6 text-slate-500 lg:mt-3 lg:text-xs lg:leading-5 2xl:mt-4 2xl:text-sm 2xl:leading-6">
            Expert applications remain open through our secure, email-verified
            application process. No platform account is required.
          </p>
        </main>

        <p className="relative z-10 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:hidden 2xl:block">
          A human intelligence network
        </p>
      </section>

      <aside className="relative min-h-[38svh] overflow-hidden bg-slate-950 lg:h-screen lg:min-h-0">
        <Image
          src="/sign-in-banner.jpeg"
          alt="Professionals collaborating in the SharingMinds workspace"
          fill
          priority
          sizes="(min-width: 1024px) 54vw, 100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.82)_0%,rgba(15,23,42,0.34)_48%,rgba(2,6,23,0.84)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_75%_22%,rgba(59,130,246,0.24),transparent_38%)]"
        />

        <div className="relative flex h-full min-h-[38svh] flex-col justify-end p-7 sm:p-10 lg:h-screen lg:min-h-0 lg:p-10 xl:p-14">
          <div className="max-w-2xl border-l border-white/40 pl-5 sm:pl-7">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200">
              SharingMinds private network
            </p>
            <h2 className="mt-4 max-w-[14ch] text-3xl font-semibold leading-tight tracking-[-0.025em] text-white sm:text-4xl xl:text-5xl">
              Built for consequential conversations.
            </h2>
            <p className="mt-4 text-base font-medium text-slate-200 sm:text-lg">
              Curated expertise. Clearer decisions. Enduring impact.
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
