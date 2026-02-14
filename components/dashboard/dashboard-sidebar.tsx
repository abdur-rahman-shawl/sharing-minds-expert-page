'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    Clock,
    MessageSquare,
    CreditCard,
    DollarSign,
    Star,
    BarChart3,
    FolderOpen,
    UserCircle,
    Settings,
    LogOut,
    Home,
    Sparkles,
} from 'lucide-react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuBadge,
    SidebarSeparator,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/contexts/auth-context'

interface MentorData {
    id: string
    fullName: string
    email: string
    verificationStatus: string
    registeredAt?: string
}

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Mentees', href: '/dashboard/mentees', icon: Users },
    { label: 'Schedule', href: '/dashboard/schedule', icon: CalendarDays },
    { label: 'Availability', href: '/dashboard/availability', icon: Clock },
    { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare, badge: 0 },
    { label: 'Subscription', href: '/dashboard/subscription', icon: CreditCard },
    { label: 'Earnings', href: '/dashboard/earnings', icon: DollarSign },
    { label: 'Reviews', href: '/dashboard/reviews', icon: Star },
    { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { label: 'My Content', href: '/dashboard/content', icon: FolderOpen },
    { label: 'Profile', href: '/dashboard/profile', icon: UserCircle },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardSidebar({ mentor }: { mentor: MentorData }) {
    const pathname = usePathname()
    const router = useRouter()
    const { signOut } = useAuth()

    const initials = mentor.fullName
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || '?'

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard'
        return pathname.startsWith(href)
    }

    const handleSignOut = async () => {
        await signOut()
        router.push('/')
    }

    return (
        <Sidebar
            className="border-r border-slate-800"
            style={{
                '--sidebar-background': '15 23 42',       // slate-900
                '--sidebar-foreground': '226 232 240',     // slate-200
                '--sidebar-accent': '30 41 59',            // slate-800
                '--sidebar-accent-foreground': '248 250 252', // slate-50
            } as React.CSSProperties}
        >
            {/* Profile header */}
            <SidebarHeader className="p-4 bg-slate-900/80">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-amber-400/40">
                        <AvatarImage src="" alt={mentor.fullName} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{mentor.fullName}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <Sparkles className="h-3 w-3 text-amber-400" />
                            <span className="text-[11px] text-amber-400 font-medium">Founding Mentor</span>
                        </div>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarSeparator className="bg-slate-800" />

            {/* Navigation */}
            <SidebarContent className="bg-slate-900">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => {
                                const active = isActive(item.href)
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={active}
                                            tooltip={item.label}
                                            className={`
                                                h-10 px-3 rounded-lg transition-all duration-150
                                                ${active
                                                    ? 'bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/20'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                                                }
                                            `}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className={`h-4 w-4 ${active ? 'text-indigo-400' : ''}`} />
                                                <span>{item.label}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <SidebarMenuBadge className="bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                                {item.badge}
                                            </SidebarMenuBadge>
                                        )}
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarSeparator className="bg-slate-800" />

            {/* Footer */}
            <SidebarFooter className="p-3 bg-slate-900">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            tooltip="Back to Home"
                            className="h-9 px-3 text-slate-500 hover:text-white hover:bg-slate-800/60 rounded-lg"
                        >
                            <Link href="/">
                                <Home className="h-4 w-4" />
                                <span>Back to Home</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip="Sign Out"
                            onClick={handleSignOut}
                            className="h-9 px-3 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
