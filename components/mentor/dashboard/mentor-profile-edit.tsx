"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/auth-context"
import { uploadProfilePicture, uploadBannerImage } from "@/lib/storage";
import {
    Edit3,
    X,
    Loader2,
    User,
    Camera,
    CheckCircle2,
    Briefcase,
    MapPin,
    Globe,
    Linkedin,
    Github,
    DollarSign,
    AlertCircle,
    ImageIcon,
} from "lucide-react"



export function MentorProfileEdit() {
    const { session, mentorProfile, refreshUserData } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [isUploadingBanner, setIsUploadingBanner] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const [mentorData, setMentorData] = useState({
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
        isAvailable: true
    })

    // Load mentor profile data
    useEffect(() => {
        if (!mentorProfile) return;
        if (isEditing) return;

        setMentorData({
            fullName: mentorProfile.fullName || session?.user?.name || '',
            email: mentorProfile.email || session?.user?.email || '',
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
            hourlyRate: mentorProfile.hourlyRate || '',
            currency: mentorProfile.currency || 'USD',
            availability: mentorProfile.availability || '',
            headline: mentorProfile.headline || '',
            maxMentees: mentorProfile.maxMentees?.toString() || '10',
            profileImageUrl: mentorProfile.profileImageUrl || '',
            bannerImageUrl: mentorProfile.bannerImageUrl || '',
            resumeUrl: mentorProfile.resumeUrl || '',
            verificationStatus: mentorProfile.verificationStatus || 'IN_PROGRESS',
            verificationNotes: mentorProfile.verificationNotes || '',
            isAvailable: mentorProfile.isAvailable !== false
        })
    }, [mentorProfile, isEditing, session?.user])

    const handleSave = async () => {
        if (!session?.user?.id) return

        try {
            setIsUploadingImage(true)
            setError(null)

            const response = await fetch('/api/mentors/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: session.user.id,
                    ...mentorData,
                    experience: parseInt(mentorData.experience) || 0,
                    hourlyRate: parseFloat(mentorData.hourlyRate) || 0,
                    maxMentees: parseInt(mentorData.maxMentees) || 10
                }),
            })

            const result = await response.json()

            if (result.success) {
                setSuccess('Profile updated successfully!')
                setIsEditing(false)
                setTimeout(() => setSuccess(null), 3000)
                refreshUserData()
            } else {
                setError(result.error || 'Failed to update profile')
            }
        } catch (err) {
            setError('Failed to save profile')
            console.error('Save error:', err)
        } finally {
            setIsUploadingImage(false)
        }
    }

    const handleImageUpload = async (file: File) => {
        if (!session?.user?.id) return;

        try {
            setIsUploadingImage(true);
            const result = await uploadProfilePicture(file);
            setMentorData(prev => ({ ...prev, profileImageUrl: result.url }));
        } catch (error) {
            console.error('Failed to upload profile picture:', error);
            setError('Failed to upload profile picture');
        } finally {
            setIsUploadingImage(false);
        }
    }

    const handleBannerUpload = async (file: File) => {
        if (!session?.user?.id) return;

        try {
            setIsUploadingBanner(true);
            const result = await uploadBannerImage(file);
            setMentorData(prev => ({ ...prev, bannerImageUrl: result.url }));
        } catch (error) {
            console.error('Failed to upload banner image:', error);
            setError('Failed to upload banner image');
        } finally {
            setIsUploadingBanner(false);
        }
    }

    const industries = [
        "IT & Software", "Marketing & Advertising", "Finance & Banking", "Education",
        "Healthcare", "Entrepreneurship & Startup", "Design (UI/UX, Graphic)", "Sales",
        "Human Resources", "Other"
    ]

    const currencyOptions = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD'];

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Mentor Profile</h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">Manage your professional information and public profile</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                    <Button
                        variant={isEditing ? "outline" : "default"}
                        onClick={() => setIsEditing(!isEditing)}
                        className="gap-2 text-sm"
                        size="sm"
                    >
                        {isEditing ? (
                            <>
                                <X className="h-4 w-4" />
                                <span className="hidden xs:inline">Cancel</span> Editing
                            </>
                        ) : (
                            <>
                                <Edit3 className="h-4 w-4" />
                                <span className="hidden xs:inline">Edit</span> Profile
                            </>
                        )}
                    </Button>
                    {isEditing && (
                        <Button onClick={handleSave} disabled={isUploadingImage} className="gap-2 text-sm" size="sm">
                            {isUploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            <span className="hidden xs:inline">Save</span> Changes
                        </Button>
                    )}
                </div>
            </div>

            {/* Alerts */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Warning Alert when Editing */}
            {isEditing && (
                <Alert className="mb-6 border-yellow-200 bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-900">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <AlertTitle>Warning: Profile Update Requires Re-verification</AlertTitle>
                    <AlertDescription>
                        Saving changes to your profile will trigger a re-verification process.
                        <strong> You will not be able to accept new bookings or sessions until your profile is verified again.</strong>
                    </AlertDescription>
                </Alert>
            )}

            {/* Success Alert */}
            {success && (
                <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            {/* Profile Overview Card with Banner */}
            <Card className="overflow-hidden">
                {/* Banner Image */}
                <div className="relative h-32 sm:h-40 md:h-48 bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden group">
                    {mentorData.bannerImageUrl ? (
                        <img
                            src={mentorData.bannerImageUrl}
                            alt="Profile Banner"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                            <ImageIcon className="h-12 w-12 opacity-20" />
                        </div>
                    )}

                    {/* Banner Upload Overlay */}
                    {(isEditing || isUploadingBanner) && (
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleBannerUpload(file)
                                }}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={isUploadingBanner}
                            />
                            {isUploadingBanner ? (
                                <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-full flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Uploading...</span>
                                </div>
                            ) : (
                                <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-full flex items-center gap-2 font-medium hover:bg-white transition-colors">
                                    <Camera className="h-4 w-4" />
                                    <span>Change Cover</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <CardContent className="p-4 sm:p-6 md:p-8 relative -mt-10 sm:-mt-12">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                        <div className="relative flex-shrink-0 group">
                            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 border-4 border-background shadow-sm">
                                <AvatarImage src={mentorData.profileImageUrl || session?.user?.image || undefined} className="object-cover" />
                                <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
                                    {mentorData.fullName?.charAt(0) || session?.user?.name?.charAt(0) || 'M'}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold truncate">{mentorData.fullName || session?.user?.name || 'Your Name'}</h2>
                                <p className="text-sm sm:text-base text-muted-foreground font-medium truncate">
                                    {mentorData.title || 'Professional Title'}
                                    {mentorData.company && <span className="text-muted-foreground/80"> at {mentorData.company}</span>}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start pt-2">
                                <Badge variant={mentorProfile?.verificationStatus === 'VERIFIED' ? 'default' : 'secondary'}>
                                    {mentorProfile?.verificationStatus?.replace('_', ' ') || 'IN PROGRESS'}
                                </Badge>
                                {mentorData.hourlyRate && (
                                    <Badge variant="outline" className="gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        {mentorData.currency} {mentorData.hourlyRate}/hr
                                    </Badge>
                                )}
                                {mentorData.city && (
                                    <Badge variant="outline" className="gap-1">
                                        <MapPin className="h-3 w-3" />
                                        {mentorData.city}, {mentorData.country}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Left Column: Personal & Social */}
                <div className="space-y-4 sm:space-y-6 lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Personal Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    value={mentorData.fullName}
                                    onChange={(e) => setMentorData(prev => ({ ...prev, fullName: e.target.value }))}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={mentorData.email}
                                    onChange={(e) => setMentorData(prev => ({ ...prev, email: e.target.value }))}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={mentorData.phone}
                                    onChange={(e) => setMentorData(prev => ({ ...prev, phone: e.target.value }))}
                                    disabled={!isEditing}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                    id="city"
                                    value={mentorData.city}
                                    onChange={(e) => setMentorData(prev => ({ ...prev, city: e.target.value }))}
                                    disabled={!isEditing}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    value={mentorData.country}
                                    onChange={(e) => setMentorData(prev => ({ ...prev, country: e.target.value }))}
                                    disabled={!isEditing}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Globe className="h-5 w-5 text-primary" />
                                Social Presence
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="linkedin" className="flex items-center gap-2">
                                    <Linkedin className="h-4 w-4" /> LinkedIn
                                </Label>
                                <Input
                                    id="linkedin"
                                    value={mentorData.linkedinUrl}
                                    onChange={(e) => setMentorData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                                    disabled={!isEditing}
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="github" className="flex items-center gap-2">
                                    <Github className="h-4 w-4" /> GitHub
                                </Label>
                                <Input
                                    id="github"
                                    value={mentorData.githubUrl}
                                    onChange={(e) => setMentorData(prev => ({ ...prev, githubUrl: e.target.value }))}
                                    disabled={!isEditing}
                                    placeholder="https://github.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website" className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" /> Personal Website
                                </Label>
                                <Input
                                    id="website"
                                    value={mentorData.websiteUrl}
                                    onChange={(e) => setMentorData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                                    disabled={!isEditing}
                                    placeholder="https://..."
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Professional Details */}
                <div className="space-y-4 sm:space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader className="p-4 sm:p-6">
                            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                Professional & Expertise
                            </CardTitle>
                            <CardDescription className="text-xs sm:text-sm">Share your experience and what you can teach.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0 sm:pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Job Title</Label>
                                    <Input
                                        id="title"
                                        value={mentorData.title}
                                        onChange={(e) => setMentorData(prev => ({ ...prev, title: e.target.value }))}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="company">Company</Label>
                                    <Input
                                        id="company"
                                        value={mentorData.company}
                                        onChange={(e) => setMentorData(prev => ({ ...prev, company: e.target.value }))}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="industry">Industry</Label>
                                    <Select
                                        value={mentorData.industry}
                                        onValueChange={(value) => setMentorData(prev => ({ ...prev, industry: value }))}
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select industry" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {industries.map((industry) => (
                                                <SelectItem key={industry} value={industry}>
                                                    {industry}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="experience">Years of Experience</Label>
                                    <Input
                                        id="experience"
                                        type="number"
                                        min="0"
                                        value={mentorData.experience}
                                        onChange={(e) => setMentorData(prev => ({ ...prev, experience: e.target.value }))}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="headline">Professional Headline</Label>
                                <Input
                                    id="headline"
                                    value={mentorData.headline}
                                    onChange={(e) => setMentorData(prev => ({ ...prev, headline: e.target.value }))}
                                    disabled={!isEditing}
                                    placeholder="e.g. Senior Software Engineer at TechCorp"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="about">About Me</Label>
                                <Textarea
                                    id="about"
                                    value={mentorData.about}
                                    onChange={(e) => setMentorData(prev => ({ ...prev, about: e.target.value }))}
                                    disabled={!isEditing}
                                    className="min-h-[120px]"
                                    placeholder="Tell mentees about your journey..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expertise">Key Expertise (comma separated)</Label>
                                <Textarea
                                    id="expertise"
                                    value={mentorData.expertise}
                                    onChange={(e) => setMentorData(prev => ({ ...prev, expertise: e.target.value }))}
                                    disabled={!isEditing}
                                    placeholder="React, Leadership, Career Growth, etc."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                                Rates & Availability
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="hourlyRate">Hourly Rate ({mentorData.currency})</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input
                                            id="hourlyRate"
                                            type="number"
                                            min="0"
                                            className="pl-7"
                                            value={mentorData.hourlyRate}
                                            onChange={(e) => setMentorData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Select
                                        value={mentorData.currency}
                                        onValueChange={(value) => setMentorData(prev => ({ ...prev, currency: value }))}
                                        disabled={!isEditing}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="USD" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {currencyOptions.map((curr) => (
                                                <SelectItem key={curr} value={curr}>
                                                    {curr}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
