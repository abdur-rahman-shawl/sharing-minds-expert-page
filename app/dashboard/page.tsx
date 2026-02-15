'use client'

import { useMentorStatus } from '@/hooks/use-mentor-status'
import { StatCard } from '@/components/dashboard/stat-card'
import {
    Users,
    CalendarDays,
    DollarSign,
    Star,
    Sparkles,
    ArrowRight,
    TrendingUp,
    BookOpen,
    Clock,
} from 'lucide-react'
import Link from 'next/link'

export default function DashboardOverview() {
    const { mentor } = useMentorStatus()
    const firstName = mentor?.fullName?.split(' ')[0] || 'Mentor'

    return (
        <div className="p-6 space-y-6">
            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-800 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 p-6">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-5 w-5 text-amber-500 dark:text-amber-400" />
                        <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Founding Mentor</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        Welcome back, {firstName} 👋
                    </h2>
                    <p className="text-gray-500 dark:text-slate-400 text-sm max-w-lg">
                        Your personalized dashboard is taking shape. As a founding mentor, you&apos;ll be the first to access new features as they launch.
                    </p>
                </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Mentees"
                    value={0}
                    icon={Users}
                    subtitle="Launching soon"
                    accentColor="text-blue-400"
                />
                <StatCard
                    label="Sessions"
                    value={0}
                    icon={CalendarDays}
                    subtitle="Launching soon"
                    accentColor="text-emerald-400"
                />
                <StatCard
                    label="Earnings"
                    value="$0"
                    icon={DollarSign}
                    subtitle="Launching soon"
                    accentColor="text-amber-400"
                />
                <StatCard
                    label="Rating"
                    value="—"
                    icon={Star}
                    subtitle="No reviews yet"
                    accentColor="text-purple-400"
                />
            </div>

            {/* Quick actions */}
            <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <QuickAction
                        href="/dashboard/profile"
                        icon={TrendingUp}
                        label="Complete your profile"
                        description="Add more details to attract mentees"
                        color="text-indigo-400"
                    />
                    <QuickAction
                        href="/dashboard/availability"
                        icon={Clock}
                        label="Set your availability"
                        description="Define when mentees can book you"
                        color="text-emerald-400"
                    />
                    <QuickAction
                        href="/dashboard/content"
                        icon={BookOpen}
                        label="Upload learning materials"
                        description="Share resources with your mentees"
                        color="text-amber-400"
                    />
                </div>
            </div>

            {/* Platform status */}
            <div className="bg-gray-50 dark:bg-slate-900/40 rounded-xl border border-gray-200 dark:border-slate-800 p-5">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-500/10">
                        <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Platform Launch Update</h3>
                        <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                            The SharingMinds platform is currently in early access. Mentee matching, session scheduling,
                            and all dashboard features will be fully activated at launch. As a founding mentor, you&apos;ll
                            get priority access to every new feature.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function QuickAction({ href, icon: Icon, label, description, color }: {
    href: string
    icon: React.ElementType
    label: string
    description: string
    color: string
}) {
    return (
        <Link
            href={href}
            className="group flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-gray-50 dark:bg-slate-900/40 hover:bg-gray-100 dark:hover:bg-slate-800/40 transition-all duration-200"
        >
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800/80">
                <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                    {label}
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{description}</p>
            </div>
        </Link>
    )
}
