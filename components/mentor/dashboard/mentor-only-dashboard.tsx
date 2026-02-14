"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Users,
    Calendar,
    DollarSign,
    Clock,
    AlertCircle,
    CheckCircle,
    XCircle,
    RefreshCw,
    FileText,
    Star,
    MessageSquare,
    Video,
    ArrowRight,
} from "lucide-react"
import {
    useMentorDashboardStats,
    useMentorRecentSessions,
    useMentorRecentMessages
} from "@/hooks/use-mentor-dashboard"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { MentorAnalyticsSection } from './mentor-analytics-section'
import Link from "next/link"

interface MentorOnlyDashboardProps {
    user?: any
}

export function MentorOnlyDashboard({ user }: MentorOnlyDashboardProps) {
    const { mentorProfile, isLoading: profileLoading } = useAuth()
    const { stats, isLoading: statsLoading } = useMentorDashboardStats()
    const { data: recentSessions, isLoading: sessionsLoading } = useMentorRecentSessions(5)
    const { data: recentMessages, isLoading: messagesLoading } = useMentorRecentMessages(5)
    // const { sessionsToReview, isLoading: reviewsLoading, error: reviewsError } = useMentorPendingReviews(user) // TODO: Implement reviews UI
    const router = useRouter()

    // Normalize data structure
    const sessions = recentSessions?.sessions || [];
    const messages = recentMessages?.messages || [];

    const getVerificationStatusInfo = (status: string) => {
        switch (status) {
            case 'YET_TO_APPLY':
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: FileText,
                    title: 'Complete Application',
                    message: 'Set up your mentor profile to start accepting mentees'
                }
            case 'IN_PROGRESS':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: Clock,
                    title: 'Under Review',
                    message: 'Your application is being reviewed by our team'
                }
            case 'VERIFIED':
                return {
                    color: 'bg-green-100 text-green-800',
                    icon: CheckCircle,
                    title: 'Verified Mentor',
                    message: 'You can now accept mentees and conduct sessions'
                }
            case 'REJECTED':
                return {
                    color: 'bg-red-100 text-red-800',
                    icon: XCircle,
                    title: 'Application Rejected',
                    message: 'Please review feedback and reapply'
                }
            case 'REVERIFICATION':
                return {
                    color: 'bg-orange-100 text-orange-800',
                    icon: RefreshCw,
                    title: 'Additional Info Required',
                    message: 'Please provide the requested information'
                }
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: AlertCircle,
                    title: 'Unknown Status',
                    message: 'Please contact support'
                }
        }
    }

    if (profileLoading || statsLoading) {
        return (
            <div className="space-y-4">
                <div className="space-y-1">
                    <Skeleton className="h-7 w-64" />
                    <Skeleton className="h-4 w-80" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="py-3">
                            <CardHeader className="py-0 pb-1">
                                <Skeleton className="h-3 w-20" />
                            </CardHeader>
                            <CardContent className="py-0">
                                <Skeleton className="h-6 w-16" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    const verificationInfo = mentorProfile
        ? getVerificationStatusInfo(mentorProfile.verificationStatus)
        : getVerificationStatusInfo('YET_TO_APPLY')

    const StatusIcon = verificationInfo.icon
    const isVerified = mentorProfile?.verificationStatus === 'VERIFIED'

    // If not verified, show restricted view
    if (!isVerified) {
        return (
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👨‍🏫</h1>
                        <p className="text-gray-600 mt-1">Complete your verification to start mentoring</p>
                    </div>
                </div>

                {/* Verification Status - Prominent Display */}
                <Card className="border-l-4 border-l-orange-500">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <StatusIcon className="w-12 h-12 text-orange-500" />
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-gray-900">{verificationInfo.title}</h3>
                                <p className="text-gray-600 text-lg mt-1">{verificationInfo.message}</p>
                                {mentorProfile?.verificationNotes && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-700"><strong>Admin Notes:</strong> {mentorProfile.verificationNotes}</p>
                                    </div>
                                )}
                            </div>
                            <Badge className={`${verificationInfo.color} text-lg px-4 py-2`}>
                                {verificationInfo.title}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Restricted Access Message */}
                <Card className="bg-gray-50">
                    <CardContent className="pt-6">
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">Access Restricted</h3>
                            <p className="text-gray-600 mb-4">You need to be verified before you can access mentoring features.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Format rating display
    const ratingDisplay = stats?.averageRating
        ? stats.averageRating.toFixed(1)
        : 'N/A';

    const dashboardStats = [
        {
            title: "Active Mentees",
            value: stats?.activeMentees || 0,
            description: `Out of ${stats?.totalMentees || 0} total`,
            icon: Users,
            trend: (stats?.activeMentees ?? 0) > 0 ? "up" : "neutral",
            color: "text-blue-500"
        },
        {
            title: "This Month Earnings",
            value: `$${stats?.monthlyEarnings?.toFixed(2) || '0.00'}`,
            description: "Revenue this month",
            icon: DollarSign,
            trend: (stats?.monthlyEarnings ?? 0) > 0 ? "up" : "neutral",
            color: "text-green-500"
        },
        {
            title: "Upcoming Sessions",
            value: stats?.upcomingSessions || 0,
            description: `${stats?.completedSessions || 0} completed`,
            icon: Calendar,
            trend: (stats?.upcomingSessions ?? 0) > 0 ? "up" : "neutral",
            color: "text-purple-500"
        },
        {
            title: "Rating",
            value: ratingDisplay,
            description: `Based on ${stats?.totalReviews || 0} reviews`,
            icon: Star,
            trend: (stats?.averageRating ?? 0) >= 4 ? "up" : "neutral",
            color: "text-yellow-500"
        }
    ];

    return (
        <div className="space-y-4">
            {/* Welcome Section */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {(stats?.upcomingSessions ?? 0) > 0
                            ? `You have ${stats?.upcomingSessions} upcoming session${(stats?.upcomingSessions ?? 0) > 1 ? 's' : ''}`
                            : 'Manage your mentees and track your mentoring progress'}
                    </p>
                </div>
                <Button size="sm" onClick={() => router.push('/dashboard/mentor/mentees')}>
                    <Users className="mr-2 h-4 w-4" />
                    View All Mentees
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {dashboardStats.map((stat, index) => (
                    <Card key={index} className="py-3">
                        <CardHeader className="flex flex-row items-center justify-between py-0 pb-1 px-4">
                            <CardTitle className="text-xs font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`rounded p-1.5 ${stat.color.replace('text-', 'bg-').replace('500', '100')} dark:bg-opacity-20`}>
                                <stat.icon className={`h-3 w-3 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="py-0 px-4">
                            <div className="text-xl font-bold">{stat.value}</div>
                            <p className="text-[11px] text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Recent Sessions */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                        <div>
                            <CardTitle className="text-sm">Recent Sessions</CardTitle>
                            <CardDescription className="text-xs">Your latest mentoring sessions</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => router.push('/dashboard/mentor/schedule')}>
                            View All
                            <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                    </CardHeader>
                    <CardContent className="px-4 pb-3 pt-0">
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                            <div className="rounded-full bg-muted p-2 mb-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <p className="text-xs font-medium">No sessions scheduled</p>
                            <p className="text-[10px] text-muted-foreground">Start accepting mentees</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Messages */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                        <div>
                            <CardTitle className="text-sm">Recent Messages</CardTitle>
                            <CardDescription className="text-xs">Latest messages from mentees</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => router.push('/dashboard/mentor/messages')}>
                            View All
                            <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                    </CardHeader>
                    <CardContent className="px-4 pb-3 pt-0">
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                            <div className="rounded-full bg-muted p-2 mb-2">
                                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <p className="text-xs font-medium">No messages yet</p>
                            <p className="text-[10px] text-muted-foreground">Connect with mentees</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Section */}
            <MentorAnalyticsSection />
        </div>
    )
}
