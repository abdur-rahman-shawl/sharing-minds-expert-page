import type { Metadata } from "next"
import ContactPageClient from "./ContactPageClient"

export const metadata: Metadata = {
  title: "Contact • SharingMinds",
  description: "Get in touch with the SharingMinds team for support, partnerships, or general inquiries.",
}

export default function ContactPage() {
  return <ContactPageClient />
}
