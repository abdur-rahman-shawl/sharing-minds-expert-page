'use client'
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function VerifyEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const emailFromQuery = searchParams.get("email")
    if (emailFromQuery) {
      setEmail(emailFromQuery)
    }
  }, [searchParams])

  const handleSkip = () => {
    router.push("/registration")
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="p-4">
        <Button variant="link" onClick={handleGoBack}>&larr; Go Back</Button>
      </nav>
      <section className="py-20 px-4">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Verify Your Email</h1>
          <p className="mt-4 text-lg text-gray-600">Please verify your email to continue.</p>

          <div className="mt-8 text-left">
            <div className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center gap-2">
                <Input id="email" value={email} readOnly={!isEditing} onChange={(e) => setEmail(e.target.value)} className="bg-gray-100" />
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Save" : "Edit"}</Button>
              </div>
            </div>

            <div className="space-y-4">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Verify with OTP</Button>
              <Button variant="outline" className="w-full">Verify with Google</Button>
            </div>

            <div className="mt-8 text-center">
              <Button variant="link" onClick={handleSkip}>Skip for now</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
