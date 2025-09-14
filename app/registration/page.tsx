import type { Metadata } from "next"
import RegistrationForm from "./RegistrationForm"

export const metadata: Metadata = {
  title: "Expert Application - SharingMinds",
  description: "Apply to become an expert mentor at SharingMinds.",
}

export default function RegistrationPage() {
  return <RegistrationForm />
}