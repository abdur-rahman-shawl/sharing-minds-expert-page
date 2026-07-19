import { permanentRedirect } from "next/navigation"
import { EXPERT_APPLICATION_PATH } from "@/lib/routes"

export default function RegistrationPage() {
  permanentRedirect(EXPERT_APPLICATION_PATH)
}
