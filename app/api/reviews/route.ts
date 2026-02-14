
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Fetch reviews where the user is the reviewee (received reviews)
        const data = await db.query.reviews.findMany({
            where: eq(reviews.revieweeId, userId),
            with: {
                reviewer: {
                    columns: {
                        id: true,
                        name: true,
                        image: true
                    }
                },
                session: {
                    columns: {
                        title: true,
                        scheduledAt: true
                    }
                }
            },
            orderBy: [desc(reviews.createdAt)],
        });

        return NextResponse.json({ data });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { error: "Failed to fetch reviews" },
            { status: 500 }
        );
    }
}
