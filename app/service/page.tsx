import type { Metadata } from "next"
import ServicePageClient from "./ServicePageClient"

export const metadata: Metadata = {
  title: "Services — SharingMinds",
  description: "Explore our expert mentoring services and how we help you connect, learn, and grow.",
}

export default function ServicePage() {
  return <ServicePageClient />
}
