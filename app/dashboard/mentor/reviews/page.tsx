
import { ReviewsList } from "@/components/mentor/reviews/reviews-list"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export const metadata = {
    title: "Reviews | Mentor Dashboard",
    description: "View your student reviews and ratings",
}

export default async function MentorReviewsPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    return (
        <div className="flex flex-col space-y-4 h-full">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
            </div>
            <ReviewsList />
        </div>
    )
}
