import type { Metadata } from "next"
import RegistrationForm from "@/app/registration/RegistrationForm"
import { EXPERT_APPLICATION_PATH } from "@/lib/routes"

export const metadata: Metadata = {
  title: "Expert Verification Application - SharingMinds",
  description:
    "Apply for expert verification and join the SharingMinds community of experienced professionals.",
  alternates: {
    canonical: EXPERT_APPLICATION_PATH,
  },
}

export default function VerifiedExpertsPage() {
  return <RegistrationForm />
}
