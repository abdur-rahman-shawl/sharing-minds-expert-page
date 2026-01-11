'use client'

import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { useMentorStatus } from '@/hooks/use-mentor-status'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import {
    Loader2,
    LogIn,
    UserPlus,
    FileEdit,
    Clock,
    Sparkles,
    XCircle,
    RefreshCw,
    ArrowRight,
    Crown,
    Mail
} from 'lucide-react'

type VerificationStatus = 'YET_TO_APPLY' | 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED' | 'REVERIFICATION'

interface StatusConfig {
    icon: React.ReactNode
    iconBg: string
    title: string
    description: string
    subdescription?: string
    primaryAction?: {
        label: string
        href: string
        variant?: 'default' | 'outline'
    }
    secondaryAction?: {
        label: string
        href: string
    }
    showVipBadge?: boolean
}

const statusConfigs: Record<VerificationStatus, StatusConfig> = {
    YET_TO_APPLY: {
        icon: <FileEdit className="h-8 w-8 text-amber-400" />,
        iconBg: 'bg-amber-500/20',
        title: 'Complete Your Registration',
        description: 'Your mentor profile is incomplete. Complete your registration to join our founding mentor network.',
        primaryAction: {
            label: 'Continue Registration',
            href: '/registration'
        },
        secondaryAction: {
            label: 'Back to Home',
            href: '/'
        }
    },
    IN_PROGRESS: {
        icon: <Clock className="h-8 w-8 text-blue-400" />,
        iconBg: 'bg-blue-500/20',
        title: 'Application Under Review',
        description: 'Thank you for applying! Our team is carefully reviewing your profile to ensure the best experience for our community.',
        subdescription: 'This typically takes 2-3 business days. We\'ll notify you via email once the review is complete.',
        primaryAction: {
            label: 'Visit VIP Lounge',
            href: '/vip-lounge',
            variant: 'outline'
        },
        secondaryAction: {
            label: 'Back to Home',
            href: '/'
        }
    },
    VERIFIED: {
        icon: <Sparkles className="h-8 w-8 text-emerald-400" />,
        iconBg: 'bg-emerald-500/20',
        title: 'Dashboard Coming Soon',
        description: 'Congratulations, Founding Mentor! We\'re building an incredible dashboard experience just for you.',
        subdescription: 'Your personalized mentor dashboard with analytics, mentee management, and AI-powered tools is on the way.',
        primaryAction: {
            label: 'Visit VIP Lounge',
            href: '/vip-lounge'
        },
        secondaryAction: {
            label: 'Back to Home',
            href: '/'
        },
        showVipBadge: true
    },
    REJECTED: {
        icon: <XCircle className="h-8 w-8 text-red-400" />,
        iconBg: 'bg-red-500/20',
        title: 'Application Not Approved',
        description: 'Unfortunately, your application wasn\'t approved at this time. This could be due to incomplete information or not meeting our current criteria.',
        subdescription: 'Don\'t worry — you can update your profile and reapply, or reach out to our team for guidance.',
        primaryAction: {
            label: 'Update & Reapply',
            href: '/registration'
        },
        secondaryAction: {
            label: 'Contact Support',
            href: '/contact'
        }
    },
    REVERIFICATION: {
        icon: <RefreshCw className="h-8 w-8 text-orange-400" />,
        iconBg: 'bg-orange-500/20',
        title: 'Verification Update Required',
        description: 'We need you to update some information in your profile to maintain your verified status.',
        subdescription: 'Please review and update your credentials to continue enjoying full platform access.',
        primaryAction: {
            label: 'Update Profile',
            href: '/registration'
        },
        secondaryAction: {
            label: 'Back to Home',
            href: '/'
        }
    }
}

export default function DashboardPage() {
    const router = useRouter()
    const { data: session, isPending: sessionLoading } = useSession()
    const { isMentor, mentor, isLoading: mentorLoading } = useMentorStatus()

    const isLoading = sessionLoading || mentorLoading

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen mt-[-80px] sm:mt-[-96px] pt-20 sm:pt-24 bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-amber-300 mx-auto" />
                    <p className="mt-4 text-slate-300 text-sm">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    // Not logged in
    if (!session?.user) {
        return (
            <DashboardCard
                icon={<LogIn className="h-8 w-8 text-indigo-400" />}
                iconBg="bg-indigo-500/20"
                title="Sign In Required"
                description="Please sign in to access your mentor dashboard and manage your profile."
                primaryAction={{
                    label: 'Sign In',
                    onClick: () => router.push(`/auth/login?callbackUrl=${encodeURIComponent('/dashboard')}`)
                }}
                secondaryAction={{
                    label: 'Back to Home',
                    onClick: () => router.push('/')
                }}
            />
        )
    }

    // Logged in but not a mentor
    if (!isMentor || !mentor) {
        return (
            <DashboardCard
                icon={<UserPlus className="h-8 w-8 text-purple-400" />}
                iconBg="bg-purple-500/20"
                badge={<Crown className="h-5 w-5 text-amber-400" />}
                title="Become a Founding Mentor"
                description="Join our exclusive circle of category-defining experts. Shape the future of mentorship and connect with ambitious mentees."
                subdescription="Founding mentors receive priority visibility, VIP access, and special early-adopter benefits."
                primaryAction={{
                    label: 'Apply as Mentor',
                    onClick: () => router.push('/registration')
                }}
                secondaryAction={{
                    label: 'Learn More',
                    onClick: () => router.push('/')
                }}
            />
        )
    }

    // Has mentor record - show status-specific content
    const status = mentor.verificationStatus as VerificationStatus
    const config = statusConfigs[status] || statusConfigs.YET_TO_APPLY

    return (
        <DashboardCard
            icon={config.icon}
            iconBg={config.iconBg}
            title={config.title}
            description={config.description}
            subdescription={config.subdescription}
            showVipBadge={config.showVipBadge}
            mentorName={mentor.fullName}
            mentorEmail={mentor.email}
            primaryAction={config.primaryAction ? {
                label: config.primaryAction.label,
                onClick: () => router.push(config.primaryAction!.href),
                variant: config.primaryAction.variant
            } : undefined}
            secondaryAction={config.secondaryAction ? {
                label: config.secondaryAction.label,
                onClick: () => router.push(config.secondaryAction!.href)
            } : undefined}
        />
    )
}

interface DashboardCardProps {
    icon: React.ReactNode
    iconBg: string
    badge?: React.ReactNode
    title: string
    description: string
    subdescription?: string
    showVipBadge?: boolean
    mentorName?: string
    mentorEmail?: string
    primaryAction?: {
        label: string
        onClick: () => void
        variant?: 'default' | 'outline'
    }
    secondaryAction?: {
        label: string
        onClick: () => void
    }
}

function DashboardCard({
    icon,
    iconBg,
    badge,
    title,
    description,
    subdescription,
    showVipBadge,
    mentorName,
    mentorEmail,
    primaryAction,
    secondaryAction
}: DashboardCardProps) {
    return (
        <div className="min-h-screen mt-[-80px] sm:mt-[-96px] pt-20 sm:pt-24 bg-gradient-to-b from-slate-950 via-slate-900 to-black flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-lg">
                {/* Main Card */}
                <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-50" />

                    {/* Card content */}
                    <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
                        {/* Header with badge */}
                        <div className="flex items-start justify-between mb-6">
                            <div className={`${iconBg} p-4 rounded-2xl`}>
                                {icon}
                            </div>
                            {badge && (
                                <div className="bg-amber-500/20 p-2 rounded-full">
                                    {badge}
                                </div>
                            )}
                            {showVipBadge && (
                                <Image
                                    src="/vip-access.jpeg"
                                    alt="VIP Member"
                                    width={56}
                                    height={56}
                                    className="h-14 w-14 rounded-full border-2 border-amber-300/60 shadow-lg shadow-amber-500/30"
                                />
                            )}
                        </div>

                        {/* Mentor info (if available) */}
                        {mentorName && (
                            <div className="mb-6 flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                    {mentorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">{mentorName}</p>
                                    {mentorEmail && (
                                        <p className="text-slate-400 text-xs flex items-center gap-1">
                                            <Mail className="h-3 w-3" />
                                            {mentorEmail}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-white mb-3">
                            {title}
                        </h1>

                        {/* Description */}
                        <p className="text-slate-300 text-sm leading-relaxed mb-3">
                            {description}
                        </p>

                        {/* Sub-description */}
                        {subdescription && (
                            <p className="text-slate-400 text-xs leading-relaxed mb-6 bg-white/5 rounded-lg p-3 border border-white/5">
                                {subdescription}
                            </p>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            {primaryAction && (
                                <Button
                                    onClick={primaryAction.onClick}
                                    className={`flex-1 h-11 font-medium group ${primaryAction.variant === 'outline'
                                        ? 'bg-transparent border border-white/20 text-white hover:bg-white/10'
                                        : 'bg-gradient-to-r from-amber-500 to-amber-400 text-black hover:from-amber-400 hover:to-amber-300 shadow-lg shadow-amber-500/25'
                                        }`}
                                >
                                    {primaryAction.label}
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            )}
                            {secondaryAction && (
                                <Button
                                    onClick={secondaryAction.onClick}
                                    variant="ghost"
                                    className="flex-1 h-11 text-slate-400 hover:text-white hover:bg-white/5"
                                >
                                    {secondaryAction.label}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-xs mt-6">
                    Need help? <a href="/contact" className="text-amber-400 hover:text-amber-300 underline">Contact our team</a>
                </p>
            </div>
        </div>
    )
}
