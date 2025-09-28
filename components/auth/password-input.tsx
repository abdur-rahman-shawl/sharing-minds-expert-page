'use client'

import { forwardRef, useState } from 'react'
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ value, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const password = typeof value === 'string' ? value : value?.toString() ?? ''

    const hasMinLength = password.length >= 8
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)

    return (
      <div className="space-y-2">
        <div className="relative">
          <Input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            value={password}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <div className="space-y-1 text-xs">
          <PasswordRequirement label="At least 8 characters" met={hasMinLength} />
          <PasswordRequirement label="Contains a letter" met={hasLetter} />
          <PasswordRequirement label="Contains a number" met={hasNumber} />
        </div>
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'

function PasswordRequirement({ label, met }: { label: string; met: boolean }) {
  return (
    <div className={cn('flex items-center', met ? 'text-green-500' : 'text-gray-500')}>
      {met ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
      {label}
    </div>
  )
}
