'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
import { MentorApplicationStatus } from "@/components/mentor/mentor-application-status"
import { ApplicationAccessCard } from "@/components/mentor-application/application-access-card"
import { ApplicationLifecycleStatus } from "@/components/mentor-application/application-lifecycle-status"
import {
  EDITABLE_APPLICATION_STATUSES,
  type MentorApplication,
} from "@/components/mentor-application/types"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Check, ChevronsUpDown, User, ArrowRight, Sparkles,
  AlertCircle, FileText, Shield, CreditCard, Users, Mail, Scale
} from "lucide-react"
import { mentorApplicationSchema } from "@/lib/validations/mentor"
import { z } from "zod"
import { useMentorStatus } from "@/hooks/use-mentor-status"
import { legalDocuments, type LegalDocumentId } from "@/lib/legal-documents"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

// --- TYPES & HELPERS ---

type SearchableOption = { value: string; label: string }

type AccessStep = 'loading' | 'email' | 'otp' | 'form' | 'status'
type AutosaveState = 'idle' | 'saving' | 'saved' | 'error'

interface MentorFormData {
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
  hourlyRate: string
  expertise: string
  about: string
  linkedinUrl: string
  profilePicture: File | null
  resume: File | null
  termsAccepted: boolean
  availability: string
}

const EMPTY_FORM_DATA: MentorFormData = {
  fullName: '',
  email: '',
  phone: '',
  phoneCountryCode: '',
  countryId: '',
  stateId: '',
  cityId: '',
  title: '',
  company: '',
  industry: '',
  otherIndustry: '',
  experience: '',
  hourlyRate: '',
  expertise: '',
  about: '',
  linkedinUrl: '',
  profilePicture: null,
  resume: null,
  termsAccepted: false,
  availability: '',
}

const INDUSTRY_VALUES = new Set([
  'ITSoftware',
  'Marketing',
  'Finance',
  'Education',
  'Healthcare',
  'Entrepreneurship',
  'Design',
  'Sales',
  'HR',
  'Other',
])

function splitStoredPhone(phone?: string | null) {
  if (!phone) return { phone: '', phoneCountryCode: '' }

  const match = /^\+(\d{1,4})-(.+)$/.exec(phone)
  if (!match) return { phone, phoneCountryCode: '' }

  return { phone: match[2], phoneCountryCode: match[1] }
}

function mapApplicationToForm(application: MentorApplication): Partial<MentorFormData> {
  const storedPhone = splitStoredPhone(application.phone)
  const industry = application.industry ?? ''
  const isKnownIndustry = INDUSTRY_VALUES.has(industry)

  return {
    fullName: application.fullName ?? '',
    email: application.email,
    phone: storedPhone.phone,
    phoneCountryCode:
      application.phoneCountryCode?.replace(/^\+/, '') ?? storedPhone.phoneCountryCode,
    countryId: application.countryId?.toString() ?? '',
    stateId: application.stateId?.toString() ?? '',
    cityId: application.cityId?.toString() ?? '',
    title: application.title ?? '',
    company: application.company ?? '',
    industry: isKnownIndustry ? industry : industry ? 'Other' : '',
    otherIndustry: isKnownIndustry ? '' : industry,
    experience: (application.experience ?? application.experienceYears)?.toString() ?? '',
    hourlyRate:
      (application.hourlyRate ?? application.requestedHourlyRate)?.toString() ?? '',
    expertise: Array.isArray(application.expertise)
      ? application.expertise.join(', ')
      : application.expertise ?? '',
    about: application.about ?? '',
    linkedinUrl: application.linkedinUrl ?? '',
    availability: application.availability ?? '',
  }
}

function buildDraftPayload(form: MentorFormData) {
  return {
    fullName: form.fullName,
    phone: form.phone,
    phoneCountryCode: form.phoneCountryCode
      ? `+${form.phoneCountryCode.replace(/^\+/, '')}`
      : '',
    countryId: form.countryId,
    stateId: form.stateId,
    cityId: form.cityId,
    title: form.title,
    company: form.company,
    industry: form.industry === 'Other' ? form.otherIndustry : form.industry,
    expertise: form.expertise,
    experience: form.experience,
    hourlyRate: form.hourlyRate,
    about: form.about,
    linkedinUrl: form.linkedinUrl,
    availability: form.availability,
  }
}

async function readResponseJson(response: Response): Promise<Record<string, unknown>> {
  try {
    return (await response.json()) as Record<string, unknown>
  } catch {
    return {}
  }
}

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
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<z.ZodError | null>(null)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)
  const { isMentor, mentor, isLoading: mentorStatusLoading } = useMentorStatus()
  const [accessStep, setAccessStep] = useState<AccessStep>('loading')
  const [application, setApplication] = useState<MentorApplication | null>(null)
  const [accessEmail, setAccessEmail] = useState('')
  const [challengeId, setChallengeId] = useState<string | null>(null)
  const [otp, setOtp] = useState('')
  const [accessError, setAccessError] = useState<string | null>(null)
  const [resendSeconds, setResendSeconds] = useState(0)
  const [autosaveState, setAutosaveState] = useState<AutosaveState>('idle')
  const lastSavedPayloadRef = useRef<string>('')
  const submissionIdempotencyKeyRef = useRef<string | null>(null)
  const [legalConsents, setLegalConsents] = useState<Record<LegalDocumentId, boolean>>(() => createLegalConsentState())
  const [activeLegalDocument, setActiveLegalDocument] = useState<LegalDocumentId>(legalDocuments[0].id)
  const [showOtherIndustryInput, setShowOtherIndustryInput] = useState(false)
  const guestAccessStartedRef = useRef(false)
  const bootstrapAbortControllerRef = useRef<AbortController | null>(null)
  const autosaveAbortControllerRef = useRef<AbortController | null>(null)

  const [countries, setCountries] = useState<{ id: number; name: string; phone_code?: string | null; code?: string | null }[]>([])
  const [states, setStates] = useState<{ id: number; name: string }[]>([])
  const [cities, setCities] = useState<{ id: number; name: string }[]>([])
  const [locationsLoading, setLocationsLoading] = useState({
    countries: false,
    states: false,
    cities: false,
  })

  const [mentorFormData, setMentorFormData] = useState<MentorFormData>(EMPTY_FORM_DATA)

  const countryOptions = useMemo<SearchableOption[]>(
    () => countries.map(country => ({ value: country.id.toString(), label: country.name })),
    [countries]
  )

  const phoneCodeOptions = useMemo<SearchableOption[]>(() => {
    const codes = countries.flatMap(country =>
      country.phone_code
        ? [{ value: country.phone_code, label: `+${country.phone_code} (${country.name})` }]
        : [],
    )

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
        if (!response.ok) throw new Error('Failed to load countries')
        const data = await response.json()
        const countriesData = Array.isArray(data) ? data : []
        setCountries(countriesData)
        
        const india = countriesData.find((c: { name: string }) => c.name === 'India')
        if (india) {
          setMentorFormData(prev => ({
            ...prev,
            countryId: prev.countryId || india.id.toString(),
            phoneCountryCode: prev.phoneCountryCode || india.phone_code || '91',
          }))
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
        try {
          const response = await fetch(`/api/locations/states?countryId=${mentorFormData.countryId}`)
          if (!response.ok) throw new Error('Failed to load states')
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
        try {
          const response = await fetch(`/api/locations/cities?stateId=${mentorFormData.stateId}`)
          if (!response.ok) throw new Error('Failed to load cities')
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

  const activateApplication = useCallback((nextApplication: MentorApplication) => {
    const formPatch = mapApplicationToForm(nextApplication)

    setApplication(nextApplication)
    setAccessEmail(nextApplication.email)
    setMentorFormData(previous => {
      const nextForm: MentorFormData = {
        ...EMPTY_FORM_DATA,
        ...formPatch,
      }

      if (!nextForm.countryId) nextForm.countryId = previous.countryId
      if (!nextForm.phoneCountryCode) {
        nextForm.phoneCountryCode = previous.phoneCountryCode
      }

      lastSavedPayloadRef.current = JSON.stringify(buildDraftPayload(nextForm))
      return nextForm
    })
    setProfilePicturePreview(nextApplication.profileImageUrl ?? null)
    setAutosaveState('idle')
    setAccessStep(
      EDITABLE_APPLICATION_STATUSES.includes(nextApplication.status) ? 'form' : 'status',
    )
  }, [])

  useEffect(() => {
    if (accessStep !== 'loading' || isLoading) return

    // Authentication is an enhancement for this standalone entry point. If
    // Better Auth or the mentor-status request stalls, guests must still be
    // able to begin email verification.
    const fallbackTimer = window.setTimeout(() => {
      setAccessStep(current => (current === 'loading' ? 'email' : current))
    }, 2_500)

    return () => window.clearTimeout(fallbackTimer)
  }, [accessStep, isLoading])

  useEffect(() => {
    if (isPending || mentorStatusLoading || isMentor) return
    if (guestAccessStartedRef.current) return

    let cancelled = false
    const controller = new AbortController()
    bootstrapAbortControllerRef.current?.abort()
    bootstrapAbortControllerRef.current = controller

    const restoreApplicationAccess = async () => {
      setAccessStep('loading')
      setAccessError(null)

      const signedInEmail = session?.user?.email ?? ''
      const isSignedInEmailVerified = Boolean(session?.user?.emailVerified)

      try {
        if (session?.user && isSignedInEmailVerified) {
          const sessionResponse = await fetch('/api/mentor-applications/session', {
            method: 'POST',
            credentials: 'include',
            signal: controller.signal,
          })
          const sessionResult = await readResponseJson(sessionResponse)

          if (guestAccessStartedRef.current) return

          if (!sessionResponse.ok || sessionResult.success !== true) {
            if (!cancelled) {
              setAccessEmail(signedInEmail)
              setAccessError(
                typeof sessionResult.error === 'string'
                  ? sessionResult.error
                  : 'We could not connect your verified account. Verify your email to continue.',
              )
              setAccessStep('email')
            }
            return
          }
        }

        const currentResponse = await fetch('/api/mentor-applications/current', {
          credentials: 'include',
          cache: 'no-store',
          signal: controller.signal,
        })
        const currentResult = await readResponseJson(currentResponse)

        if (
          !cancelled &&
          !guestAccessStartedRef.current &&
          currentResponse.ok &&
          currentResult.success === true &&
          currentResult.application
        ) {
          const currentApplication = currentResult.application as MentorApplication
          activateApplication(currentApplication)
          if (session?.user?.name && !currentApplication.fullName) {
            setMentorFormData(previous => ({
              ...previous,
              fullName: session.user.name,
            }))
          }
          return
        }
      } catch (error) {
        if ((error as Error).name === 'AbortError') return
        console.error('Failed to restore expert application access:', error)
      }

      if (!cancelled && !guestAccessStartedRef.current) {
        setAccessEmail(signedInEmail)
        setMentorFormData(prev => ({
          ...prev,
          email: signedInEmail || prev.email,
          fullName: session?.user?.name || prev.fullName,
        }))
        setAccessStep('email')
      }
    }

    void restoreApplicationAccess()
    return () => {
      cancelled = true
      controller.abort()
      if (bootstrapAbortControllerRef.current === controller) {
        bootstrapAbortControllerRef.current = null
      }
    }
  }, [
    activateApplication,
    isMentor,
    isPending,
    mentorStatusLoading,
    session?.user?.email,
    session?.user?.emailVerified,
    session?.user?.id,
    session?.user?.name,
  ])

  useEffect(() => {
    if (resendSeconds <= 0) return

    const timer = window.setInterval(() => {
      setResendSeconds(current => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [resendSeconds])

  const requestOtp = async (email: string) => {
    const response = await fetch('/api/mentor-applications/email/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email: email.trim() }),
    })
    const result = await readResponseJson(response)

    if (!response.ok || result.success !== true || typeof result.challengeId !== 'string') {
      throw new Error(
        typeof result.error === 'string'
          ? result.error
          : 'We could not send a verification code. Please try again shortly.',
      )
    }

    setChallengeId(result.challengeId)
    setOtp('')
    setResendSeconds(60)
    setAccessStep('otp')
  }

  const handleRequestOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    guestAccessStartedRef.current = true
    bootstrapAbortControllerRef.current?.abort()
    setIsLoading(true)
    setAccessError(null)

    try {
      await requestOtp(accessEmail)
    } catch (error) {
      setAccessError(error instanceof Error ? error.message : 'Unable to send a code.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendSeconds > 0) return

    setIsLoading(true)
    setAccessError(null)

    try {
      await requestOtp(accessEmail)
    } catch (error) {
      setAccessError(error instanceof Error ? error.message : 'Unable to resend the code.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAccessError(null)

    if (!challengeId) {
      setAccessError('This verification request is no longer valid. Please request a new code.')
      setAccessStep('email')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/mentor-applications/email/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ challengeId, code: otp }),
      })
      const result = await readResponseJson(response)

      if (!response.ok || result.success !== true || !result.application) {
        throw new Error(
          typeof result.error === 'string'
            ? result.error
            : 'That code is invalid or expired. Please try again.',
        )
      }

      activateApplication(result.application as MentorApplication)
    } catch (error) {
      setAccessError(error instanceof Error ? error.message : 'Unable to verify the code.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeEmail = () => {
    setChallengeId(null)
    setOtp('')
    setResendSeconds(0)
    setAccessError(null)
    setAccessStep('email')
  }

  const closeApplicationSession = async (destination: 'email' | 'home') => {
    const previousStep = accessStep
    bootstrapAbortControllerRef.current?.abort()
    autosaveAbortControllerRef.current?.abort()
    setIsLoading(true)
    setAccessError(null)
    setSubmissionError(null)
    setAccessStep('loading')

    try {
      const response = await fetch('/api/mentor-applications/session', {
        method: 'DELETE',
        credentials: 'include',
      })
      const result = await readResponseJson(response)
      if (!response.ok || result.success !== true) {
        throw new Error(
          typeof result.error === 'string'
            ? result.error
            : 'Unable to close this application session.',
        )
      }

      guestAccessStartedRef.current = destination === 'email'
      setApplication(null)
      setAccessEmail('')
      setChallengeId(null)
      setOtp('')
      setResendSeconds(0)
      setProfilePicturePreview(null)
      setAutosaveState('idle')
      lastSavedPayloadRef.current = ''
      submissionIdempotencyKeyRef.current = null
      setLegalConsents(createLegalConsentState())
      setMentorFormData(previous => ({
        ...EMPTY_FORM_DATA,
        countryId: previous.countryId,
        phoneCountryCode: previous.phoneCountryCode,
      }))

      if (destination === 'home') {
        router.push('/')
      } else {
        setAccessStep('email')
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to close this application session.'
      if (previousStep === 'status') setAccessError(message)
      else setSubmissionError(message)
      setAccessStep(previousStep)
    } finally {
      setIsLoading(false)
    }
  }

  const draftPayload = useMemo(() => buildDraftPayload(mentorFormData), [mentorFormData])

  useEffect(() => {
    // A retry of the same payload reuses its key. Editing any submitted value
    // creates a new logical attempt and therefore gets a fresh key.
    submissionIdempotencyKeyRef.current = null
  }, [draftPayload, legalConsents, mentorFormData.profilePicture, mentorFormData.resume])

  useEffect(() => {
    if (accessStep !== 'form' || !application) return
    if (!EDITABLE_APPLICATION_STATUSES.includes(application.status)) return

    const serializedPayload = JSON.stringify(draftPayload)
    if (serializedPayload === lastSavedPayloadRef.current) return

    setAutosaveState('saving')
    const controller = new AbortController()
    autosaveAbortControllerRef.current?.abort()
    autosaveAbortControllerRef.current = controller
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch('/api/mentor-applications/current', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          signal: controller.signal,
          body: serializedPayload,
        })
        const result = await readResponseJson(response)

        if (!response.ok || result.success !== true) {
          throw new Error('Draft could not be saved')
        }

        lastSavedPayloadRef.current = serializedPayload
        setAutosaveState('saved')
        if (result.application) {
          setApplication(result.application as MentorApplication)
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Expert application autosave failed:', error)
          setAutosaveState('error')
        }
      }
    }, 900)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
      if (autosaveAbortControllerRef.current === controller) {
        autosaveAbortControllerRef.current = null
      }
    }
  }, [accessStep, application, draftPayload])

  const handleMentorFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors(null)
    setSubmissionError(null)

    try {
      const preparedIndustry = mentorFormData.industry === 'Other' ? mentorFormData.otherIndustry : mentorFormData.industry

      const validationPayload = {
        ...mentorFormData,
        industry: preparedIndustry,
        otherIndustry: mentorFormData.otherIndustry,
        country: mentorFormData.countryId,
        state: mentorFormData.stateId,
        city: mentorFormData.cityId,
        phone: `+${mentorFormData.phoneCountryCode}-${mentorFormData.phone}`,
      }
      const validatedData = application?.profileImageUrl && !mentorFormData.profilePicture
        ? mentorApplicationSchema.omit({ profilePicture: true }).parse(validationPayload)
        : mentorApplicationSchema.parse(validationPayload)
      const idempotencyKey = submissionIdempotencyKeyRef.current ?? crypto.randomUUID()
      submissionIdempotencyKeyRef.current = idempotencyKey

      const formData = new FormData()
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
      formData.append('hourlyRate', validatedData.hourlyRate)
      formData.append('about', validatedData.about || '')
      formData.append('linkedinUrl', validatedData.linkedinUrl)
      formData.append('availability', validatedData.availability)
      if (mentorFormData.profilePicture) {
        formData.append('profilePicture', mentorFormData.profilePicture)
      }
      if (validatedData.resume) formData.append('resume', validatedData.resume)
      formData.append('termsAccepted', String(validatedData.termsAccepted))
      formData.append('consents', JSON.stringify(
        legalDocuments.map(doc => ({
          documentId: doc.id,
          version: doc.version,
          accepted: legalConsents[doc.id],
        })),
      ))

      const res = await fetch('/api/mentor-applications/current/submit', {
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey },
        body: formData,
        credentials: 'include',
      })
      const result = await res.json()

      if (!result.success) {
        setSubmissionError(result.error || 'Failed to submit your application.')
        setIsLoading(false)
        return
      }

      submissionIdempotencyKeyRef.current = null
      if (!result.application) {
        setSubmissionError('Your application was submitted, but its status could not be loaded.')
        return
      }

      activateApplication(result.application as MentorApplication)
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error)
      } else {
        setSubmissionError('Something went wrong while submitting your application.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!mentorStatusLoading && isMentor && mentor) {
    return (
      <MentorApplicationStatus
        mentor={mentor}
        onNavigateHome={() => router.push('/')}
        onNavigateDashboard={() => router.push('/dashboard')}
        onNavigateVipLounge={() => router.push('/vip-lounge')}
      />
    )
  }

  if (accessStep === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading your application securely...</p>
        </div>
      </div>
    )
  }

  if (accessStep === 'status' && application) {
    return (
      <ApplicationLifecycleStatus
        application={application}
        onNavigateHome={() => router.push('/')}
        onUseAnotherEmail={() => void closeApplicationSession('email')}
        onExitApplication={() => void closeApplicationSession('home')}
        isClosing={isLoading}
        actionError={accessError}
      />
    )
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

  if (accessStep === 'email' || accessStep === 'otp') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/40 via-slate-50 to-white" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_100%)]" />

        <main className="relative z-10 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="mb-6 inline-flex items-center gap-2 rounded-full px-4 text-slate-500 hover:bg-white/50 hover:text-indigo-600"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to Home
              </Button>
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                Expert{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Verification Application
                </span>
              </h1>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                Apply independently today. We can connect your approved application to your
                SharingMinds account when you join the platform later.
              </p>
            </div>

            <ApplicationAccessCard
              step={accessStep}
              email={accessEmail}
              otp={otp}
              error={accessError}
              isLoading={isLoading}
              resendSeconds={resendSeconds}
              onEmailChange={setAccessEmail}
              onOtpChange={value => setOtp(value.replace(/\D/g, '').slice(0, 6))}
              onRequestOtp={handleRequestOtp}
              onVerifyOtp={handleVerifyOtp}
              onResendOtp={handleResendOtp}
              onChangeEmail={handleChangeEmail}
            />
          </div>
        </main>
      </div>
    )
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

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
              Expert <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Verification Application</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Join a private circle of category-defining experts. Help shape the next generation by sharing your expertise.
            </p>
            
            {application?.email && (
              <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
                <Badge variant="outline" className="px-4 py-1.5 rounded-full border-indigo-200 bg-indigo-50/50 text-indigo-700 text-sm font-medium">
                  <Check className="mr-2 h-4 w-4 text-emerald-600" aria-hidden="true" />
                  Verified email: {application.email}
                </Badge>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => void closeApplicationSession('email')}
                >
                  Use another email
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => void closeApplicationSession('home')}
                >
                  Exit application
                </Button>
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
                {application && (
                  <Badge variant="outline" className="ml-auto">
                    {application.status.replace(/_/g, ' ')}
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-1 text-base text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <CardDescription className="text-slate-500 text-base">
                  Please provide accurate details about your professional background.
                </CardDescription>
                <p className="text-xs" aria-live="polite">
                  {autosaveState === 'saving' && 'Saving draft…'}
                  {autosaveState === 'saved' && 'Draft saved'}
                  {autosaveState === 'error' && 'Draft not saved — retrying after your next change'}
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="p-8 sm:p-10">
              <form onSubmit={handleMentorFormSubmit} className="space-y-8" encType="multipart/form-data">
                {application?.status === 'DRAFT' && (
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm text-indigo-900">
                    <p className="font-semibold">Draft application</p>
                    <p className="mt-1 leading-relaxed">
                      Your progress is saved automatically. Submit the form when every required
                      detail is ready for review.
                    </p>
                  </div>
                )}
                {application?.status === 'CHANGES_REQUESTED' && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="font-semibold">Changes requested</p>
                        <p className="mt-1 leading-relaxed">
                          {application.applicantVisibleNotes || application.verificationNotes ||
                            'Please review your details, make the requested updates, and resubmit your application.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {submissionError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  >
                    {submissionError}
                  </div>
                )}
                {errors && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                  >
                    <p className="font-semibold">Please review the following fields:</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {errors.errors.map((error, index) => (
                        <li key={`${error.path.join('.')}-${index}`}>{error.message}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Profile Picture */}
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-300 transition-colors bg-slate-50/50">
                  <Label htmlFor="profilePicture" className="mb-4 text-slate-600 font-medium">
                    Profile Picture
                    {!application?.profileImageUrl && <span className="text-red-500"> *</span>}
                  </Label>
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
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleProfilePictureChange}
                    required={!application?.profileImageUrl}
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
                          onChange={() => undefined}
                          placeholder="name@company.com"
                          required
                          disabled
                          readOnly
                          className="h-11 bg-white/50 focus:bg-white border-slate-200 transition-all"
                        />
                        <div className="h-11 px-3 flex items-center justify-center bg-green-50 rounded-md border border-green-100">
                           <Check className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
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
                      placeholder="What motivates you to share your expertise?"
                      rows={4}
                      className="bg-white/50 border-slate-200 focus:bg-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate" className="text-slate-700">
                        Preferred Hourly Rate (USD) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        min="1"
                        step="0.01"
                        inputMode="decimal"
                        value={mentorFormData.hourlyRate}
                        onChange={event => setMentorFormData(prev => ({
                          ...prev,
                          hourlyRate: event.target.value,
                        }))}
                        placeholder="e.g. 75.00"
                        required
                        className="h-11 bg-white/50 focus:bg-white border-slate-200"
                      />
                      <p className="text-xs text-slate-500">
                        Administrators may adjust this rate with a documented reason.
                      </p>
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
                          <SelectItem value="WEEKLY">Weekly (~1 hour/week)</SelectItem>
                          <SelectItem value="BIWEEKLY">Bi-weekly (~1 hour/2 weeks)</SelectItem>
                          <SelectItem value="MONTHLY">Monthly (~1 hour/month)</SelectItem>
                          <SelectItem value="AS_NEEDED">Flexible / As Needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="resume" className="text-slate-700">Resume <span className="text-slate-400 font-normal">(Optional)</span></Label>
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={e => setMentorFormData(prev => ({ ...prev, resume: e.target.files?.[0] || null }))}
                      className="bg-white/50 border-slate-200 file:text-indigo-600 file:font-medium hover:file:bg-indigo-50"
                    />
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>PDF only (Max 5MB)</span>
                      {application?.resumeUrl && (
                        <span className="font-medium text-emerald-700">
                          A resume is already on file. Upload a new PDF to replace it.
                        </span>
                      )}
                    </div>
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
                  disabled={isLoading || !mentorFormData.termsAccepted}
                  className="group relative w-full min-h-[3.5rem] h-auto py-3 overflow-hidden rounded-xl bg-slate-900 text-white shadow-xl shadow-indigo-500/20 transition-all duration-300 hover:bg-slate-800 hover:shadow-indigo-500/40 hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 text-base sm:text-lg font-semibold tracking-wide whitespace-normal text-center leading-tight">
                    {isLoading
                      ? "Submitting Application..."
                      : application?.status === 'CHANGES_REQUESTED'
                        ? 'Resubmit Expert Verification Application'
                        : "Submit Expert Verification Application"}
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
