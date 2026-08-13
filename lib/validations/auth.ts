import { z } from 'zod'

export const passwordValidation = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .max(128, { message: 'Password must not exceed 128 characters' })
  .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })

export const signUpSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),
    email: z.string().trim().toLowerCase().email({ message: 'Invalid email address' }),
    password: passwordValidation,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
})
