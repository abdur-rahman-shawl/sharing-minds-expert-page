
"use client"

import { format } from "date-fns"
import { Calendar, Clock, Link as LinkIcon, MoreVertical, Video } from "lucide-react"
import Link from "next/link"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Session } from "@/hooks/queries/use-mentor-sessions-query"
import { cn } from "@/lib/utils"

interface SessionCardProps {
    session: Session
}

export function SessionCard({ session }: SessionCardProps) {
    const isUpcoming = session.status === "scheduled" && new Date(session.scheduledAt) > new Date()
    const isPast = new Date(session.scheduledAt) < new Date() && session.status !== "cancelled"

    const statusColors = {
        scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        in_progress: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        completed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        no_show: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={session.mentee?.image || ""} alt={session.mentee?.name || "Mentee"} />
                        <AvatarFallback>{session.mentee?.name?.charAt(0) || "M"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold leading-none">{session.mentee?.name || "Unknown Mentee"}</h3>
                        <p className="text-sm text-muted-foreground">{session.title}</p>
                    </div>
                </div>
                <Badge variant="secondary" className={cn("capitalize", statusColors[session.status])}>
                    {session.status.replace("_", " ")}
                </Badge>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(session.scheduledAt), "MMM d, yyyy")}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>
                        {format(new Date(session.scheduledAt), "h:mm a")} - {session.duration} mins
                    </span>
                </div>
                {session.meetingUrl && session.status === "scheduled" && (
                    <div className="flex items-center gap-2 text-primary">
                        <Video className="h-4 w-4" />
                        <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate max-w-[200px]">
                            Join Meeting
                        </a>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
                <div className="flex gap-2">
                    {session.status === 'scheduled' && (
                        <Button variant="outline" size="sm" asChild>
                            <a href={session.meetingUrl || "#"} target="_blank" rel="noreferrer">Join</a>
                        </Button>
                    )}
                    <Button variant="ghost" size="sm">Details</Button>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Mentee Profile</DropdownMenuItem>
                        <DropdownMenuItem>Add Note</DropdownMenuItem>
                        {session.status === 'scheduled' && (
                            <DropdownMenuItem className="text-red-600">Cancel Session</DropdownMenuItem>
                        )}

                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>
        </Card>
    )
}
