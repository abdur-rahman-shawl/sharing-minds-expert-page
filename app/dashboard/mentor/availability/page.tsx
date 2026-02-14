import { Metadata } from "next"

import { MentorAvailabilityManager } from "@/components/mentor/availability/mentor-availability-manager"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Availability Management",
    description: "Manage your mentorship availability and schedule.",
}

export default async function MentorAvailabilityPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Availability</h3>
                <p className="text-sm text-muted-foreground">
                    Set your weekly schedule and booking preferences.
                </p>
            </div>
            <Separator />
            <MentorAvailabilityManager />
        </div>
    )
}
