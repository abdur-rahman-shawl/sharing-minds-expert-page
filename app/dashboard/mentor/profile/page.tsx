import { MentorProfileEdit } from "@/components/mentor/dashboard/mentor-profile-edit"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function MentorProfilePage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return <div>Access Denied</div>;
    }

    return <MentorProfileEdit />
}
