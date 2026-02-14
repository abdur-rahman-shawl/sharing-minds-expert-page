'use client'

import { useEffect, useState } from 'react'
import { useMentorStatus } from '@/hooks/use-mentor-status'
import {
    UserCircle,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Globe,
    Linkedin,
    Github,
    ExternalLink,
    Sparkles,
    Loader2,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface FullMentorProfile {
    id: string
    fullName: string
    email: string
    phone: string | null
    title: string | null
    company: string | null
    industry: string | null
    expertise: string | null
    experience: number | null
    hourlyRate: string | null
    currency: string | null
    headline: string | null
    about: string | null
    city: string | null
    state: string | null
    country: string | null
    linkedinUrl: string | null
    githubUrl: string | null
    websiteUrl: string | null
    profileImageUrl: string | null
    maxMentees: number | null
    isAvailable: boolean
    verificationStatus: string
    createdAt: string
}

export default function ProfilePage() {
    const { mentor } = useMentorStatus()
    const [profile, setProfile] = useState<FullMentorProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/mentors/status')
                const data = await res.json()
                if (data.success && data.mentor) {
                    // For now, use the limited data we have
                    // When a full profile API is built, switch to that
                    setProfile({
                        id: data.mentor.id,
                        fullName: data.mentor.fullName || '',
                        email: data.mentor.email || '',
                        phone: null,
                        title: null,
                        company: null,
                        industry: null,
                        expertise: null,
                        experience: null,
                        hourlyRate: null,
                        currency: 'USD',
                        headline: null,
                        about: null,
                        city: null,
                        state: null,
                        country: null,
                        linkedinUrl: null,
                        githubUrl: null,
                        websiteUrl: null,
                        profileImageUrl: null,
                        maxMentees: null,
                        isAvailable: true,
                        verificationStatus: data.mentor.verificationStatus,
                        createdAt: data.mentor.registeredAt,
                    })
                }
            } catch (err) {
                console.error('Failed to fetch profile:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
                <Loader2 className="h-8 w-8 animate-spin text-slate-500" />
            </div>
        )
    }

    if (!profile) return null

    const initials = profile.fullName
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || '?'

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            {/* Profile header card */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/20 p-6">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex items-start gap-5">
                    <Avatar className="h-20 w-20 border-2 border-amber-400/40 shrink-0">
                        <AvatarImage src={profile.profileImageUrl || ''} alt={profile.fullName} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold text-white">{profile.fullName}</h2>
                        {profile.headline && (
                            <p className="text-sm text-slate-400 mt-0.5">{profile.headline}</p>
                        )}
                        {(profile.title || profile.company) && (
                            <p className="text-sm text-slate-400 mt-0.5">
                                {[profile.title, profile.company].filter(Boolean).join(' at ')}
                            </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Sparkles className="h-3 w-3" />
                                Verified Founding Mentor
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileSection title="Contact Information">
                    <ProfileField icon={Mail} label="Email" value={profile.email} />
                    <ProfileField icon={Phone} label="Phone" value={profile.phone} />
                    <ProfileField
                        icon={MapPin}
                        label="Location"
                        value={[profile.city, profile.state, profile.country].filter(Boolean).join(', ') || null}
                    />
                </ProfileSection>

                <ProfileSection title="Professional Details">
                    <ProfileField icon={Briefcase} label="Industry" value={profile.industry} />
                    <ProfileField icon={Briefcase} label="Expertise" value={profile.expertise} />
                    <ProfileField
                        icon={Briefcase}
                        label="Experience"
                        value={profile.experience ? `${profile.experience} years` : null}
                    />
                </ProfileSection>

                <ProfileSection title="Links">
                    <ProfileLink icon={Linkedin} label="LinkedIn" url={profile.linkedinUrl} />
                    <ProfileLink icon={Github} label="GitHub" url={profile.githubUrl} />
                    <ProfileLink icon={Globe} label="Website" url={profile.websiteUrl} />
                </ProfileSection>

                <ProfileSection title="Mentoring">
                    <ProfileField
                        icon={UserCircle}
                        label="Hourly Rate"
                        value={profile.hourlyRate ? `${profile.currency || '$'}${profile.hourlyRate}` : null}
                    />
                    <ProfileField
                        icon={UserCircle}
                        label="Max Mentees"
                        value={profile.maxMentees?.toString() || null}
                    />
                    <ProfileField
                        icon={UserCircle}
                        label="Available"
                        value={profile.isAvailable ? 'Yes' : 'No'}
                    />
                </ProfileSection>
            </div>

            {/* About */}
            {profile.about && (
                <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5">
                    <h3 className="text-sm font-semibold text-slate-300 mb-2">About</h3>
                    <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{profile.about}</p>
                </div>
            )}

            {/* Edit notice */}
            <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 text-center">
                <p className="text-xs text-slate-500">
                    ✏️ Profile editing will be available soon. For now, if you need to update your information, please <a href="/contact" className="text-amber-400 hover:text-amber-300 underline">contact our team</a>.
                </p>
            </div>
        </div>
    )
}

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-3">{title}</h3>
            <div className="space-y-3">{children}</div>
        </div>
    )
}

function ProfileField({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null }) {
    return (
        <div className="flex items-start gap-2.5">
            <Icon className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
            <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="text-sm text-slate-300">{value || '—'}</p>
            </div>
        </div>
    )
}

function ProfileLink({ icon: Icon, label, url }: { icon: React.ElementType; label: string; url: string | null }) {
    return (
        <div className="flex items-start gap-2.5">
            <Icon className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />
            <div>
                <p className="text-[11px] text-slate-500 uppercase tracking-wider">{label}</p>
                {url ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                        {url.replace(/https?:\/\/(www\.)?/, '').slice(0, 40)}
                        <ExternalLink className="h-3 w-3" />
                    </a>
                ) : (
                    <p className="text-sm text-slate-300">—</p>
                )}
            </div>
        </div>
    )
}
