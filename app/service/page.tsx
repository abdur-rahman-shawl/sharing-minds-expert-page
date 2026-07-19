import type { Metadata } from "next"
import ServicePageClient from "./ServicePageClient"

export const metadata: Metadata = {
  title: "Services — SharingMinds",
  description: "Explore expert guidance services and how SharingMinds helps you connect, learn, and grow.",
}

export default function ServicePage() {
  return <ServicePageClient />
}
