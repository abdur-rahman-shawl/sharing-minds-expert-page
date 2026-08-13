import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import styles from './login-page.module.css'

export default function LoginPageClient() {
  return (
    <div
      className={`${styles.viewport} bg-[#f7f8fa] text-slate-950 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]`}
    >
      <section className="relative flex h-full min-h-0 flex-col overflow-hidden px-6 py-5 sm:px-10 sm:py-6 lg:px-10 xl:px-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-28 top-1/3 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a08_1px,transparent_1px),linear-gradient(to_bottom,#0f172a08_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
        </div>

        <nav className="relative z-10" aria-label="Access page">
          <Link
            href="/"
            className="group inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f8fa]"
          >
            <ArrowLeft
              aria-hidden="true"
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            />
            Back to sharingminds
          </Link>
        </nav>

        <main className={`${styles.main} relative z-10 my-auto w-full max-w-xl py-5`}>
          <Link
            href="/"
            className={`${styles.brand} inline-flex rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f8fa]`}
            aria-label="sharingminds home"
          >
            <Image
              src="/sharing-minds-logo.png"
              alt="sharingminds — a human intelligence network"
              width={285}
              height={132}
              priority
              className="h-auto w-[142px] object-contain sm:w-[154px] xl:w-[164px]"
            />
          </Link>

          <div className={`${styles.eyebrow} mt-6 flex items-center gap-3`}>
            <span className="h-px w-8 bg-blue-600" aria-hidden="true" />
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
              Verified expert access
            </p>
          </div>

          <h1 className="mt-4 max-w-[12ch] text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[2.65rem] xl:text-5xl 2xl:text-[3.35rem]">
            Access begins after verification.
          </h1>

          <p className="mt-4 max-w-lg text-base leading-7 text-slate-600 sm:text-[1.05rem]">
            After your expert application is approved, we&apos;ll activate sign-in and dashboard
            access and notify you through your SharingMinds account email.
          </p>

          <div className="mt-6 flex flex-col gap-3 xl:flex-row xl:items-center">
            <Link
              href="/verified-experts"
              className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f8fa]"
            >
              Apply for verification
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 bg-white/80 px-5 py-2.5 text-sm font-bold text-slate-700 transition duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f8fa]"
            >
              Return home
            </Link>
          </div>
        </main>

      </section>

      <aside className="relative hidden h-full min-h-0 overflow-hidden bg-slate-950 lg:block">
        <Image
          src="/sign-in-banner.jpeg"
          alt="Professionals collaborating in the sharingminds workspace"
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-cover object-center"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(135deg,rgba(2,6,23,0.84)_0%,rgba(15,23,42,0.28)_50%,rgba(2,6,23,0.86)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(59,130,246,0.24),transparent_38%)]"
        />

        <div className="relative flex h-full min-h-0 flex-col justify-end p-10 xl:p-14 2xl:p-16">
          <div className="max-w-xl border-l border-white/40 pl-5 sm:pl-7">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200">
              Curated participation
            </p>
            <h2 className="mt-3 max-w-[13ch] text-3xl font-semibold leading-tight tracking-[-0.025em] text-white xl:text-4xl 2xl:text-5xl">
              Verified access. Meaningful exchange.
            </h2>
            <p className="mt-3 max-w-md text-base leading-7 text-slate-200 2xl:text-lg">
              Every expert account is activated only after professional review.
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}
