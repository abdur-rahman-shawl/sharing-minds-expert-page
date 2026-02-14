
import { MessagesView } from "@/components/mentor/messages/messages-view"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const metadata = {
    title: "Messages | Mentor Dashboard",
    description: "Chat with your mentees",
}

export default async function MentorMessagesPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <div className="flex flex-col space-y-4 h-full">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
            </div>
            <MessagesView />
        </div>
    )
}
