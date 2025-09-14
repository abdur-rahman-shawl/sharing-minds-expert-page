import type { Metadata } from "next"
import AboutPageClient from "./AboutPageClient"

export const metadata: Metadata = {
  title: "About Us — SharingMinds",
  description: "Our mission, values, and the people behind SharingMinds.",
}

export default function AboutPage() {
  return <AboutPageClient />
}