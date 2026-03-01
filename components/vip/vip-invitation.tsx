'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'

type MentorInfo = {
  fullName: string
  email: string
  verificationStatus?: string
}

type VipInvitationProps = {
  mentor: MentorInfo
  onNavigateHome: () => void
  onNavigateDashboard?: () => void
  canAccessDashboard?: boolean
}

const heroIntro = [
  'An Invitation to Our Early Expert Circle',
  'You’re invited to join SharingMinds as part of our initial group of Founding Experts — a small, curated circle of experienced professionals with priority access to early mentee engagements.',
  (
    <div key="vip-intro-3" className="space-y-4">
      <p>As a Founding Expert, you receive:</p>
      <ul className="list-disc pl-5 space-y-2">
        <li>Early visibility on the platform</li>
        <li>Priority placement in expert discovery</li>
        <li>Access to our private expert lounge</li>
        <li>First access to 1:1 session requests and group conversations</li>
        <li>A more personalised engagement experience with mentees</li>
      </ul>
      <p>
        This is designed for professionals who value meaningful conversations over volume — and prefer working in a focused, well-curated environment.
      </p>
      <p className="font-medium text-amber-200">
        Welcome to the inner circle.
      </p>
    </div>
  )
]

const reasonsToJoin = [
  'Priority placement in expert discovery during our early launch phase',
  'Early access to 1:1 session requests and curated group conversations',
  'Entry to the private Founding Expert lounge',
  'A visible Founding Expert badge on your profile',
  'Thoughtful matching with mentees based on real context and intent',
  'Paid 1:1 engagements, on your terms',
  'A quieter, more curated experience — fewer requests, higher relevance'
]

const enrolmentSteps = [
  {
    title: 'Step 1 — Expert Verification (One-Time)',
    body: (
      <div className="space-y-4">
        <p>A brief verification process to confirm experience and ensure quality across the platform.</p>
        <p>This helps us maintain a trusted, high-caliber expert ecosystem — without unnecessary friction.</p>
        <p className="font-semibold text-amber-200">Registration & Verification Fee: ₹9999 + 18% GST (one-time)</p>
        <p>As part of this step, you’ll also receive complimentary Silver Membership — giving you early access to explore the platform, understand engagement formats, and experience the ecosystem firsthand.</p>
      </div>
    ),
  },
  {
    title: 'Step 2 — Platform Membership (Annual)',
    body: (
      <div className="space-y-4">
        <p>Once verified, you receive annual access to the SharingMinds ecosystem, including:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Participation in 1:1 expert conversations and curated group sessions</li>
          <li>Visibility in expert discovery</li>
          <li>Access to the Founding Expert lounge</li>
          <li>Smart matching powered by intent-based discovery</li>
          <li>Tools to manage availability and engagements</li>
        </ul>
        <p>Early members will also receive special founding benefits during our initial launch phase.</p>
        <p className="text-xs text-slate-400 italic">
          (Platform-wide features will activate as we complete full deployment — launch details coming soon.)
        </p>
      </div>
    ),
  },
]

export function VipInvitation({ mentor, onNavigateHome, onNavigateDashboard, canAccessDashboard }: VipInvitationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/sharing-minds-logo.png"
              alt="SharingMinds"
              width={200}
              height={60}
              priority
              className="h-12 w-auto"
            />
            <div className="hidden text-xs uppercase tracking-[0.3em] text-amber-200 sm:block">
              Founding Expert Circle
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-right text-sm text-slate-200">
              <p className="font-semibold text-white">{mentor.fullName}</p>
              <p className="text-xs text-slate-400">{mentor.email}</p>
              {mentor.verificationStatus && (
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300">
                  {mentor.verificationStatus.replace(/_/g, ' ')}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Image
                src="/vip-access.jpeg"
                alt="VIP Access"
                width={72}
                height={72}
                className="h-16 w-16 rounded-full border border-amber-200/60 object-cover shadow-lg shadow-amber-500/40"
              />
              <span className="text-xs uppercase tracking-[0.2em] text-amber-200">VIP ACCESS</span>
            </div>
          </div>
        </header>

        <section className="mt-10 grid gap-8 lg:grid-cols-[3fr,2fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200">Founding Experts</p>
            <h1 className="mt-4 text-3xl font-semibold text-white">{heroIntro[0]}</h1>
            <p className="mt-6 text-base text-slate-200">{heroIntro[1]}</p>
            <div className="mt-4 text-base text-slate-200 leading-relaxed">{heroIntro[2]}</div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="secondary" className="bg-amber-400/90 text-black hover:bg-amber-300" onClick={onNavigateHome}>
                Back to Home
              </Button>
              {canAccessDashboard && onNavigateDashboard && (
                <Button className="border border-white/20 bg-transparent text-white hover:bg-white/10" onClick={onNavigateDashboard}>
                  Go to Mentor Dashboard
                </Button>
              )}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-amber-200/40 bg-gradient-to-br from-amber-500/20 via-transparent to-transparent p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.15),_transparent)]" />
            <div className="relative flex h-full flex-col justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200">VIP Recognition</p>
                <h2 className="mt-4 text-2xl font-semibold">Founding Expert Lounge</h2>
                <p className="mt-3 text-sm text-amber-50">
                  As a Founding Expert, you receive priority visibility and access to early mentee engagements — along with entry to our private expert lounge.
                  <br />This space is designed for experienced professionals who prefer focused conversations, curated connections, and a more personalised engagement experience.
                  <br />You’ll also carry a Founding Expert badge, highlighting your early role on SharingMinds.

                </p>
              </div>
              <div className="relative mt-6 flex-1 min-h-[220px]">
                <Image
                  src="/vip-access.jpeg"
                  alt="VIP badge"
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/60" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-8">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-xl font-semibold text-white">🔹 Why Join as a Founding Expert?</h3>
            <ul className="mt-6 grid gap-4 text-base text-slate-100 md:grid-cols-2">
              {reasonsToJoin.map(reason => (
                <li key={reason} className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/20 p-4 text-sm leading-relaxed text-slate-200">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" aria-hidden />
                  {reason}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm italic text-amber-200/90 text-center font-medium">
              Designed for experienced professionals who prefer meaningful conversations over volume.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8">
            <h3 className="text-xl font-semibold text-white">⚙️ The Enrolment Process</h3>
            <p className="mt-2 text-sm text-slate-200">Joining SharingMinds as a Founding Expert is intentionally simple and thoughtfully curated.</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {enrolmentSteps.map(step => (
                <div key={step.title} className="rounded-2xl border border-white/10 bg-black/20 p-6 flex flex-col">
                  <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                  <div className="mt-4 text-sm text-slate-200 flex-1">
                    {step.body}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-200/60 bg-gradient-to-r from-amber-500/20 via-transparent to-transparent p-8">
            <h3 className="text-xl font-semibold text-white">🎁 Founding Expert Access (By Personal Invitation)</h3>
            <div className="mt-4 text-sm text-white">
              <p className="mb-2">Joining SharingMinds includes:</p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>One-time Expert Verification — ₹9,999 + GST</li>
                <li>Annual Platform Membership</li>
              </ul>
              <p className="mb-2">As a Founding Expert, you receive:</p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>Complimentary Silver Membership for your first year. Value INR: Rs 12,000/- +</li>
                <li>Founding Expert recognition on your profile</li>
                <li>Priority visibility during early launch</li>
                <li>Access to the private expert lounge</li>
              </ul>
              <p className="italic text-amber-100/90 mt-4">
                This invitation is extended selectively to experienced professionals joining us in the early phase.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-xl font-semibold text-white">💬 Ready to Join as a Founding Expert?</h3>
            <p className="mt-4 text-sm text-slate-200">
              You’re invited to be part of our early expert circle — with priority access, curated engagements, and a more personalised experience on SharingMinds.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button className="bg-amber-400/90 text-black hover:bg-amber-300 font-semibold px-6">
                Accept Your Invitation
              </Button>
              <p className="text-xs text-amber-100/80">(Personal invitations only. Limited founding access.)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
