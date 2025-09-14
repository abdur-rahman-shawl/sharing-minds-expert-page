import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registration - SharingMinds",
  description: "Complete your registration with SharingMinds.",
}

export default function RegistrationPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Registration</h1>
          <p className="mt-4 text-lg text-gray-600">This is a dummy registration page.</p>
        </div>
      </section>
    </div>
  )
}
