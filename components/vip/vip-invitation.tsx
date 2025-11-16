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
  'A Personal Invitation to Become a Founding Mentor on SharingMinds',
  'You’re invited to join a select circle of thinkers, leaders, and changemakers who will shape the foundation of SharingMinds — a collaborative mentorship network designed for meaningful growth and real impact.',
  'As one of our Founding Mentors, you won’t just guide others — you’ll help define how mentorship evolves in the modern professional world.',
]

const reasonsToJoin = [
  'Be recognized as part of the core founding group of SharingMinds',
  'Get featured as one of the faces of the community across our upcoming campaigns, events, collaborations, and digital media',
  'Enjoy exclusive visibility and early recognition within the ecosystem',
  'Unlock AI-powered tools for better mentee matching and brand visibility',
  'Monetize your mentorship and gain a consistent income source',
  'Shape the next generation of professionals, founders, and leaders',
]

const enrolmentSteps = [
  {
    title: '1️⃣ Mentor Verification',
    body: [
      'A one-time process that ensures authenticity and credibility across the platform.We keep it light yet meaningful — maintaining a serious and high-quality mentor community built on trust and real expertise.',
      'Membership: Rs 5000/- + 18% GST',
    ],
  },
  {
    title: '2️⃣ Platform Subscription',
    body: [
      'Once verified, mentors gain annual access to our ecosystem — connect with mentees, host sessions, publish insights, and use AI-based tools for discovery, matchmaking, and impact measurement. First year annual Membership comes with special early-access benefits, applicable only after we deploy fully functional platform. Watch this space for launch date.',
    ],
  },
]

const exclusiveOfferDetails = [
  'Normally, joining the platform includes:',
  '₹5,000 One-Time Mentor Verification Fee',
  'Annual Platform Subscription Fee',
  'However, for mentors joining through personal invitation, your ₹5,000 verification fee is completely waived —and your first-year membership comes with special early-access benefits and founding mentor recognition.',
  'This is a limited opportunity extended personally to mentors we truly admire — those whose presence will inspire the network and set the tone for our community’s culture.',
  'Our Founding Mentors will be the faces of the community — highlighted in our campaigns, events, and collaborations as the first voices who believed in the idea early and helped bring it to life.',
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
              Founding Mentor Circle
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
            <p className="text-xs uppercase tracking-[0.4em] text-amber-200">Founding Mentors</p>
            <h1 className="mt-4 text-3xl font-semibold text-white">{heroIntro[0]}</h1>
            <p className="mt-6 text-base text-slate-200">{heroIntro[1]}</p>
            <p className="mt-4 text-base text-slate-200">{heroIntro[2]}</p>
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
                <h2 className="mt-4 text-2xl font-semibold">High-Ticket Mentor Spotlight</h2>
                <p className="mt-3 text-sm text-amber-50">
                  Enjoy an elevated experience that mirrors the stature of your expertise. This private lounge is dedicated to mentors who lead with vision and integrity.
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
            <h3 className="text-xl font-semibold text-white">🔹 Why Join as a Founding Mentor?</h3>
            <ul className="mt-6 grid gap-4 text-base text-slate-100 md:grid-cols-2">
              {reasonsToJoin.map(reason => (
                <li key={reason} className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/20 p-4 text-sm leading-relaxed text-slate-200">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-300" aria-hidden />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8">
            <h3 className="text-xl font-semibold text-white">⚙️ The Enrolment Process</h3>
            <p className="mt-2 text-sm text-slate-200">There are two simple steps to join our mentor network:</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {enrolmentSteps.map(step => (
                <div key={step.title} className="rounded-2xl border border-white/10 bg-black/20 p-6">
                  <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                  <div className="mt-4 space-y-3 text-sm text-slate-200">
                    {step.body.map(line => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-amber-200/60 bg-gradient-to-r from-amber-500/20 via-transparent to-transparent p-8">
            <h3 className="text-xl font-semibold text-white">🎁 Exclusive Offer for Founding Mentors (By Personal Invitation Only)</h3>
            <div className="mt-4 space-y-4 text-sm text-white">
              {exclusiveOfferDetails.map(detail => (
                <p key={detail}>{detail}</p>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-xl font-semibold text-white">💬 Ready to Lead the Way?</h3>
            <p className="mt-4 text-sm text-slate-200">
              Join us in building a space where experience meets purpose — and where every conversation creates lasting impact.Together, let’s make mentorship more personal, measurable, and transformative.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button className="bg-amber-400/90 text-black hover:bg-amber-300">
                👉 [Accept Your Invitation →]
              </Button>
              <p className="text-xs text-amber-100">(Exclusive to personally invited mentors. Limited early-access seats available.)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
