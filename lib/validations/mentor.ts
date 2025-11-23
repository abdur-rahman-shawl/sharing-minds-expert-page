import { z } from 'zod'

const MAX_RESUME_SIZE = 5 * 1024 * 1024 // 5MB

export const mentorApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+\d{1,4}-\d{6,15}$/, 'Invalid phone number format. Expected +countrycode-number'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  title: z.string().min(2, 'Job title must be at least 2 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(1, 'Industry is required'),
  otherIndustry: z.string().optional(),
  expertise: z.string()
    .min(1, 'Expertise is required')
    .max(500, 'Expertise must not exceed 500 characters')
    .refine(value => value.split(',').length >= 5, 'Please list at least 5 areas of expertise, separated by commas.'),
  experience: z.string().refine((val) => {
    const num = parseInt(val)
    return !isNaN(num) && num >= 2
  }, 'Minimum 2 years of experience required'),
  about: z.string().optional(),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').regex(/linkedin\.com/, 'Must be a LinkedIn URL'),
  availability: z.string().min(1, 'Availability is required'),
  profilePicture: z.any().refine(file => file instanceof File, 'Profile picture is required'),
  resume: z.any()
    .refine(file => !file || file instanceof File, "Resume must be a file")
    .refine(file => !file || file.size <= MAX_RESUME_SIZE, `Resume must be less than 5MB`)
    .optional(),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
}).superRefine((data, ctx) => {
  if (data.industry === 'Other' && (!data.otherIndustry || data.otherIndustry.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify your industry',
      path: ['otherIndustry'],
    })
  }
})

export type MentorApplicationData = z.infer<typeof mentorApplicationSchema>
