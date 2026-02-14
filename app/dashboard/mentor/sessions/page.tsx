
import { SessionsView } from "@/components/mentor/sessions/sessions-view"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const metadata = {
    title: "My Sessions | Mentor Dashboard",
    description: "Manage your mentoring sessions",
}

export default async function MentorSessionsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return <SessionsView />
}
