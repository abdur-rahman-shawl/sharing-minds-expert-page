
"use client"

import { formatDistanceToNow } from "date-fns"
import { Star } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Review, useMentorReviewsQuery } from "@/hooks/queries/use-mentor-reviews"
import { Skeleton } from "@/components/ui/skeleton"

export function ReviewsList() {
    const { data: reviews, isLoading } = useMentorReviewsQuery()

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                ))}
            </div>
        )
    }

    if (reviews?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center border border-dashed rounded-lg bg-muted/20">
                <Star className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">No reviews yet.</p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            {reviews?.map((review) => (
                <ReviewCard key={review.id} review={review} />
            ))}
        </div>
    )
}

function ReviewCard({ review }: { review: Review }) {
    const score = parseFloat(review.finalScore);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={review.reviewer?.image || ""} alt={review.reviewer?.name || ""} />
                    <AvatarFallback>{review.reviewer?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <div className="font-semibold">{review.reviewer?.name || "Anonymous"}</div>
                    <div className="text-xs text-muted-foreground">
                        {review.session?.title} • {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/20 px-2 py-1 rounded-md">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-bold text-yellow-700 dark:text-yellow-500">{score.toFixed(1)}</span>
                </div>
            </CardHeader>
            <CardContent>
                {review.feedback ? (
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">"{review.feedback}"</p>
                ) : (
                    <p className="text-sm text-muted-foreground italic">No written feedback provided.</p>
                )}
            </CardContent>
        </Card>
    )
}
