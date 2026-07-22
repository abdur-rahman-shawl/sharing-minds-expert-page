import type { Metadata } from "next"
import Link from "next/link"
import RegistrationForm from "@/app/registration/RegistrationForm"
import { areMentorApplicationsEnabled } from "@/lib/mentor-applications/feature"
import { EXPERT_APPLICATION_PATH } from "@/lib/routes"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Expert Verification Application - SharingMinds",
  description:
    "Apply for expert verification and join the SharingMinds community of experienced professionals.",
  alternates: {
    canonical: EXPERT_APPLICATION_PATH,
  },
}

export default function VerifiedExpertsPage() {
  if (!areMentorApplicationsEnabled()) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/40 via-slate-50 to-white" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

        <main className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6">
          <section
            aria-labelledby="mentor-applications-unavailable-title"
            className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white/90 p-8 text-center shadow-xl shadow-slate-200/50 backdrop-blur sm:p-12"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              SharingMinds experts
            </p>
            <h1
              id="mentor-applications-unavailable-title"
              className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Expert applications are temporarily unavailable
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              We are preparing the next application window. Please check back soon.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              Return to SharingMinds
            </Link>
          </section>
        </main>
      </div>
    )
  }

  return <RegistrationForm />
}
