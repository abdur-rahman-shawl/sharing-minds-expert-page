'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useSession } from '@/lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Loader2,
    Pencil,
    X,
    Save,
    Camera,
    Upload,
    FileText,
    Trash2,
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Globe,
    Linkedin,
    Github,
    ExternalLink,
    Sparkles,
    Check,
    AlertCircle,
} from 'lucide-react'

interface MentorFormData {
    fullName: string
    email: string
    phone: string
    title: string
    company: string
    city: string
    state: string
    country: string
    industry: string
    expertise: string
    experience: string
    about: string
    linkedinUrl: string
    githubUrl: string
    websiteUrl: string
    hourlyRate: string
    currency: string
    availability: string
    headline: string
    maxMentees: string
    profileImageUrl: string
    bannerImageUrl: string
    resumeUrl: string
    verificationStatus: string
    verificationNotes: string
    isAvailable: boolean
}

const INITIAL_STATE: MentorFormData = {
    fullName: '',
    email: '',
    phone: '',
    title: '',
    company: '',
    city: '',
    state: '',
    country: '',
    industry: '',
    expertise: '',
    experience: '',
    about: '',
    linkedinUrl: '',
    githubUrl: '',
    websiteUrl: '',
    hourlyRate: '',
    currency: 'USD',
    availability: '',
    headline: '',
    maxMentees: '10',
    profileImageUrl: '',
    bannerImageUrl: '',
    resumeUrl: '',
    verificationStatus: 'IN_PROGRESS',
    verificationNotes: '',
    isAvailable: true,
}

export function MentorProfileEdit() {
    const { mentorProfile, refreshUserData } = useAuth()
    const { data: session } = useSession()

    const [mentorData, setMentorData] = useState<MentorFormData>(INITIAL_STATE)
    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [isUploadingBanner, setIsUploadingBanner] = useState(false)
    const [isUploadingResume, setIsUploadingResume] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [imageRefresh, setImageRefresh] = useState(Date.now())
    const [bannerRefresh, setBannerRefresh] = useState(Date.now())

    const profileInputRef = useRef<HTMLInputElement>(null)
    const bannerInputRef = useRef<HTMLInputElement>(null)
    const resumeInputRef = useRef<HTMLInputElement>(null)

    // Sync with context data
    useEffect(() => {
        if (mentorProfile && !isEditing) {
            setMentorData({
                fullName: mentorProfile.fullName || (session?.user as any)?.name || '',
                email: mentorProfile.email || (session?.user as any)?.email || '',
                phone: mentorProfile.phone || '',
                title: mentorProfile.title || '',
                company: mentorProfile.company || '',
                city: mentorProfile.city || '',
                state: mentorProfile.state || '',
                country: mentorProfile.country || '',
                industry: mentorProfile.industry || '',
                expertise: mentorProfile.expertise || '',
                experience: mentorProfile.experience?.toString() || '',
                about: mentorProfile.about || '',
                linkedinUrl: mentorProfile.linkedinUrl || '',
                githubUrl: mentorProfile.githubUrl || '',
                websiteUrl: mentorProfile.websiteUrl || '',
                hourlyRate: mentorProfile.hourlyRate?.toString() || '',
                currency: mentorProfile.currency || 'USD',
                availability: mentorProfile.availability || '',
                headline: mentorProfile.headline || '',
                maxMentees: mentorProfile.maxMentees?.toString() || '10',
                profileImageUrl: mentorProfile.profileImageUrl || '',
                bannerImageUrl: mentorProfile.bannerImageUrl || '',
                resumeUrl: mentorProfile.resumeUrl || '',
                verificationStatus: mentorProfile.verificationStatus || 'IN_PROGRESS',
                verificationNotes: mentorProfile.verificationNotes || '',
                isAvailable: mentorProfile.isAvailable !== false,
            })
        }
    }, [mentorProfile, isEditing, session?.user])

    const handleChange = (field: keyof MentorFormData) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setMentorData((prev) => ({ ...prev, [field]: e.target.value }))
    }

    const handleToggle = (field: keyof MentorFormData) => () => {
        setMentorData((prev) => ({ ...prev, [field]: !prev[field] }))
    }

    // ── File Uploads ──

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !session?.user?.id) return

        setIsUploadingImage(true)
        setError(null)
        try {
            const formData = new FormData()
            formData.append('userId', session.user.id)
            formData.append('profilePicture', file)

            const res = await fetch('/api/mentors/update-profile', { method: 'POST', body: formData })
            const data = await res.json()

            if (!data.success) throw new Error(data.error)

            setMentorData((prev) => ({ ...prev, profileImageUrl: data.data.profileImageUrl || prev.profileImageUrl }))
            setImageRefresh(Date.now())
            setSuccess('Profile picture updated')
            await refreshUserData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload image')
        } finally {
            setIsUploadingImage(false)
            if (profileInputRef.current) profileInputRef.current.value = ''
        }
    }

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !session?.user?.id) return

        setIsUploadingBanner(true)
        setError(null)
        try {
            const formData = new FormData()
            formData.append('userId', session.user.id)
            formData.append('bannerImage', file)

            const res = await fetch('/api/mentors/update-profile', { method: 'POST', body: formData })
            const data = await res.json()

            if (!data.success) throw new Error(data.error)

            setMentorData((prev) => ({ ...prev, bannerImageUrl: data.data.bannerImageUrl || prev.bannerImageUrl }))
            setBannerRefresh(Date.now())
            setSuccess('Banner image updated')
            await refreshUserData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload banner')
        } finally {
            setIsUploadingBanner(false)
            if (bannerInputRef.current) bannerInputRef.current.value = ''
        }
    }

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !session?.user?.id) return

        // Client-side validation
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        const ext = file.name.split('.').pop()?.toLowerCase()
        if (!allowedTypes.includes(file.type) && !['pdf', 'doc', 'docx'].includes(ext || '')) {
            setError('Invalid file type. Only PDF, DOC, and DOCX files are allowed.')
            return
        }
        if (file.size > 10 * 1024 * 1024) {
            setError('Resume file too large. Max 10MB.')
            return
        }

        setIsUploadingResume(true)
        setError(null)
        try {
            const formData = new FormData()
            formData.append('userId', session.user.id)
            formData.append('resume', file)

            const res = await fetch('/api/mentors/update-profile', { method: 'POST', body: formData })
            const data = await res.json()

            if (!data.success) throw new Error(data.error)

            setMentorData((prev) => ({ ...prev, resumeUrl: data.data.resumeUrl || prev.resumeUrl }))
            setSuccess('Resume uploaded successfully')
            await refreshUserData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to upload resume')
        } finally {
            setIsUploadingResume(false)
            if (resumeInputRef.current) resumeInputRef.current.value = ''
        }
    }

    // ── Form Submit ──

    const handleSave = async () => {
        if (!session?.user?.id) return

        setIsSaving(true)
        setError(null)
        setSuccess(null)

        try {
            const res = await fetch('/api/mentors/update-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session.user.id,
                    fullName: mentorData.fullName,
                    email: mentorData.email,
                    phone: mentorData.phone,
                    title: mentorData.title,
                    company: mentorData.company,
                    city: mentorData.city,
                    state: mentorData.state,
                    country: mentorData.country,
                    industry: mentorData.industry,
                    expertise: mentorData.expertise,
                    experience: mentorData.experience ? parseInt(mentorData.experience) : null,
                    about: mentorData.about,
                    linkedinUrl: mentorData.linkedinUrl,
                    githubUrl: mentorData.githubUrl,
                    websiteUrl: mentorData.websiteUrl,
                    hourlyRate: mentorData.hourlyRate ? parseFloat(mentorData.hourlyRate) : null,
                    currency: mentorData.currency,
                    availability: mentorData.availability,
                    headline: mentorData.headline,
                    maxMentees: mentorData.maxMentees ? parseInt(mentorData.maxMentees) : 10,
                    profileImageUrl: mentorData.profileImageUrl,
                    bannerImageUrl: mentorData.bannerImageUrl,
                    resumeUrl: mentorData.resumeUrl,
                    verificationNotes: mentorData.verificationNotes,
                    isAvailable: mentorData.isAvailable,
                }),
            })

            const data = await res.json()

            if (!data.success) throw new Error(data.error)

            setSuccess('Profile updated successfully!')
            setIsEditing(false)
            await refreshUserData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save profile')
        } finally {
            setIsSaving(false)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setError(null)
        setSuccess(null)
    }

    const initials = mentorData.fullName
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || '?'

    const profileImgSrc = mentorData.profileImageUrl
        ? `${mentorData.profileImageUrl}?t=${imageRefresh}`
        : ''

    const bannerImgSrc = mentorData.bannerImageUrl
        ? `${mentorData.bannerImageUrl}?t=${bannerRefresh}`
        : ''

    // ── Render ──

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Alerts */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm text-red-300">{error}</p>
                    </div>
                    <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
            {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-start gap-3">
                    <Check className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-emerald-300 flex-1">{success}</p>
                    <button onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-300">
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {/* Banner + Profile Picture Header */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800">
                {/* Banner */}
                <div className="relative h-40 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950">
                    {bannerImgSrc && (
                        <img
                            src={bannerImgSrc}
                            alt="Banner"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                    {/* Banner upload button */}
                    <button
                        onClick={() => bannerInputRef.current?.click()}
                        disabled={isUploadingBanner}
                        className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-900/70 text-slate-300 text-xs font-medium backdrop-blur-sm border border-slate-700/50 hover:bg-slate-800/70 transition-colors disabled:opacity-50"
                    >
                        {isUploadingBanner ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-1.5">
                                <Camera className="h-3 w-3" />
                                Change Banner
                            </span>
                        )}
                    </button>
                    <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerUpload} />
                </div>

                {/* Profile section */}
                <div className="relative px-6 pb-5 -mt-12">
                    <div className="flex items-end gap-4">
                        {/* Avatar */}
                        <div className="relative group">
                            <Avatar className="h-24 w-24 border-4 border-slate-950 shadow-xl">
                                <AvatarImage src={profileImgSrc} alt={mentorData.fullName} />
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <button
                                onClick={() => profileInputRef.current?.click()}
                                disabled={isUploadingImage}
                                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                {isUploadingImage ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Camera className="h-5 w-5" />
                                )}
                            </button>
                            <input ref={profileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </div>

                        {/* Name + badge */}
                        <div className="flex-1 min-w-0 pb-1">
                            <h2 className="text-xl font-bold text-white truncate">{mentorData.fullName || 'Your Name'}</h2>
                            {mentorData.headline && (
                                <p className="text-sm text-slate-400 truncate">{mentorData.headline}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    Founding Mentor
                                </span>
                            </div>
                        </div>

                        {/* Edit / Save / Cancel buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 bg-slate-800/60 border border-slate-700 hover:bg-slate-700/60 transition-colors"
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <X className="h-3 w-3" />
                                            Cancel
                                        </span>
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50"
                                    >
                                        {isSaving ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <span className="flex items-center gap-1.5">
                                                <Save className="h-3 w-3" />
                                                Save Changes
                                            </span>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => { setIsEditing(true); setError(null); setSuccess(null) }}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <Pencil className="h-3 w-3" />
                                        Edit Profile
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* About — full width */}
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5">
                <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-400" />
                    About
                </h3>
                {isEditing ? (
                    <textarea
                        value={mentorData.about}
                        onChange={handleChange('about')}
                        rows={5}
                        className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/40 resize-none placeholder:text-slate-600"
                        placeholder="Tell mentees about yourself, your background, and what you can help with..."
                    />
                ) : (
                    <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">
                        {mentorData.about || '—'}
                    </p>
                )}
            </div>

            {/* Form sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Personal Info */}
                <FormSection title="Personal Information" icon={User}>
                    <FormField label="Full Name" value={mentorData.fullName} field="fullName" editing={isEditing} onChange={handleChange} icon={User} />
                    <FormField label="Email" value={mentorData.email} field="email" editing={isEditing} onChange={handleChange} type="email" icon={Mail} />
                    <FormField label="Phone" value={mentorData.phone} field="phone" editing={isEditing} onChange={handleChange} type="tel" icon={Phone} />
                    <FormField label="Headline" value={mentorData.headline} field="headline" editing={isEditing} onChange={handleChange} icon={Briefcase} placeholder="e.g. Senior Software Engineer | AI Specialist" />
                </FormSection>

                {/* Location */}
                <FormSection title="Location" icon={MapPin}>
                    <FormField label="City" value={mentorData.city} field="city" editing={isEditing} onChange={handleChange} icon={MapPin} />
                    <FormField label="State" value={mentorData.state} field="state" editing={isEditing} onChange={handleChange} icon={MapPin} />
                    <FormField label="Country" value={mentorData.country} field="country" editing={isEditing} onChange={handleChange} icon={MapPin} />
                </FormSection>

                {/* Professional */}
                <FormSection title="Professional Details" icon={Briefcase}>
                    <FormField label="Title" value={mentorData.title} field="title" editing={isEditing} onChange={handleChange} icon={Briefcase} />
                    <FormField label="Company" value={mentorData.company} field="company" editing={isEditing} onChange={handleChange} icon={Briefcase} />
                    <FormField label="Industry" value={mentorData.industry} field="industry" editing={isEditing} onChange={handleChange} icon={Briefcase} />
                    <FormField label="Expertise" value={mentorData.expertise} field="expertise" editing={isEditing} onChange={handleChange} icon={Briefcase} placeholder="e.g. Machine Learning, Product Management" />
                    <FormField label="Experience (years)" value={mentorData.experience} field="experience" editing={isEditing} onChange={handleChange} type="number" icon={Briefcase} />
                </FormSection>

                {/* Links */}
                <FormSection title="Links" icon={Globe}>
                    <FormField label="LinkedIn URL" value={mentorData.linkedinUrl} field="linkedinUrl" editing={isEditing} onChange={handleChange} type="url" icon={Linkedin} link />
                    <FormField label="GitHub URL" value={mentorData.githubUrl} field="githubUrl" editing={isEditing} onChange={handleChange} type="url" icon={Github} link />
                    <FormField label="Website URL" value={mentorData.websiteUrl} field="websiteUrl" editing={isEditing} onChange={handleChange} type="url" icon={Globe} link />
                </FormSection>

                {/* Mentoring */}
                <FormSection title="Mentoring Preferences" icon={User}>
                    <FormField label="Hourly Rate ($)" value={mentorData.hourlyRate} field="hourlyRate" editing={isEditing} onChange={handleChange} type="number" icon={Briefcase} />
                    <FormField label="Currency" value={mentorData.currency} field="currency" editing={isEditing} onChange={handleChange} icon={Briefcase} />
                    <FormField label="Max Mentees" value={mentorData.maxMentees} field="maxMentees" editing={isEditing} onChange={handleChange} type="number" icon={User} />
                    {isEditing ? (
                        <div className="flex items-center justify-between py-2">
                            <label className="text-xs text-slate-400">Available for bookings</label>
                            <button
                                onClick={handleToggle('isAvailable')}
                                className={`relative w-10 h-5 rounded-full transition-colors ${mentorData.isAvailable ? 'bg-emerald-600' : 'bg-slate-700'}`}
                            >
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${mentorData.isAvailable ? 'translate-x-5' : ''}`} />
                            </button>
                        </div>
                    ) : (
                        <FormField label="Available" value={mentorData.isAvailable ? 'Yes' : 'No'} field="isAvailable" editing={false} onChange={handleChange} icon={User} />
                    )}
                </FormSection>

                {/* Documents */}
                <FormSection title="Documents" icon={FileText}>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1.5">Resume / CV</label>
                            {mentorData.resumeUrl ? (
                                <div className="flex items-center gap-2 bg-slate-800/40 rounded-lg p-2.5 border border-slate-700/30">
                                    <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                                    <a
                                        href={mentorData.resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-indigo-400 hover:text-indigo-300 truncate flex-1"
                                    >
                                        View uploaded resume
                                        <ExternalLink className="inline h-3 w-3 ml-1" />
                                    </a>
                                    <button
                                        onClick={() => resumeInputRef.current?.click()}
                                        disabled={isUploadingResume}
                                        className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-700/40"
                                    >
                                        {isUploadingResume ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Replace'}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => resumeInputRef.current?.click()}
                                    disabled={isUploadingResume}
                                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600 transition-colors text-xs"
                                >
                                    {isUploadingResume ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4" />
                                            Upload Resume (PDF, DOC, DOCX, max 10MB)
                                        </>
                                    )}
                                </button>
                            )}
                            <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
                        </div>
                    </div>
                </FormSection>
            </div>

            {/* Bottom save bar (sticky, only in edit mode) */}
            {isEditing && (
                <div className="sticky bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 p-4 -mx-6 flex items-center justify-between rounded-b-xl">
                    <p className="text-xs text-slate-500">Unsaved changes will be lost if you navigate away.</p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCancel}
                            className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Saving...
                                </span>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Sub-components ──

function FormSection({ title, icon: Icon, children }: {
    title: string
    icon: React.ElementType
    children: React.ReactNode
}) {
    return (
        <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <Icon className="h-4 w-4 text-indigo-400" />
                {title}
            </h3>
            <div className="space-y-3">
                {children}
            </div>
        </div>
    )
}

function FormField({ label, value, field, editing, onChange, type = 'text', icon: Icon, placeholder, link }: {
    label: string
    value: string | boolean
    field: keyof MentorFormData
    editing: boolean
    onChange: (field: keyof MentorFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
    type?: string
    icon?: React.ElementType
    placeholder?: string
    link?: boolean
}) {
    const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value

    if (!editing) {
        return (
            <div className="flex items-start gap-2.5">
                {Icon && <Icon className="h-4 w-4 text-slate-600 mt-0.5 shrink-0" />}
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wider">{label}</p>
                    {link && displayValue ? (
                        <a
                            href={displayValue as string}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 truncate"
                        >
                            {(displayValue as string).replace(/https?:\/\/(www\.)?/, '').slice(0, 40)}
                            <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                    ) : (
                        <p className="text-sm text-slate-300 truncate">{displayValue || '—'}</p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div>
            <label className="text-[11px] text-slate-500 uppercase tracking-wider block mb-1">{label}</label>
            <input
                type={type}
                value={displayValue as string}
                onChange={onChange(field)}
                placeholder={placeholder || label}
                className="w-full bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/40 placeholder:text-slate-600"
            />
        </div>
    )
}
