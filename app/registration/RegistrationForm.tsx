'use client'

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import SuccessMessage from "@/components/common/SuccessMessage"
import { useSession, signIn } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { FcGoogle } from "react-icons/fc"
import { FaLinkedin } from "react-icons/fa"
import { 
  ArrowLeft, Check, ChevronsUpDown, User, ArrowRight, Sparkles, 
  FileText, Shield, CreditCard, Users, Mail, Scale 
} from "lucide-react"
import { mentorApplicationSchema } from "@/lib/validations/mentor"
import { z } from "zod"
import { useMentorStatus } from "@/hooks/use-mentor-status"
import { legalDocuments, type LegalDocumentId } from "@/lib/legal-documents"
import { VipInvitation } from "@/components/vip/vip-invitation"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

// --- TYPES & HELPERS ---

type SearchableOption = { value: string; label: string }

function SearchableSelect({
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  disabled = false,
}: {
  value: string
  onChange: (value: string) => void
  options: SearchableOption[]
  placeholder: string
  searchPlaceholder?: string
  emptyMessage?: string
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)

  const selectedLabel = useMemo(
    () => options.find(option => option.value === value)?.label || "",
    [options, value]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-11 bg-white/50 border-slate-200 text-slate-700 hover:bg-white hover:border-indigo-300 transition-all"
          disabled={disabled}
        >
          <span className="truncate text-left font-normal">{selectedLabel || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                >
                  <Check className={`mr-2 h-4 w-4 ${option.value === value ? 'opacity-100' : 'opacity-0'}`} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const createLegalConsentState = () =>
  legalDocuments.reduce<Record<LegalDocumentId, boolean>>((acc, doc) => {
    acc[doc.id] = false
    return acc
  }, {} as Record<LegalDocumentId, boolean>)

const splitLegalContent = (content: string) =>
  content
    .split(/\r?\n\r?\n/)
    .map(paragraph => paragraph.trim())
    .filter(Boolean)

type LegalParagraphVariant = 'title' | 'subtitle' | 'heading' | 'body' | 'contact'

const classifyLegalParagraph = (paragraph: string, index: number): LegalParagraphVariant => {
  const trimmed = paragraph.trim()
  if (!trimmed) return 'body'
  if (index === 0) return 'title'
  if (trimmed.startsWith('Effective Date') || trimmed.startsWith('A Product')) return 'subtitle'
  if (trimmed.startsWith('📧') || trimmed.includes('@sharingminds.in') || trimmed.includes('@softwebnetworks.com')) return 'contact'
  if (trimmed === 'Our Commitment' || trimmed === 'Welcome to SharingMinds' || trimmed === 'Contact') return 'heading'
  if (trimmed.includes('️⃣') || /^\d+\./.test(trimmed)) return 'heading'
  if (!/[.!?]/.test(trimmed) && trimmed.length < 60) return 'heading'
  return 'body'
}

const getDocumentIcon = (id: string) => {
  switch (id) {
    case 'terms-of-use': return <Scale className="w-4 h-4" />
    case 'privacy-policy': return <Shield className="w-4 h-4" />
    case 'pricing-policy': return <CreditCard className="w-4 h-4" />
    case 'community-conduct-policy': return <Users className="w-4 h-4" />
    default: return <FileText className="w-4 h-4" />
  }
}

// --- MAIN COMPONENT ---

export default function RegistrationForm() {
  const [showMentorForm, setShowMentorForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<z.ZodError | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const { isMentor, mentor, isLoading: mentorStatusLoading } = useMentorStatus()
  const [legalConsents, setLegalConsents] = useState<Record<LegalDocumentId, boolean>>(() => createLegalConsentState())
  const [activeLegalDocument, setActiveLegalDocument] = useState<LegalDocumentId>(legalDocuments[0].id)
  const [showOtherIndustryInput, setShowOtherIndustryInput] = useState(false)

  const [countries, setCountries] = useState<{ id: number; name: string; phone_code?: string | null; code?: string | null }[]>([])
  const [states, setStates] = useState<{ id: number; name: string }[]>([])
  const [cities, setCities] = useState<{ id: number; name: string }[]>([])
  const [locationsLoading, setLocationsLoading] = useState({
    countries: false,
    states: false,
    cities: false,
  })

  const [mentorFormData, setMentorFormData] = useState<{
    fullName: string
    email: string
    phone: string
    phoneCountryCode: string
    countryId: string
    stateId: string
    cityId: string
    title: string
    company: string
    industry: string
    otherIndustry: string
    experience: string
    expertise: string
    about: string
    linkedinUrl: string
    profilePicture: File | null
    resume: File | null
    termsAccepted: boolean
    availability: string
  }>({
    fullName: "",
    email: "",
    phone: "",
    phoneCountryCode: "",
    countryId: "",
    stateId: "",
    cityId: "",
    title: "",
    company: "",
    industry: "",
    otherIndustry: "",
    experience: "",
    expertise: "",
    about: "",
    linkedinUrl: "",
    profilePicture: null,
    resume: null,
    termsAccepted: false,
    availability: "",
  })

  const countryOptions = useMemo<SearchableOption[]>(
    () => countries.map(country => ({ value: country.id.toString(), label: country.name })),
    [countries]
  )

  const phoneCodeOptions = useMemo<SearchableOption[]>(() => {
    const codes = countries
      .filter(country => country.phone_code)
      .map(country => ({ value: country.phone_code, label: `+${country.phone_code} (${country.name})` }))

    return codes.length > 0 ? codes : [{ value: '91', label: '+91 (India)' }]
  }, [countries])

  const stateOptions = useMemo<SearchableOption[]>(
    () => states.map(state => ({ value: state.id.toString(), label: state.name })),
    [states]
  )

  const cityOptions = useMemo<SearchableOption[]>(
    () => cities.map(city => ({ value: city.id.toString(), label: city.name })),
    [cities]
  )

  useEffect(() => {
    if (!mentorFormData.phoneCountryCode && phoneCodeOptions.length > 0) {
      setMentorFormData(prev => ({ ...prev, phoneCountryCode: phoneCodeOptions[0].value }))
    }
  }, [mentorFormData.phoneCountryCode, phoneCodeOptions])

  const allLegalConsentsProvided = legalDocuments.every(doc => legalConsents[doc.id])

  useEffect(() => {
    setMentorFormData(prev =>
      prev.termsAccepted === allLegalConsentsProvided
        ? prev
        : { ...prev, termsAccepted: allLegalConsentsProvided },
    )
  }, [allLegalConsentsProvided])

  useEffect(() => {
    setShowOtherIndustryInput(mentorFormData.industry === 'Other')
  }, [mentorFormData.industry])

  const handleConsentChange = (docId: LegalDocumentId, checked: boolean | "indeterminate") => {
    setLegalConsents(prev => ({ ...prev, [docId]: checked === true }))
  }

  useEffect(() => {
    const fetchCountries = async () => {
      setLocationsLoading(prev => ({ ...prev, countries: true }))
      try {
        const response = await fetch('/api/locations/countries')
        const data = await response.json()
        const countriesData = Array.isArray(data) ? data : []
        setCountries(countriesData)
        
        const india = countriesData.find((c: { name: string }) => c.name === 'India')
        if (india) {
          setMentorFormData(prev => ({ ...prev, countryId: india.id.toString(), phoneCountryCode: india.phone_code || prev.phoneCountryCode || '91' }))
        } else if (countriesData.length > 0 && countriesData[0].phone_code && !mentorFormData.phoneCountryCode) {
          setMentorFormData(prev => ({ ...prev, phoneCountryCode: countriesData[0].phone_code }))
        }
      } catch (error) {
        console.error("Failed to fetch countries", error)
      } finally {
        setLocationsLoading(prev => ({ ...prev, countries: false }))
      }
    }
    fetchCountries()
  }, [])

  useEffect(() => {
    if (mentorFormData.countryId) {
      const fetchStates = async () => {
        setLocationsLoading(prev => ({ ...prev, states: true }))
        setStates([])
        setCities([])
        setMentorFormData(prev => ({ ...prev, stateId: "", cityId: "" }))
        try {
          const response = await fetch(`/api/locations/states?countryId=${mentorFormData.countryId}`)
          const data = await response.json()
          setStates(Array.isArray(data) ? data : [])
        } catch (error) {
          console.error("Failed to fetch states", error)
        } finally {
          setLocationsLoading(prev => ({ ...prev, states: false }))
        }
      }
      fetchStates()
    }
  }, [mentorFormData.countryId])

  useEffect(() => {
    if (mentorFormData.stateId) {
      const fetchCities = async () => {
        setLocationsLoading(prev => ({ ...prev, cities: true }))
        setCities([])
        setMentorFormData(prev => ({ ...prev, cityId: "" }))
        try {
          const response = await fetch(`/api/locations/cities?stateId=${mentorFormData.stateId}`)
          const data = await response.json()
          setCities(Array.isArray(data) ? data : [])
        } catch (error) {
          console.error("Failed to fetch cities", error)
        } finally {
          setLocationsLoading(prev => ({ ...prev, cities: false }))
        }
      }
      fetchCities()
    }
  }, [mentorFormData.stateId])

  const [otp, setOtp] = useState("")
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mentorFormData.email)

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setMentorFormData(prev => ({ ...prev, profilePicture: file }))
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setProfilePicturePreview(null)
    }
  }

  const handleSendOtp = async () => {
    try {
      setOtpError(null)
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mentorFormData.email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send OTP")
      
      if (data.otp) console.log("Development OTP:", data.otp)
      setShowOtpInput(true)
      startCountdown()
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "Failed to send OTP")
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Please enter the OTP")
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: mentorFormData.email, otp }),
      })
      const data = await res.json()
      if (data.success) {
        setIsEmailVerified(true)
        setShowOtpInput(false)
        setOtpError(null)
      } else {
        setOtpError(data.error || "Invalid or expired OTP.")
      }
    } catch (err) {
      setOtpError("An unexpected error occurred.")
    }
  }

  const [countdown, setCountdown] = useState(10)
  const [isCountingDown, setIsCountingDown] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
    } else if (countdown === 0) {
      setIsCountingDown(false)
    }
    return () => clearTimeout(timer)
  }, [isCountingDown, countdown])

  const startCountdown = () => {
    setCountdown(30)
    setIsCountingDown(true)
  }

  const handleResendOtp = async () => {
    if (!isCountingDown) {
      setOtpError(null)
      try {
        const res = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: mentorFormData.email }),
        })
        const data = await res.json()
        if (data.success) {
          if (data.otp) console.log("Development OTP:", data.otp)
          startCountdown()
        } else {
          alert(data.error || "Failed to resend OTP")
        }
      } catch (err) {
        console.error("Error resending OTP:", err)
      }
    }
  }

  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      if (session.user.email && !mentorFormData.email) {
        setMentorFormData(prev => ({
          ...prev,
          email: session.user.email || '',
          fullName: session.user.name || prev.fullName
        }))
        setIsEmailVerified(true)
      }
      setShowMentorForm(true)
    }
  }, [session])

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/registration'
      })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLinkedInSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn.social({
        provider: 'linkedin',
        callbackURL: '/registration'
      })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMentorFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors(null)

    try {
      if (!session?.user?.id) {
        alert('Please log in before submitting the form')
        setIsLoading(false)
        return
      }

      const preparedIndustry = mentorFormData.industry === 'Other' ? mentorFormData.otherIndustry : mentorFormData.industry

      const validatedData = mentorApplicationSchema.parse({
        ...mentorFormData,
        industry: preparedIndustry,
        otherIndustry: mentorFormData.otherIndustry,
        country: mentorFormData.countryId,
        state: mentorFormData.stateId,
        city: mentorFormData.cityId,
        phone: `+${mentorFormData.phoneCountryCode}-${mentorFormData.phone}`,
      })

      const formData = new FormData()
      formData.append('userId', session.user.id)
      formData.append('fullName', validatedData.fullName)
      formData.append('email', validatedData.email)
      formData.append('phone', validatedData.phone)
      formData.append('countryId', validatedData.country)
      formData.append('stateId', validatedData.state)
      formData.append('cityId', validatedData.city)
      formData.append('title', validatedData.title)
      formData.append('company', validatedData.company)
      formData.append('industry', validatedData.industry)
      formData.append('expertise', validatedData.expertise)
      formData.append('experience', validatedData.experience)
      formData.append('about', validatedData.about || '')
      formData.append('linkedinUrl', validatedData.linkedinUrl)
      formData.append('availability', validatedData.availability)
      formData.append('profilePicture', validatedData.profilePicture)
      if (validatedData.resume) formData.append('resume', validatedData.resume)

      const res = await fetch('/api/mentors/apply', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      const result = await res.json()

      if (!result.success) {
        alert('Failed to submit application: ' + result.error)
        setIsLoading(false)
        return
      }

      setShowSuccessMessage(true)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error)
      } else {
        alert('Something went wrong while submitting your application.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        router.push('/')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showSuccessMessage, router])

  if (!mentorStatusLoading && isMentor && mentor) {
    const canAccessDashboard = mentor.verificationStatus === 'VERIFIED'
    return (
      <VipInvitation
        mentor={mentor}
        onNavigateHome={() => router.push('/')}
        canAccessDashboard={canAccessDashboard}
        onNavigateDashboard={canAccessDashboard ? () => router.push('/dashboard') : undefined}
      />
    )
  }

  if (mentorStatusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Checking registration status...</p>
        </div>
      </div>
    )
  }

  if (showSuccessMessage) {
    return <SuccessMessage message="Application submitted successfully! We will review your application and get back to you soon." />
  }

  const termsAcceptedError = errors?.errors.find(e => e.path[0] === 'termsAccepted')

  const renderLegalText = (text: string, variant: LegalParagraphVariant) => {
    if (variant === 'contact' || text.includes('@')) {
      const parts = text.split(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g);
      return (
        <span className="flex items-center gap-2">
           {text.includes('📧') ? null : <Mail className="w-4 h-4 text-indigo-500 inline mr-1"/>}
           {parts.map((part, i) => {
             if (part.includes('@')) {
               return <a key={i} href={`mailto:${part}`} className="text-indigo-600 hover:underline font-medium hover:text-indigo-800 transition-colors">{part}</a>
             }
             return <span key={i}>{part}</span>
           })}
        </span>
      )
    }
    return text;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden relative">
      
      {/* Background */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/40 via-slate-50 to-white"></div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_100%)]"></div>

      <div className="px-4 py-24 sm:px-6 lg:px-8 relative z-10">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
          
          {/* Header */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="mb-6 inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 hover:bg-white/50 rounded-full px-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Registration</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Join a private circle of category-defining experts. Help shape the next generation by sharing your expertise.
            </p>
            
            {session?.user && (
              <div className="mt-6 flex justify-center">
                <Badge variant="outline" className="px-4 py-1.5 rounded-full border-indigo-200 bg-indigo-50/50 text-indigo-700 text-sm font-medium">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                  Signed in as {session.user.email}
                </Badge>
              </div>
            )}
          </div>

          {/* Main Card */}
          <Card className="border-white/20 shadow-2xl bg-white/80 backdrop-blur-xl ring-1 ring-slate-900/5 rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-900">Application Form</CardTitle>
              </div>
              <CardDescription className="text-slate-500 text-base">
                Please provide accurate details about your professional background.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8 sm:p-10">
              {!session?.user && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 mb-3">
                    Sign in with Google or LinkedIn to skip email verification and auto-fill your information
                  </p>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading || isPending}
                      className="w-full flex items-center justify-center gap-2"
                      variant="outline"
                    >
                      <FcGoogle className="h-5 w-5" />
                      {isLoading || isPending ? "Signing in..." : "Sign in with Google"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleLinkedInSignIn}
                      disabled={isLoading || isPending}
                      className="w-full flex items-center justify-center gap-2"
                      variant="outline"
                    >
                      <FaLinkedin className="h-5 w-5" />
                      {isLoading || isPending ? "Signing in..." : "Sign in with LinkedIn"}
                    </Button>
                  </div>
                </div>
              )}

              <form onSubmit={handleMentorFormSubmit} className="space-y-8" encType="multipart/form-data">
                
                {/* Profile Picture */}
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-300 transition-colors bg-slate-50/50">
                  <Label htmlFor="profilePicture" className="mb-4 text-slate-600 font-medium">Profile Picture <span className="text-red-500">*</span></Label>
                  <label htmlFor="profilePicture" className="cursor-pointer group relative">
                    <Avatar className="h-28 w-28 ring-4 ring-white shadow-lg transition-transform group-hover:scale-105">
                      <AvatarImage src={profilePicturePreview || undefined} alt="Profile Picture" className="object-cover" />
                      <AvatarFallback className="bg-indigo-50 text-indigo-300">
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-white text-xs font-medium">Change</span>
                    </div>
                  </label>
                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    required
                    className="hidden"
                  />
                  <Button type="button" onClick={() => document.getElementById('profilePicture')?.click()} variant="link" className="mt-2 text-indigo-600">
                    Upload Picture
                  </Button>
                </div>

                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-slate-700">Full Name <span className="text-red-500">*</span></Label>
                      <Input
                        id="fullName"
                        value={mentorFormData.fullName}
                        onChange={e => setMentorFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="John Doe"
                        className="h-11 bg-white/50 focus:bg-white border-slate-200 transition-all"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">Email Address <span className="text-red-500">*</span></Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="email"
                          type="email"
                          value={mentorFormData.email}
                          onChange={e => {
                            if (!session?.user) {
                              setMentorFormData(prev => ({ ...prev, email: e.target.value }))
                              setIsEmailVerified(false)
                              setOtp("")
                            }
                          }}
                          placeholder="name@company.com"
                          required
                          disabled={session?.user?.email ? true : isEmailVerified}
                          readOnly={session?.user?.email ? true : false}
                          className="h-11 bg-white/50 focus:bg-white border-slate-200 transition-all"
                        />
                        {!session?.user && (
                          <Button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={!isValidEmail || isEmailVerified}
                            variant="secondary"
                            className="h-11 px-4 bg-slate-100 text-slate-700 hover:bg-slate-200"
                          >
                            {isEmailVerified ? <Check className="w-4 h-4 text-green-600" /> : "Verify"}
                          </Button>
                        )}
                        {session?.user && (
                          <div className="h-11 px-3 flex items-center justify-center bg-green-50 rounded-md border border-green-100">
                             <Check className="w-4 h-4 text-green-600" />
                          </div>
                        )}
                      </div>
                      
                      {/* OTP Section styling */}
                      {showOtpInput && (
                        <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2">
                            <Input
                              type="text"
                              placeholder="Enter 6-digit OTP"
                              value={otp}
                              onChange={(e) => {
                                setOtp(e.target.value)
                                setOtpError(null)
                              }}
                              maxLength={6}
                              className="bg-white"
                            />
                            <Button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={otp.length !== 6}
                              className="bg-slate-900 text-white"
                            >
                              Confirm
                            </Button>
                          </div>
                          {otpError && <p className="text-sm text-red-500 mt-2">{otpError}</p>}
                          <p className="text-xs text-slate-500 mt-2">
                            {isCountingDown ? (
                              `Resend code in ${countdown}s`
                            ) : (
                              <button
                                type="button"
                                onClick={handleResendOtp}
                                className="text-indigo-600 hover:underline font-medium"
                              >
                                Resend OTP
                              </button>
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-700">Phone Number <span className="text-red-500">*</span></Label>
                    <div className="flex items-center gap-2">
                      <div className="w-[140px] sm:w-48">
                        <SearchableSelect
                          value={mentorFormData.phoneCountryCode}
                          onChange={value => setMentorFormData(prev => ({ ...prev, phoneCountryCode: value }))}
                          options={phoneCodeOptions}
                          placeholder="Code"
                          disabled={phoneCodeOptions.length === 0}
                        />
                      </div>
                      <Input
                        id="phone"
                        type="tel"
                        value={mentorFormData.phone}
                        onChange={e => setMentorFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="98765 43210"
                        required
                        className="h-11 bg-white/50 focus:bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl" className="text-slate-700">LinkedIn Profile URL <span className="text-red-500">*</span></Label>
                    <Input
                      id="linkedinUrl"
                      type="text"
                      value={mentorFormData.linkedinUrl}
                      onChange={e => setMentorFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                      placeholder="https://linkedin.com/in/yourprofile"
                      required
                      className="h-11 bg-white/50 focus:bg-white border-slate-200"
                    />
                  </div>

                  {/* Location Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-slate-700">Country <span className="text-red-500">*</span></Label>
                      <SearchableSelect
                        value={mentorFormData.countryId}
                        onChange={value => {
                          const selected = countries.find(country => country.id.toString() === value)
                          setMentorFormData(prev => ({
                            ...prev,
                            countryId: value,
                            stateId: "",
                            cityId: "",
                            phoneCountryCode: selected?.phone_code || prev.phoneCountryCode
                          }))
                        }}
                        options={countryOptions}
                        placeholder="Select Country"
                        disabled={locationsLoading.countries}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-slate-700">State <span className="text-red-500">*</span></Label>
                      <SearchableSelect
                        value={mentorFormData.stateId}
                        onChange={value => setMentorFormData(prev => ({ ...prev, stateId: value, cityId: "" }))}
                        options={stateOptions}
                        placeholder={locationsLoading.states ? "Loading..." : "Select State"}
                        disabled={locationsLoading.states || states.length === 0}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-slate-700">City <span className="text-red-500">*</span></Label>
                      <SearchableSelect
                        value={mentorFormData.cityId}
                        onChange={value => setMentorFormData(prev => ({ ...prev, cityId: value }))}
                        options={cityOptions}
                        placeholder={locationsLoading.cities ? "Loading..." : "Select City"}
                        disabled={locationsLoading.cities || cities.length === 0}
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Info Section */}
                <div className="space-y-6 pt-6">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900">Professional Experience</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-slate-700">Current Job Title <span className="text-red-500">*</span></Label>
                      <Input
                        id="title"
                        value={mentorFormData.title}
                        onChange={e => setMentorFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Senior Product Manager"
                        required
                        className="h-11 bg-white/50 focus:bg-white border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-slate-700">Current Company <span className="text-red-500">*</span></Label>
                      <Input
                        id="company"
                        value={mentorFormData.company}
                        onChange={e => setMentorFormData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder="Company Name"
                        required
                        className="h-11 bg-white/50 focus:bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-slate-700">Industry <span className="text-red-500">*</span></Label>
                      <Select
                        value={mentorFormData.industry}
                        onValueChange={value => {
                          setMentorFormData(prev => ({
                            ...prev,
                            industry: value,
                            otherIndustry: value === 'Other' ? prev.otherIndustry : ''
                          }))
                          setShowOtherIndustryInput(value === 'Other')
                        }}
                        required
                      >
                        <SelectTrigger id="industry" className="h-11 bg-white/50 border-slate-200">
                          <SelectValue placeholder="Select industry..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ITSoftware">IT & Software</SelectItem>
                          <SelectItem value="Marketing">Marketing & Advertising</SelectItem>
                          <SelectItem value="Finance">Finance & Banking</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Healthcare">Healthcare</SelectItem>
                          <SelectItem value="Entrepreneurship">Entrepreneurship</SelectItem>
                          <SelectItem value="Design">Design (UI/UX)</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="HR">Human Resources</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {showOtherIndustryInput && (
                        <Input
                          id="otherIndustry"
                          value={mentorFormData.otherIndustry}
                          onChange={e => setMentorFormData(prev => ({ ...prev, otherIndustry: e.target.value }))}
                          placeholder="Specify industry"
                          className="mt-2 h-11 bg-white/50"
                          required
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience" className="text-slate-700">Years of Experience <span className="text-red-500">*</span></Label>
                      <Input
                        id="experience"
                        type="number"
                        min="2"
                        value={mentorFormData.experience}
                        onChange={e => setMentorFormData(prev => ({ ...prev, experience: e.target.value }))}
                        placeholder="e.g. 8"
                        required
                        className="h-11 bg-white/50 focus:bg-white border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expertise" className="text-slate-700">Areas of Expertise <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="expertise"
                      value={mentorFormData.expertise}
                      onChange={e => setMentorFormData(prev => ({ ...prev, expertise: e.target.value }))}
                      placeholder="List at least 5 skills (e.g. React, Strategic Planning, Public Speaking)..."
                      required
                      maxLength={500}
                      className="min-h-[100px] bg-white/50 border-slate-200 focus:bg-white resize-none"
                    />
                    <div className="text-right text-xs text-slate-400">
                      {mentorFormData.expertise.length} / 500
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="about" className="text-slate-700">About You <span className="text-slate-400 font-normal">(Optional)</span></Label>
                    <Textarea
                      id="about"
                      value={mentorFormData.about}
                      onChange={e => setMentorFormData(prev => ({ ...prev, about: e.target.value }))}
                      placeholder="What motivates you to mentor?"
                      rows={4}
                      className="bg-white/50 border-slate-200 focus:bg-white resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability" className="text-slate-700">Availability <span className="text-red-500">*</span></Label>
                    <Select
                      value={mentorFormData.availability || ''}
                      onValueChange={value => setMentorFormData(prev => ({ ...prev, availability: value }))}
                      required
                    >
                      <SelectTrigger id="availability" className="h-11 bg-white/50 border-slate-200">
                        <SelectValue placeholder="Select expected commitment..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly (~1 hour/week)</SelectItem>
                        <SelectItem value="BiWeekly">Bi-weekly (~1 hour/2 weeks)</SelectItem>
                        <SelectItem value="Monthly">Monthly (~1 hour/month)</SelectItem>
                        <SelectItem value="AsNeeded">Flexible / As Needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume" className="text-slate-700">Resume <span className="text-slate-400 font-normal">(Optional)</span></Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={e => setMentorFormData(prev => ({ ...prev, resume: e.target.files?.[0] || null }))}
                      className="bg-white/50 border-slate-200 file:text-indigo-600 file:font-medium hover:file:bg-indigo-50"
                    />
                    <p className="text-xs text-slate-500">PDF, DOC, DOCX (Max 5MB)</p>
                  </div>
                </div>

                {/* Terms Section - REDESIGNED */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">Terms, Policies & Conduct</h4>
                      <p className="text-sm text-slate-500 mt-1">Please review and accept our community standards.</p>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="bg-white border-slate-200 hover:bg-slate-100 hover:text-indigo-700 transition-colors">
                          <FileText className="w-4 h-4 mr-2" />
                          View Documents
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] w-full md:max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col md:flex-row gap-0 rounded-xl bg-white">
                        <VisuallyHidden><DialogTitle>Legal Agreements</DialogTitle></VisuallyHidden>
                        
                        <Tabs 
                          value={activeLegalDocument} 
                          onValueChange={value => setActiveLegalDocument(value as LegalDocumentId)}
                          orientation="vertical"
                          className="flex flex-col md:flex-row w-full h-full"
                        >
                          {/* Sidebar / Topbar Navigation */}
                          <div className="w-full md:w-64 lg:w-72 bg-slate-50/80 backdrop-blur-sm border-b md:border-b-0 md:border-r border-slate-200 flex flex-col flex-shrink-0 z-20">
                            <div className="p-4 md:p-6 border-b border-slate-100 bg-white/50">
                               <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                 <Scale className="w-5 h-5 text-indigo-600" />
                                 Legal Center
                               </h3>
                               <p className="text-xs text-slate-500 mt-1">Review our policies carefully.</p>
                            </div>
                            
                            {/* FIX 1: Mobile-friendly Tabs List */}
                            <TabsList className="flex flex-row md:flex-col justify-start w-full overflow-x-auto md:overflow-hidden h-auto p-2 md:p-3 bg-transparent gap-2 md:space-y-1 md:space-x-0 no-scrollbar">
                              {legalDocuments.map(doc => (
                                <TabsTrigger 
                                  key={doc.id} 
                                  value={doc.id}
                                  className="w-full justify-start px-3 py-2.5 rounded-lg text-sm font-medium transition-all 
                                  border-transparent hover:bg-slate-100/80 text-slate-600 flex-shrink-0
                                  
                                  data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm 
                                  
                                  /* Mobile: Bottom Border */
                                  data-[state=active]:border-b-2 data-[state=active]:border-indigo-600 data-[state=active]:border-l-0
                                  
                                  /* Desktop: Left Border */
                                  md:data-[state=active]:border-l-4 md:data-[state=active]:border-b-0"
                                >
                                  <span className="flex items-center gap-3">
                                    <span className="opacity-70 group-data-[state=active]:opacity-100">{getDocumentIcon(doc.id)}</span>
                                    <span className="truncate">{doc.label}</span>
                                  </span>
                                </TabsTrigger>
                              ))}
                            </TabsList>
                          </div>

                          {/* Content Area */}
                          <div className="flex-1 h-full bg-white relative overflow-hidden flex flex-col">
                            {legalDocuments.map(doc => {
                              const paragraphs = splitLegalContent(doc.content)
                              return (
                                <TabsContent key={doc.id} value={doc.id} className="h-full m-0 data-[state=inactive]:hidden flex flex-col">
                                  {/* Sticky Document Header */}
                                  <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
                                    <h2 className="text-xl font-bold text-slate-900">{doc.label}</h2>
                                    <Button size="icon" variant="ghost" className="md:hidden" onClick={() => document.getElementById('close-dialog')?.click()}>
                                      {/* Mobile close shim if needed, or rely on DialogOverlay */}
                                    </Button>
                                  </div>

                                  <ScrollArea className="flex-1 p-6 md:p-10">
                                    <div className="max-w-3xl mx-auto pb-20 space-y-4">
                                      {paragraphs.map((paragraph, index) => {
                                        const variant = classifyLegalParagraph(paragraph, index)
                                        
                                        if (variant === 'title') {
                                          return <h1 key={index} className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{paragraph}</h1>
                                        }
                                        if (variant === 'subtitle') {
                                          return (
                                            <div key={index} className="flex flex-wrap gap-2 mb-6">
                                              <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 font-mono text-xs uppercase tracking-wider">
                                                {paragraph}
                                              </Badge>
                                            </div>
                                          )
                                        }
                                        if (variant === 'heading') {
                                          return <h3 key={index} className="text-lg font-semibold text-slate-800 mt-8 mb-3">{paragraph}</h3>
                                        }
                                        if (variant === 'contact') {
                                          return (
                                            <div key={index} className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100 text-indigo-900 text-sm font-medium">
                                              {renderLegalText(paragraph, variant)}
                                            </div>
                                          )
                                        }

                                        // Default Body
                                        return (
                                          <p key={index} className="text-slate-600 leading-7 text-[15px]">
                                            {renderLegalText(paragraph, variant)}
                                          </p>
                                        )
                                      })}
                                    </div>
                                  </ScrollArea>
                                </TabsContent>
                              )
                            })}
                          </div>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-3 pt-2">
                    {legalDocuments.map(doc => (
                      <div key={doc.id} className="flex items-start space-x-3 group">
                        <Checkbox
                          id={`consent-${doc.id}`}
                          checked={legalConsents[doc.id]}
                          onCheckedChange={checked => handleConsentChange(doc.id, checked)}
                          className="mt-1 data-[state=checked]:bg-indigo-600 border-slate-300 transition-all group-hover:border-indigo-400"
                        />
                        <Label
                          htmlFor={`consent-${doc.id}`}
                          className="text-sm text-slate-600 leading-snug cursor-pointer group-hover:text-slate-900 transition-colors"
                        >
                          I have read and consent to the <span className="font-medium text-slate-900 hover:underline hover:text-indigo-600">{doc.label}</span>.
                        </Label>
                      </div>
                    ))}
                  </div>
                  {termsAcceptedError && (
                    <p className="text-sm text-red-500 font-medium flex items-center gap-2">
                       <span className="w-1 h-1 bg-red-500 rounded-full"></span> 
                       {termsAcceptedError.message}
                    </p>
                  )}
                </div>

                {/* Submit Button - FIX 2: Content Aware / Responsive */}
                <Button
                  type="submit"
                  disabled={isLoading || (!session?.user && !isEmailVerified) || !mentorFormData.termsAccepted}
                  className="group relative w-full min-h-[3.5rem] h-auto py-3 overflow-hidden rounded-xl bg-slate-900 text-white shadow-xl shadow-indigo-500/20 transition-all duration-300 hover:bg-slate-800 hover:shadow-indigo-500/40 hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 text-base sm:text-lg font-semibold tracking-wide whitespace-normal text-center leading-tight">
                    {isLoading ? "Submitting Application..." : "Submit Founding Mentor Application"}
                    {!isLoading && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 flex-shrink-0" />}
                  </span>
                  
                  {/* Shine Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] transition-transform duration-1000 ease-in-out z-0" />
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}