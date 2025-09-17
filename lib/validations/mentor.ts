import { z } from 'zod'

export const mentorApplicationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+91-\d{10}$/, 'Phone number must be in format: +91-XXXXXXXXXX'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  title: z.string().min(2, 'Job title must be at least 2 characters'),
  company: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.string().min(1, 'Industry is required'),
  expertise: z.string().min(100, 'Expertise must be at least 100 characters').max(500, 'Expertise must not exceed 500 characters'),
  experience: z.string().refine((val) => {
    const num = parseInt(val)
    return !isNaN(num) && num >= 2
  }, 'Minimum 2 years of experience required'),
  about: z.string().optional(),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').regex(/linkedin\.com/, 'Must be a LinkedIn URL'),
  availability: z.string().min(1, 'Availability is required'),
  profilePicture: z.instanceof(File, { message: 'Profile picture is required' }),
  resume: z.instanceof(File, { message: 'Resume is required' }),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions')
})

export type MentorApplicationData = z.infer<typeof mentorApplicationSchema>