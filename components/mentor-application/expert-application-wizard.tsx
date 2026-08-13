'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronsUpDown,
  FileText,
  Save,
  ShieldCheck,
  Upload,
  UserRound,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { legalDocuments, type LegalDocumentId } from '@/lib/legal-documents'
import {
  CREDIBILITY_SIGNAL_OPTIONS,
  EMPLOYMENT_TYPE_OPTIONS,
  EXPERIENCE_BAND_OPTIONS,
  EXPERTISE_OPTIONS,
  INDUSTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  SERVICE_INTEREST_OPTIONS,
  SESSION_MODE_OPTIONS,
  WEEKLY_AVAILABILITY_OPTIONS,
  type MentorApplicationOption,
} from '@/lib/mentor-application-options'
import { mentorApplicationDraftFieldsSchema } from '@/lib/validations/mentor-application'
import type { MentorApplication } from './types'

type AutosaveState = 'idle' | 'saving' | 'saved' | 'error'
type SearchableOption = { value: string; label: string }

type ExpertApplicationFormData = {
  fullName: string
  phone: string
  phoneCountryCode: string
  countryId: string
  stateId: string
  cityId: string
  professionalHeadline: string
  title: string
  company: string
  websiteUrl: string
  employmentType: string
  experienceBand: string
  industries: string[]
  otherIndustry: string
  expertise: string[]
  otherExpertise: string
  about: string
  challengeSolved: string
  measurableOutcomes: string
  guidanceValueProposition: string
  credibilitySignals: string[]
  linkedinUrl: string
  serviceInterests: string[]
  preferredSessionMode: string
  languages: string[]
  otherLanguage: string
  weeklyAvailabilityBand: string
  profilePicture: File | null
  resume: File | null
  portfolio: File | null
  caseStudy: File | null
  presentation: File | null
  awardsCertifications: File | null
}

const STEPS = [
  { title: 'Personal details', description: 'Your identity and professional presence' },
  { title: 'Professional background', description: 'Current role and experience' },
  { title: 'Expertise', description: 'Choose up to five strengths' },
  { title: 'Experience and impact', description: 'What makes your guidance valuable' },
  { title: 'Credibility', description: 'Signals that support your application' },
  { title: 'Documents', description: 'Verification and supporting evidence' },
  { title: 'Availability', description: 'How you would like to contribute' },
  { title: 'Verification', description: 'Declarations and final review' },
] as const

const STEP_FIELDS = [
  new Set([
    'fullName',
    'phone',
    'countryId',
    'stateId',
    'cityId',
    'professionalHeadline',
    'linkedinUrl',
    'websiteUrl',
  ]),
  new Set([
    'title',
    'company',
    'employmentType',
    'experienceBand',
    'industries',
    'otherIndustry',
  ]),
  new Set(['expertise', 'otherExpertise']),
  new Set([
    'about',
    'challengeSolved',
    'measurableOutcomes',
    'guidanceValueProposition',
  ]),
  new Set(['credibilitySignals']),
  new Set<string>(),
  new Set([
    'serviceInterests',
    'preferredSessionMode',
    'languages',
    'otherLanguage',
    'weeklyAvailabilityBand',
  ]),
  new Set<string>(),
] as const

const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024
const RESUME_MAX_BYTES = 2 * 1024 * 1024
const SUPPORTING_DOCUMENT_MAX_BYTES = 5 * 1024 * 1024

function splitStoredPhone(phone?: string | null) {
  if (!phone) return { phone: '', phoneCountryCode: '' }
  const match = /^\+(\d{1,4})-(.+)$/.exec(phone)
  return match
    ? { phone: match[2], phoneCountryCode: match[1] }
    : { phone, phoneCountryCode: '' }
}

function createInitialForm(application: MentorApplication): ExpertApplicationFormData {
  const storedPhone = splitStoredPhone(application.phone)
  return {
    fullName: application.fullName || '',
    phone: storedPhone.phone,
    phoneCountryCode:
      application.phoneCountryCode?.replace(/^\+/, '') || storedPhone.phoneCountryCode,
    countryId: application.countryId?.toString() || '',
    stateId: application.stateId?.toString() || '',
    cityId: application.cityId?.toString() || '',
    professionalHeadline: application.professionalHeadline || '',
    title: application.title || '',
    company: application.company || '',
    websiteUrl: application.websiteUrl || '',
    employmentType: application.employmentType || '',
    experienceBand: application.experienceBand || '',
    industries: application.industries || [],
    otherIndustry: application.otherIndustry || '',
    expertise: application.expertise || [],
    otherExpertise: application.otherExpertise || '',
    about: application.about || '',
    challengeSolved: application.challengeSolved || '',
    measurableOutcomes: application.measurableOutcomes || '',
    guidanceValueProposition: application.guidanceValueProposition || '',
    credibilitySignals: application.credibilitySignals || [],
    linkedinUrl: application.linkedinUrl || '',
    serviceInterests: application.serviceInterests || [],
    preferredSessionMode: application.preferredSessionMode || '',
    languages: application.languages || [],
    otherLanguage: application.otherLanguage || '',
    weeklyAvailabilityBand: application.weeklyAvailabilityBand || '',
    profilePicture: null,
    resume: null,
    portfolio: null,
    caseStudy: null,
    presentation: null,
    awardsCertifications: null,
  }
}

function buildApplicationValues(form: ExpertApplicationFormData) {
  return {
    fullName: form.fullName,
    phone: `+${form.phoneCountryCode.replace(/^\+/, '')}-${form.phone}`,
    countryId: form.countryId,
    stateId: form.stateId,
    cityId: form.cityId,
    professionalHeadline: form.professionalHeadline,
    title: form.title,
    company: form.company,
    websiteUrl: form.websiteUrl,
    employmentType: form.employmentType,
    experienceBand: form.experienceBand,
    industries: form.industries,
    otherIndustry: form.otherIndustry,
    expertise: form.expertise,
    otherExpertise: form.otherExpertise,
    about: form.about,
    challengeSolved: form.challengeSolved,
    measurableOutcomes: form.measurableOutcomes,
    guidanceValueProposition: form.guidanceValueProposition,
    credibilitySignals: form.credibilitySignals,
    linkedinUrl: form.linkedinUrl,
    serviceInterests: form.serviceInterests,
    preferredSessionMode: form.preferredSessionMode,
    languages: form.languages,
    otherLanguage: form.otherLanguage,
    weeklyAvailabilityBand: form.weeklyAvailabilityBand,
  }
}

function buildDraftPayload(form: ExpertApplicationFormData) {
  return {
    ...buildApplicationValues(form),
    phone: form.phone,
    phoneCountryCode: form.phoneCountryCode
      ? `+${form.phoneCountryCode.replace(/^\+/, '')}`
      : '',
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
  id,
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder,
  disabled,
  error,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  options: SearchableOption[]
  placeholder: string
  searchPlaceholder: string
  disabled?: boolean
  error?: string
}) {
  const [open, setOpen] = useState(false)
  const label = options.find(option => option.value === value)?.label

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={Boolean(error)}
          aria-describedby={error && id ? `${id}-error` : undefined}
          data-validation-field={id}
          disabled={disabled}
          className={cn(
            'h-11 w-full justify-between bg-white font-normal',
            error && 'border-red-500 focus-visible:ring-red-500',
          )}
        >
          <span className="truncate">{label || placeholder}</span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(22rem,calc(100vw-2rem))] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>No matching location found.</CommandEmpty>
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
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      option.value === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
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

function RadioCards({
  name,
  value,
  options,
  onChange,
  columns = 3,
  error,
}: {
  name: string
  value: string
  options: readonly MentorApplicationOption[]
  onChange: (value: string) => void
  columns?: 2 | 3 | 4
  error?: string
}) {
  return (
    <RadioGroup
      id={name}
      value={value}
      onValueChange={onChange}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${name}-error` : undefined}
      data-validation-field={name}
      className={cn(
        'grid gap-3 rounded-xl',
        error && 'ring-2 ring-red-200 ring-offset-4',
        columns === 2 && 'sm:grid-cols-2',
        columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'sm:grid-cols-2 lg:grid-cols-4',
      )}
    >
      {options.map(option => {
        const id = `${name}-${option.value}`
        return (
          <Label
            key={option.value}
            htmlFor={id}
            className={cn(
              'flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-3',
              'font-medium transition-colors hover:border-indigo-300 hover:bg-indigo-50/40',
              value === option.value
                ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                : 'border-slate-200 bg-white text-slate-700',
            )}
          >
            <RadioGroupItem id={id} value={option.value} />
            {option.label}
          </Label>
        )
      })}
    </RadioGroup>
  )
}

function CheckboxCards({
  name,
  values,
  options,
  onChange,
  max,
  error,
}: {
  name: string
  values: string[]
  options: readonly MentorApplicationOption[]
  onChange: (values: string[]) => void
  max?: number
  error?: string
}) {
  return (
    <div
      id={name}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${name}-error` : undefined}
      data-validation-field={name}
      className={cn(
        'grid gap-3 rounded-xl sm:grid-cols-2 lg:grid-cols-3',
        error && 'ring-2 ring-red-200 ring-offset-4',
      )}
    >
      {options.map(option => {
        const selected = values.includes(option.value)
        const disabled = Boolean(max && values.length >= max && !selected)
        const id = `${name}-${option.value}`
        return (
          <Label
            key={option.value}
            htmlFor={id}
            aria-disabled={disabled}
            className={cn(
              'flex min-h-12 items-center gap-3 rounded-xl border p-3 font-medium',
              'transition-colors',
              disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer hover:border-indigo-300',
              selected
                ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                : 'border-slate-200 bg-white text-slate-700',
            )}
          >
            <Checkbox
              id={id}
              checked={selected}
              disabled={disabled}
              onCheckedChange={checked => {
                onChange(
                  checked === true
                    ? [...values, option.value]
                    : values.filter(value => value !== option.value),
                )
              }}
            />
            {option.label}
          </Label>
        )
      })}
    </div>
  )
}

function FieldError({ field, error }: { field: string; error?: string }) {
  return error ? (
    <p id={`${field}-error`} className="text-sm font-medium text-red-600">
      {error}
    </p>
  ) : null
}

function TextareaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  error?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <Label htmlFor={id} className="text-base font-semibold text-slate-800">
          {label} <span className="text-red-500">*</span>
        </Label>
        <span className="text-xs text-slate-400">{value.length}/1000</span>
      </div>
      <Textarea
        id={id}
        value={value}
        onChange={event => onChange(event.target.value)}
        maxLength={1000}
        rows={5}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          'resize-none bg-white',
          error && 'border-red-500 focus-visible:ring-red-500',
        )}
      />
      <FieldError field={id} error={error} />
    </div>
  )
}

function FileField({
  id,
  label,
  required,
  file,
  existingUrl,
  maxSizeMb = 5,
  onChange,
  error,
}: {
  id: string
  label: string
  required?: boolean
  file: File | null
  existingUrl?: string | null
  maxSizeMb?: number
  onChange: (file: File | null) => void
  error?: string
}) {
  return (
    <div
      data-validation-field={id}
      className={cn(
        'rounded-xl border bg-white p-4',
        error ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200',
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Label htmlFor={id} className="font-semibold text-slate-800">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
          <p className="mt-1 text-xs text-slate-500">
            PDF only, maximum {maxSizeMb}MB
          </p>
        </div>
        <Label
          htmlFor={id}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium hover:bg-slate-50"
        >
          <Upload className="mr-2 h-4 w-4" />
          {file || existingUrl ? 'Replace file' : 'Choose file'}
        </Label>
        <Input
          id={id}
          type="file"
          accept=".pdf,application/pdf"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="sr-only"
          onChange={event => onChange(event.target.files?.[0] || null)}
        />
      </div>
      {file ? (
        <p className="mt-3 truncate text-sm font-medium text-indigo-700">{file.name}</p>
      ) : existingUrl ? (
        <a
          href={existingUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:underline"
        >
          Current file is on record
        </a>
      ) : null}
    </div>
  )
}

type ExpertApplicationWizardProps = {
  application: MentorApplication
  onApplicationChange: (application: MentorApplication) => void
  onSubmitted?: (application: MentorApplication) => void
  onReadyForAuthentication?: (draft: MentorApplication) => void
  onExit: () => void
  registrationMode?: 'legacy' | 'live'
}

export function ExpertApplicationWizard({
  application,
  onApplicationChange,
  onSubmitted,
  onReadyForAuthentication,
  onExit,
  registrationMode = 'legacy',
}: ExpertApplicationWizardProps) {
  const isLiveRegistration = registrationMode === 'live'
  const [form, setForm] = useState(() => createInitialForm(application))
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [draftUnavailableError, setDraftUnavailableError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [autosaveState, setAutosaveState] = useState<AutosaveState>('idle')
  const [consents, setConsents] = useState<Record<LegalDocumentId, boolean>>(() =>
    Object.fromEntries(legalDocuments.map(document => [document.id, false])) as Record<
      LegalDocumentId,
      boolean
    >,
  )
  const [countries, setCountries] = useState<
    { id: number; name: string; phone_code?: string | null }[]
  >([])
  const [states, setStates] = useState<{ id: number; name: string }[]>([])
  const [cities, setCities] = useState<{ id: number; name: string }[]>([])
  const [locationLoading, setLocationLoading] = useState({
    countries: false,
    states: false,
    cities: false,
  })
  const [profilePreview, setProfilePreview] = useState(application.profileImageUrl || '')
  const lastSavedPayload = useRef(JSON.stringify(buildDraftPayload(form)))
  const autosaveController = useRef<AbortController | null>(null)
  const idempotencyKey = useRef<string | null>(null)
  const validationSummaryRef = useRef<HTMLDivElement | null>(null)

  const clearFieldErrors = (...fields: string[]) => {
    setErrors(previous => {
      if (!fields.some(field => previous[field])) return previous

      const next = { ...previous }
      for (const field of fields) delete next[field]
      return next
    })
    setSubmissionError(null)
  }

  const focusValidationField = (field: string) => {
    window.setTimeout(() => {
      const validationContainer = document.querySelector<HTMLElement>(
        `[data-validation-field="${field}"]`,
      )
      const target = validationContainer || document.getElementById(field)

      if (!target) {
        validationSummaryRef.current?.focus()
        return
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const focusTarget = target.matches('button, input, textarea, select, [tabindex]')
        ? target
        : target.querySelector<HTMLElement>('button, input, textarea, select, [tabindex]')
      focusTarget?.focus({ preventScroll: true })
    }, 0)
  }

  const updateForm = <K extends keyof ExpertApplicationFormData>(
    field: K,
    value: ExpertApplicationFormData[K],
  ) => {
    setForm(previous => ({ ...previous, [field]: value }))
    const dependentFields =
      field === 'industries'
        ? ['otherIndustry']
        : field === 'expertise'
          ? ['otherExpertise']
          : field === 'languages'
            ? ['otherLanguage']
            : []
    clearFieldErrors(String(field), ...dependentFields)
  }

  const countryOptions = useMemo(
    () => countries.map(country => ({ value: String(country.id), label: country.name })),
    [countries],
  )
  const stateOptions = useMemo(
    () => states.map(state => ({ value: String(state.id), label: state.name })),
    [states],
  )
  const cityOptions = useMemo(
    () => cities.map(city => ({ value: String(city.id), label: city.name })),
    [cities],
  )
  const phoneCodeOptions = useMemo(() => {
    const options = countries.flatMap(country =>
      country.phone_code
        ? [{ value: country.phone_code, label: `+${country.phone_code} (${country.name})` }]
        : [],
    )
    return options.length ? options : [{ value: '91', label: '+91 (India)' }]
  }, [countries])

  useEffect(() => {
    const storedStep = Number(sessionStorage.getItem(`mentor-application-step:${application.id}`))
    if (Number.isInteger(storedStep) && storedStep >= 0 && storedStep < STEPS.length) {
      setStep(storedStep)
    }
  }, [application.id])

  useEffect(() => {
    sessionStorage.setItem(`mentor-application-step:${application.id}`, String(step))
  }, [application.id, step])

  useEffect(() => {
    let active = true
    setLocationLoading(previous => ({ ...previous, countries: true }))
    void fetch('/api/locations/countries')
      .then(response => {
        if (!response.ok) throw new Error('Unable to load countries')
        return response.json()
      })
      .then(data => {
        if (!active) return
        const nextCountries = Array.isArray(data) ? data : []
        setCountries(nextCountries)
        const india = nextCountries.find(country => country.name === 'India')
        setForm(previous => ({
          ...previous,
          countryId: previous.countryId || (india ? String(india.id) : ''),
          phoneCountryCode:
            previous.phoneCountryCode || india?.phone_code || '91',
        }))
      })
      .catch(error => console.error('Failed to load countries', error))
      .finally(() => {
        if (active) setLocationLoading(previous => ({ ...previous, countries: false }))
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!form.countryId) {
      setStates([])
      return
    }
    let active = true
    setLocationLoading(previous => ({ ...previous, states: true }))
    void fetch(`/api/locations/states?countryId=${form.countryId}`)
      .then(response => {
        if (!response.ok) throw new Error('Unable to load states')
        return response.json()
      })
      .then(data => {
        if (active) setStates(Array.isArray(data) ? data : [])
      })
      .catch(error => console.error('Failed to load states', error))
      .finally(() => {
        if (active) setLocationLoading(previous => ({ ...previous, states: false }))
      })
    return () => {
      active = false
    }
  }, [form.countryId])

  useEffect(() => {
    if (!form.stateId) {
      setCities([])
      return
    }
    let active = true
    setLocationLoading(previous => ({ ...previous, cities: true }))
    void fetch(`/api/locations/cities?stateId=${form.stateId}`)
      .then(response => {
        if (!response.ok) throw new Error('Unable to load cities')
        return response.json()
      })
      .then(data => {
        if (active) setCities(Array.isArray(data) ? data : [])
      })
      .catch(error => console.error('Failed to load cities', error))
      .finally(() => {
        if (active) setLocationLoading(previous => ({ ...previous, cities: false }))
      })
    return () => {
      active = false
    }
  }, [form.stateId])

  const draftPayload = useMemo(() => buildDraftPayload(form), [form])

  useEffect(() => {
    idempotencyKey.current = null
  }, [draftPayload, consents, form.profilePicture, form.resume, form.portfolio, form.caseStudy,
    form.presentation, form.awardsCertifications])

  useEffect(() => {
    if (draftUnavailableError) return
    const serialized = JSON.stringify(draftPayload)
    if (serialized === lastSavedPayload.current) return

    setAutosaveState('saving')
    const controller = new AbortController()
    autosaveController.current?.abort()
    autosaveController.current = controller
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          isLiveRegistration
            ? '/api/expert-registration/drafts/current'
            : '/api/mentor-applications/current',
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            signal: controller.signal,
            body: serialized,
          },
        )
        const result = await readResponseJson(response)
        if (!response.ok || result.success !== true) {
          const message =
            typeof result.error === 'string' ? result.error : 'Draft save failed'
          if (
            isLiveRegistration &&
            (response.status === 401 || response.status === 409)
          ) {
            setDraftUnavailableError(
              'This application was completed or changed in another tab. Reload to continue with a fresh, safe state.',
            )
          }
          throw new Error(message)
        }
        lastSavedPayload.current = serialized
        setAutosaveState('saved')
        const savedRecord = isLiveRegistration ? result.draft : result.application
        if (savedRecord) onApplicationChange(savedRecord as MentorApplication)
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Expert application autosave failed', error)
          setAutosaveState('error')
        }
      }
    }, 900)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [draftPayload, draftUnavailableError, isLiveRegistration, onApplicationChange])

  useEffect(() => {
    return () => {
      autosaveController.current?.abort()
      if (profilePreview.startsWith('blob:')) URL.revokeObjectURL(profilePreview)
    }
  }, [profilePreview])

  const validationResult = () =>
    mentorApplicationDraftFieldsSchema.safeParse(buildApplicationValues(form))

  const validateStep = (currentStep: number) => {
    const nextErrors: Record<string, string> = {}
    const result = validationResult()
    if (!result.success) {
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] || '')
        if (STEP_FIELDS[currentStep].has(field) && !nextErrors[field]) {
          nextErrors[field] = issue.message
        }
      }
    }

    if (currentStep === 0 && !form.profilePicture && !application.profileImageUrl) {
      nextErrors.profilePicture = 'Profile photo is required'
    }
    if (currentStep === 0 && form.profilePicture) {
      if (form.profilePicture.size > PROFILE_IMAGE_MAX_BYTES) {
        nextErrors.profilePicture = 'Profile photo must be 5MB or less'
      } else if (
        form.profilePicture.type &&
        !['image/jpeg', 'image/png', 'image/webp'].includes(form.profilePicture.type)
      ) {
        nextErrors.profilePicture = 'Profile photo must be a JPEG, PNG, or WebP image'
      }
    }
    if (currentStep === 5) {
      if (!form.resume && !application.resumeUrl) nextErrors.resume = 'Resume is required'
      for (const [field, file, maxBytes, maxSizeMb] of [
        ['resume', form.resume, RESUME_MAX_BYTES, 2],
        ['portfolio', form.portfolio, SUPPORTING_DOCUMENT_MAX_BYTES, 5],
        ['caseStudy', form.caseStudy, SUPPORTING_DOCUMENT_MAX_BYTES, 5],
        ['presentation', form.presentation, SUPPORTING_DOCUMENT_MAX_BYTES, 5],
        [
          'awardsCertifications',
          form.awardsCertifications,
          SUPPORTING_DOCUMENT_MAX_BYTES,
          5,
        ],
      ] as const) {
        if (file && file.size > maxBytes) {
          nextErrors[field] = `File must be ${maxSizeMb}MB or less`
        }
        if (file && file.type && file.type !== 'application/pdf') {
          nextErrors[field] = 'File must be a PDF'
        }
      }
    }
    if (currentStep === 7) {
      for (const document of legalDocuments) {
        if (!consents[document.id]) {
          nextErrors.consents = 'Accept every current policy and declaration'
          break
        }
      }
    }

    const invalidFields = Object.keys(nextErrors)
    setErrors(nextErrors)
    setSubmissionError(null)
    if (invalidFields.length > 0) focusValidationField(invalidFields[0])
    return invalidFields.length === 0
  }

  const goForward = () => {
    if (draftUnavailableError) return
    if (!validateStep(step)) return
    setSubmissionError(null)
    setStep(current => Math.min(STEPS.length - 1, current + 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    if (draftUnavailableError) return
    if (!validateStep(7)) return
    const result = validationResult()
    if (!result.success) {
      const firstIssue = result.error.issues[0]
      const firstField = String(firstIssue.path[0] || '')
      const targetStep = STEP_FIELDS.findIndex(fields => fields.has(firstField))
      const nextErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = String(issue.path[0] || '')
        if (
          !nextErrors[field] &&
          (targetStep < 0 || STEP_FIELDS[targetStep].has(field))
        ) {
          nextErrors[field] = issue.message
        }
      }
      setErrors(nextErrors)
      if (targetStep >= 0) setStep(targetStep)
      setSubmissionError(null)
      focusValidationField(firstField)
      return
    }
    if (!form.profilePicture && !application.profileImageUrl) {
      setStep(0)
      setErrors({ profilePicture: 'Profile photo is required' })
      focusValidationField('profilePicture')
      return
    }
    if (!form.resume && !application.resumeUrl) {
      setStep(5)
      setErrors({ resume: 'Resume is required' })
      focusValidationField('resume')
      return
    }

    setIsSubmitting(true)
    setSubmissionError(null)
    try {
      const key = idempotencyKey.current || crypto.randomUUID()
      idempotencyKey.current = key
      const body = new FormData()
      for (const [field, value] of Object.entries(result.data)) {
        body.append(field, Array.isArray(value) ? JSON.stringify(value) : String(value))
      }
      if (form.profilePicture) body.append('profilePicture', form.profilePicture)
      if (form.resume) body.append('resume', form.resume)
      if (form.portfolio) body.append('portfolio', form.portfolio)
      if (form.caseStudy) body.append('caseStudy', form.caseStudy)
      if (form.presentation) body.append('presentation', form.presentation)
      if (form.awardsCertifications) {
        body.append('awardsCertifications', form.awardsCertifications)
      }
      body.append(
        'consents',
        JSON.stringify(
          legalDocuments.map(document => ({
            documentId: document.id,
            version: document.version,
            accepted: consents[document.id],
          })),
        ),
      )

      const response = await fetch(
        isLiveRegistration
          ? '/api/expert-registration/drafts/current/prepare-auth'
          : '/api/mentor-applications/current/submit',
        {
          method: 'POST',
          headers: { 'Idempotency-Key': key },
          credentials: 'include',
          body,
        },
      )
      const responseBody = await readResponseJson(response)
      const submittedRecord = isLiveRegistration
        ? responseBody.draft
        : responseBody.application
      if (!response.ok || responseBody.success !== true || !submittedRecord) {
        if (
          isLiveRegistration &&
          (response.status === 401 || response.status === 409)
        ) {
          setDraftUnavailableError(
            'This application was completed or changed in another tab. Reload to continue with a fresh, safe state.',
          )
        }
        throw new Error(
          typeof responseBody.error === 'string'
            ? responseBody.error
            : 'Unable to submit the application',
        )
      }
      idempotencyKey.current = null
      sessionStorage.removeItem(`mentor-application-step:${application.id}`)
      if (isLiveRegistration) {
        onReadyForAuthentication?.(submittedRecord as MentorApplication)
      } else {
        onSubmitted?.(submittedRecord as MentorApplication)
      }
    } catch (error) {
      setSubmissionError(
        error instanceof Error ? error.message : 'Unable to submit the application',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="space-y-7">
          <div className="grid gap-6 md:grid-cols-[10rem_1fr]">
            <div className="space-y-3" data-validation-field="profilePicture">
              <Label htmlFor="profilePicture" className="font-semibold">
                Profile photo <span className="text-red-500">*</span>
              </Label>
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={profilePreview} alt="Profile preview" />
                <AvatarFallback className="bg-indigo-50 text-indigo-600">
                  <UserRound className="h-10 w-10" />
                </AvatarFallback>
              </Avatar>
              <Label
                htmlFor="profilePicture"
                className="inline-flex cursor-pointer items-center text-sm font-semibold text-indigo-700"
              >
                <Upload className="mr-2 h-4 w-4" /> Choose image
              </Label>
              <Input
                id="profilePicture"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                aria-invalid={Boolean(errors.profilePicture)}
                aria-describedby={errors.profilePicture ? 'profilePicture-error' : undefined}
                className="sr-only"
                onChange={event => {
                  const file = event.target.files?.[0] || null
                  updateForm('profilePicture', file)
                  if (profilePreview.startsWith('blob:')) URL.revokeObjectURL(profilePreview)
                  setProfilePreview(file ? URL.createObjectURL(file) : application.profileImageUrl || '')
                }}
              />
              <p className="text-xs text-slate-500">JPEG, PNG or WebP. Maximum 5MB.</p>
              <FieldError field="profilePicture" error={errors.profilePicture} />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fullName">Full name *</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={event => updateForm('fullName', event.target.value)}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  className={cn(
                    'h-11 bg-white',
                    errors.fullName && 'border-red-500 focus-visible:ring-red-500',
                  )}
                />
                <FieldError field="fullName" error={errors.fullName} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="professionalHeadline">Professional headline *</Label>
                <Input
                  id="professionalHeadline"
                  value={form.professionalHeadline}
                  onChange={event => updateForm('professionalHeadline', event.target.value)}
                  placeholder="e.g. Growth strategist helping founders scale responsibly"
                  aria-invalid={Boolean(errors.professionalHeadline)}
                  aria-describedby={
                    errors.professionalHeadline ? 'professionalHeadline-error' : undefined
                  }
                  className={cn(
                    'h-11 bg-white',
                    errors.professionalHeadline &&
                      'border-red-500 focus-visible:ring-red-500',
                  )}
                />
                <FieldError
                  field="professionalHeadline"
                  error={errors.professionalHeadline}
                />
              </div>
              {!isLiveRegistration && (
                <div className="space-y-2">
                  <Label>Verified email</Label>
                  <Input value={application.email} disabled className="h-11 bg-slate-100" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile number *</Label>
                <div className="grid grid-cols-[9rem_1fr] gap-2">
                  <SearchableSelect
                    id="phoneCountryCode"
                    value={form.phoneCountryCode}
                    onChange={value => updateForm('phoneCountryCode', value)}
                    options={phoneCodeOptions}
                    placeholder="Code"
                    searchPlaceholder="Search code..."
                  />
                  <Input
                    id="phone"
                    inputMode="tel"
                    value={form.phone}
                    onChange={event => updateForm('phone', event.target.value.replace(/\D/g, ''))}
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    className={cn(
                      'h-11 bg-white',
                      errors.phone && 'border-red-500 focus-visible:ring-red-500',
                    )}
                  />
                </div>
                <FieldError field="phone" error={errors.phone} />
              </div>
            </div>
          </div>

          <fieldset className="space-y-4">
            <legend className="text-base font-semibold text-slate-800">Normalized location *</legend>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Country</Label>
                <SearchableSelect
                  id="countryId"
                  value={form.countryId}
                  onChange={value => {
                    setForm(previous => ({ ...previous, countryId: value, stateId: '', cityId: '' }))
                    clearFieldErrors('countryId', 'stateId', 'cityId')
                  }}
                  options={countryOptions}
                  placeholder="Select country"
                  searchPlaceholder="Search countries..."
                  disabled={locationLoading.countries}
                  error={errors.countryId}
                />
                <FieldError field="countryId" error={errors.countryId} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <SearchableSelect
                  id="stateId"
                  value={form.stateId}
                  onChange={value => {
                    setForm(previous => ({ ...previous, stateId: value, cityId: '' }))
                    clearFieldErrors('stateId', 'cityId')
                  }}
                  options={stateOptions}
                  placeholder="Select state"
                  searchPlaceholder="Search states..."
                  disabled={!form.countryId || locationLoading.states}
                  error={errors.stateId}
                />
                <FieldError field="stateId" error={errors.stateId} />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <SearchableSelect
                  id="cityId"
                  value={form.cityId}
                  onChange={value => updateForm('cityId', value)}
                  options={cityOptions}
                  placeholder="Select city"
                  searchPlaceholder="Search cities..."
                  disabled={!form.stateId || locationLoading.cities}
                  error={errors.cityId}
                />
                <FieldError field="cityId" error={errors.cityId} />
              </div>
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn profile *</Label>
              <Input
                id="linkedinUrl"
                type="url"
                value={form.linkedinUrl}
                onChange={event => updateForm('linkedinUrl', event.target.value)}
                placeholder="linkedin.com/in/..."
                aria-invalid={Boolean(errors.linkedinUrl)}
                aria-describedby={errors.linkedinUrl ? 'linkedinUrl-error' : undefined}
                className={cn(
                  'h-11 bg-white',
                  errors.linkedinUrl && 'border-red-500 focus-visible:ring-red-500',
                )}
              />
              <FieldError field="linkedinUrl" error={errors.linkedinUrl} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website or portfolio URL</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={form.websiteUrl}
                onChange={event => updateForm('websiteUrl', event.target.value)}
                placeholder="yourwebsite.com"
                aria-invalid={Boolean(errors.websiteUrl)}
                aria-describedby={errors.websiteUrl ? 'websiteUrl-error' : undefined}
                className={cn(
                  'h-11 bg-white',
                  errors.websiteUrl && 'border-red-500 focus-visible:ring-red-500',
                )}
              />
              <FieldError field="websiteUrl" error={errors.websiteUrl} />
            </div>
          </div>
        </div>
      )
    }

    if (step === 1) {
      return (
        <div className="space-y-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Current designation *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={event => updateForm('title', event.target.value)}
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? 'title-error' : undefined}
                className={cn(
                  'h-11 bg-white',
                  errors.title && 'border-red-500 focus-visible:ring-red-500',
                )}
              />
              <FieldError field="title" error={errors.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Current organization *</Label>
              <Input
                id="company"
                value={form.company}
                onChange={event => updateForm('company', event.target.value)}
                placeholder="Use Independent or Retired when applicable"
                aria-invalid={Boolean(errors.company)}
                aria-describedby={errors.company ? 'company-error' : undefined}
                className={cn(
                  'h-11 bg-white',
                  errors.company && 'border-red-500 focus-visible:ring-red-500',
                )}
              />
              <FieldError field="company" error={errors.company} />
            </div>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-base font-semibold text-slate-800">Employment type *</legend>
            <RadioCards
              name="employmentType"
              value={form.employmentType}
              options={EMPLOYMENT_TYPE_OPTIONS}
              onChange={value => updateForm('employmentType', value)}
              error={errors.employmentType}
            />
            <FieldError field="employmentType" error={errors.employmentType} />
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-base font-semibold text-slate-800">Total experience *</legend>
            <p className="text-sm text-slate-500">There is no minimum experience requirement.</p>
            <RadioCards
              name="experienceBand"
              value={form.experienceBand}
              options={EXPERIENCE_BAND_OPTIONS}
              onChange={value => updateForm('experienceBand', value)}
              columns={4}
              error={errors.experienceBand}
            />
            <FieldError field="experienceBand" error={errors.experienceBand} />
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-base font-semibold text-slate-800">Industries worked in *</legend>
            <CheckboxCards
              name="industries"
              values={form.industries}
              options={INDUSTRY_OPTIONS}
              onChange={values => updateForm('industries', values)}
              error={errors.industries}
            />
            <FieldError field="industries" error={errors.industries} />
            {form.industries.includes('OTHER') && (
              <div className="max-w-xl space-y-2">
                <Label htmlFor="otherIndustry">Other industry *</Label>
                <Input
                  id="otherIndustry"
                  value={form.otherIndustry}
                  onChange={event => updateForm('otherIndustry', event.target.value)}
                  aria-invalid={Boolean(errors.otherIndustry)}
                  aria-describedby={errors.otherIndustry ? 'otherIndustry-error' : undefined}
                  className={cn(
                    'h-11 bg-white',
                    errors.otherIndustry && 'border-red-500 focus-visible:ring-red-500',
                  )}
                />
                <FieldError field="otherIndustry" error={errors.otherIndustry} />
              </div>
            )}
          </fieldset>
        </div>
      )
    }

    if (step === 2) {
      return (
        <fieldset className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <legend className="text-base font-semibold text-slate-800">
              Select your strongest areas of expertise *
            </legend>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
              {form.expertise.length}/5 selected
            </span>
          </div>
          <CheckboxCards
            name="expertise"
            values={form.expertise}
            options={EXPERTISE_OPTIONS}
            onChange={values => updateForm('expertise', values)}
            max={5}
            error={errors.expertise}
          />
          <FieldError field="expertise" error={errors.expertise} />
          {form.expertise.includes('OTHER') && (
            <div className="max-w-xl space-y-2">
              <Label htmlFor="otherExpertise">Other expertise *</Label>
              <Input
                id="otherExpertise"
                value={form.otherExpertise}
                onChange={event => updateForm('otherExpertise', event.target.value)}
                aria-invalid={Boolean(errors.otherExpertise)}
                aria-describedby={errors.otherExpertise ? 'otherExpertise-error' : undefined}
                className={cn(
                  'h-11 bg-white',
                  errors.otherExpertise && 'border-red-500 focus-visible:ring-red-500',
                )}
              />
              <FieldError field="otherExpertise" error={errors.otherExpertise} />
            </div>
          )}
        </fieldset>
      )
    }

    if (step === 3) {
      return (
        <div className="space-y-7">
          <TextareaField
            id="about"
            label="Tell us about your professional journey"
            value={form.about}
            onChange={value => updateForm('about', value)}
            placeholder="Share the roles, transitions, and experiences that shaped your expertise."
            error={errors.about}
          />
          <TextareaField
            id="challengeSolved"
            label="What is one challenge people commonly seek your advice on?"
            value={form.challengeSolved}
            onChange={value => updateForm('challengeSolved', value)}
            placeholder="Describe a specific recurring problem where your experience is especially useful."
            error={errors.challengeSolved}
          />
          <TextareaField
            id="measurableOutcomes"
            label="What measurable outcomes have you contributed to?"
            value={form.measurableOutcomes}
            onChange={value => updateForm('measurableOutcomes', value)}
            placeholder="Examples: revenue growth, cost savings, team scaling, market expansion, or transformation."
            error={errors.measurableOutcomes}
          />
          <TextareaField
            id="guidanceValueProposition"
            label="Why should someone seek your guidance instead of online content or AI?"
            value={form.guidanceValueProposition}
            onChange={value => updateForm('guidanceValueProposition', value)}
            placeholder="Explain the context, judgment, accountability, or lived experience you bring."
            error={errors.guidanceValueProposition}
          />
        </div>
      )
    }

    if (step === 4) {
      return (
        <fieldset className="space-y-4">
          <legend className="text-base font-semibold text-slate-800">
            Select every credibility signal that applies
          </legend>
          <p className="text-sm text-slate-500">
            These are reviewed as context. They are not automatically scored.
          </p>
          <CheckboxCards
            name="credibilitySignals"
            values={form.credibilitySignals}
            options={CREDIBILITY_SIGNAL_OPTIONS}
            onChange={values => updateForm('credibilitySignals', values)}
          />
        </fieldset>
      )
    }

    if (step === 5) {
      return (
        <div className="space-y-4">
          <FileField
            id="resume"
            label="Resume or CV"
            required
            file={form.resume}
            existingUrl={application.resumeUrl}
            maxSizeMb={2}
            onChange={file => updateForm('resume', file)}
            error={errors.resume}
          />
          <FieldError field="resume" error={errors.resume} />
          <FileField
            id="portfolio"
            label="Portfolio"
            file={form.portfolio}
            existingUrl={application.portfolioUrl}
            onChange={file => updateForm('portfolio', file)}
            error={errors.portfolio}
          />
          <FieldError field="portfolio" error={errors.portfolio} />
          <FileField
            id="caseStudy"
            label="Case study"
            file={form.caseStudy}
            existingUrl={application.caseStudyUrl}
            onChange={file => updateForm('caseStudy', file)}
            error={errors.caseStudy}
          />
          <FieldError field="caseStudy" error={errors.caseStudy} />
          <FileField
            id="presentation"
            label="Presentation"
            file={form.presentation}
            existingUrl={application.presentationUrl}
            onChange={file => updateForm('presentation', file)}
            error={errors.presentation}
          />
          <FieldError field="presentation" error={errors.presentation} />
          <FileField
            id="awardsCertifications"
            label="Awards and certifications"
            file={form.awardsCertifications}
            existingUrl={application.awardsCertificationsUrl}
            onChange={file => updateForm('awardsCertifications', file)}
            error={errors.awardsCertifications}
          />
          <FieldError
            field="awardsCertifications"
            error={errors.awardsCertifications}
          />
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            Supporting documents are optional and private. Video introduction is intentionally
            deferred for future review.
          </div>
        </div>
      )
    }

    if (step === 6) {
      return (
        <div className="space-y-7">
          <fieldset className="space-y-3">
            <legend className="text-base font-semibold text-slate-800">I am interested in *</legend>
            <CheckboxCards
              name="serviceInterests"
              values={form.serviceInterests}
              options={SERVICE_INTEREST_OPTIONS}
              onChange={values => updateForm('serviceInterests', values)}
              error={errors.serviceInterests}
            />
            <FieldError field="serviceInterests" error={errors.serviceInterests} />
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="text-base font-semibold text-slate-800">
              Preferred session mode *
            </legend>
            <RadioCards
              name="preferredSessionMode"
              value={form.preferredSessionMode}
              options={SESSION_MODE_OPTIONS}
              onChange={value => updateForm('preferredSessionMode', value)}
              columns={3}
              error={errors.preferredSessionMode}
            />
            <FieldError
              field="preferredSessionMode"
              error={errors.preferredSessionMode}
            />
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="text-base font-semibold text-slate-800">
              Languages you can mentor in *
            </legend>
            <CheckboxCards
              name="languages"
              values={form.languages}
              options={LANGUAGE_OPTIONS}
              onChange={values => updateForm('languages', values)}
              error={errors.languages}
            />
            <FieldError field="languages" error={errors.languages} />
            {form.languages.includes('OTHER') && (
              <div className="max-w-xl space-y-2">
                <Label htmlFor="otherLanguage">Other language *</Label>
                <Input
                  id="otherLanguage"
                  value={form.otherLanguage}
                  onChange={event => updateForm('otherLanguage', event.target.value)}
                  aria-invalid={Boolean(errors.otherLanguage)}
                  aria-describedby={errors.otherLanguage ? 'otherLanguage-error' : undefined}
                  className={cn(
                    'h-11 bg-white',
                    errors.otherLanguage && 'border-red-500 focus-visible:ring-red-500',
                  )}
                />
                <FieldError field="otherLanguage" error={errors.otherLanguage} />
              </div>
            )}
          </fieldset>
          <fieldset className="space-y-3">
            <legend className="text-base font-semibold text-slate-800">
              Weekly availability *
            </legend>
            <RadioCards
              name="weeklyAvailabilityBand"
              value={form.weeklyAvailabilityBand}
              options={WEEKLY_AVAILABILITY_OPTIONS}
              onChange={value => updateForm('weeklyAvailabilityBand', value)}
              columns={4}
              error={errors.weeklyAvailabilityBand}
            />
            <FieldError
              field="weeklyAvailabilityBand"
              error={errors.weeklyAvailabilityBand}
            />
          </fieldset>
        </div>
      )
    }

    return (
      <div className="space-y-7">
        <div
          id="consents"
          data-validation-field="consents"
          className={cn(
            'rounded-2xl border bg-slate-50 p-5',
            errors.consents ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200',
          )}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">Policies and declaration</h3>
              <p className="mt-1 text-sm text-slate-500">
                Accept each current document before submitting.
              </p>
            </div>
            <Button type="button" variant="outline" asChild>
              <a href="/policies" target="_blank" rel="noreferrer">
                <FileText className="mr-2 h-4 w-4" /> View documents
              </a>
            </Button>
          </div>
          <div className="mt-5 space-y-3">
            {legalDocuments.map(document => (
              <Label
                key={document.id}
                htmlFor={`consent-${document.id}`}
                className="flex cursor-pointer items-start gap-3 rounded-xl bg-white p-3 text-sm"
              >
                <Checkbox
                  id={`consent-${document.id}`}
                  checked={consents[document.id]}
                  onCheckedChange={checked => {
                    setConsents(previous => ({
                      ...previous,
                      [document.id]: checked === true,
                    }))
                    clearFieldErrors('consents')
                  }}
                  className="mt-0.5"
                />
                <span>
                  I accept the <strong>{document.label}</strong>.
                </span>
              </Label>
            ))}
          </div>
          <FieldError field="consents" error={errors.consents} />
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
            <p>
              Your application will be reviewed within approximately 5–10 business days.
              {isLiveRegistration
                ? ' You will securely sign in before the application is submitted.'
                : ' Submission does not create a platform account or guarantee selection.'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const currentStep = STEPS[step]
  const validationEntries = Object.entries(errors)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Button type="button" variant="ghost" onClick={onExit}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to home
          </Button>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            {autosaveState === 'saving' && <Save className="h-4 w-4 animate-pulse" />}
            {autosaveState === 'saved' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            <span>
              {autosaveState === 'saving'
                ? 'Saving draft...'
                : autosaveState === 'saved'
                  ? 'Draft saved'
                  : autosaveState === 'error'
                    ? 'Draft save failed'
                    : 'Secure application'}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">
            Become a verified SharingMinds Expert
          </p>
          <div className="mt-3 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Expert application</h1>
              <p className="mt-2 text-slate-600">A focused application that takes about 5–7 minutes.</p>
            </div>
            <p className="text-sm font-medium text-slate-500">
              Step {step + 1} of {STEPS.length}
            </p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
          <nav aria-label="Application progress" className="hidden lg:block">
            <ol className="space-y-2">
              {STEPS.map((item, index) => (
                <li key={item.title}>
                  <button
                    type="button"
                    onClick={() => {
                      if (index < step) setStep(index)
                    }}
                    disabled={index > step}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-xl p-3 text-left',
                      index === step && 'bg-indigo-50 text-indigo-900',
                      index < step && 'text-slate-700 hover:bg-white',
                      index > step && 'cursor-not-allowed text-slate-400',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                        index < step && 'bg-emerald-100 text-emerald-700',
                        index === step && 'bg-indigo-600 text-white',
                        index > step && 'bg-slate-200 text-slate-500',
                      )}
                    >
                      {index < step ? <Check className="h-4 w-4" /> : index + 1}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{item.title}</span>
                      <span className="mt-1 block text-xs leading-5 opacity-70">
                        {item.description}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-xl shadow-slate-200/50">
            <div className="border-b border-slate-100 bg-white px-5 py-5 sm:px-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                Step {step + 1}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">{currentStep.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{currentStep.description}</p>
            </div>
            <CardContent className="bg-slate-50/60 p-5 sm:p-8">
              {validationEntries.length > 0 && (
                <div
                  ref={validationSummaryRef}
                  id="application-validation-summary"
                  role="alert"
                  aria-live="assertive"
                  tabIndex={-1}
                  className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-red-900 outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-semibold">
                        Please correct {validationEntries.length}{' '}
                        {validationEntries.length === 1 ? 'field' : 'fields'} before continuing.
                      </p>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                        {validationEntries.map(([field, message]) => (
                          <li key={field}>
                            <button
                              type="button"
                              onClick={() => focusValidationField(field)}
                              className="text-left underline decoration-red-300 underline-offset-2 hover:decoration-red-700"
                            >
                              {message}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              {submissionError && (
                <div role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {submissionError}
                </div>
              )}
              {draftUnavailableError && (
                <div
                  role="alert"
                  className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
                >
                  <p>{draftUnavailableError}</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3"
                    onClick={() => window.location.reload()}
                  >
                    Reload registration
                  </Button>
                </div>
              )}
              {renderStep()}

              <div className="mt-10 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  disabled={step === 0 || isSubmitting || Boolean(draftUnavailableError)}
                  onClick={() => setStep(current => Math.max(0, current - 1))}
                  className="h-11"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={goForward}
                    disabled={Boolean(draftUnavailableError)}
                    className="h-11 bg-slate-900 hover:bg-slate-800"
                  >
                    Save and continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    disabled={isSubmitting || Boolean(draftUnavailableError)}
                    onClick={() => void handleSubmit()}
                    className="h-11 bg-slate-900 hover:bg-slate-800"
                  >
                    {isSubmitting
                      ? isLiveRegistration
                        ? 'Preparing secure sign in...'
                        : 'Submitting application...'
                      : application.status === 'CHANGES_REQUESTED'
                        ? 'Resubmit application'
                        : isLiveRegistration
                          ? 'Continue to secure sign in'
                          : 'Submit application'}
                    {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
