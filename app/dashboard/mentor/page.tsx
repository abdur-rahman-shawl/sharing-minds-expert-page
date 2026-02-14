import { MentorOnlyDashboard } from "@/components/mentor/dashboard/mentor-only-dashboard"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function MentorDashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return <MentorOnlyDashboard user={session?.user} />
}
