
"use client"

import { formatDistanceToNow } from "date-fns"
import { Search } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Thread, useThreadsQuery } from "@/hooks/queries/use-messaging-queries"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useSessionWithRolesQuery } from "@/hooks/queries/use-session-query"

interface ThreadListProps {
    selectedThreadId: string | null
    onSelectThread: (threadId: string) => void
}

export function ThreadList({ selectedThreadId, onSelectThread }: ThreadListProps) {
    const { data: sessionData } = useSessionWithRolesQuery()
    const userId = (sessionData?.session as any)?.user?.id

    const { data: threads, isLoading } = useThreadsQuery(userId)
    const [searchQuery, setSearchQuery] = useState("")

    const filteredThreads = threads?.filter((thread) => {
        const participantName = thread.participants?.[0]?.name?.toLowerCase() || ""
        return participantName.includes(searchQuery.toLowerCase())
    })

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 p-4">
                <div className="h-10 w-full animate-pulse rounded-md bg-muted" />
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3">
                            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col border-r">
            <div className="p-4 border-b">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search messages..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-1 p-2">
                    {filteredThreads?.length === 0 && (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            No conversations found.
                        </div>
                    )}
                    {filteredThreads?.map((thread) => {
                        const participant = thread.participants?.[0]
                        if (!participant) return null

                        return (
                            <button
                                key={thread.id}
                                onClick={() => onSelectThread(thread.id)}
                                className={cn(
                                    "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                                    selectedThreadId === thread.id && "bg-muted"
                                )}
                            >
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={participant.image || ""} alt={participant.name || ""} />
                                            <AvatarFallback>{participant.name?.charAt(0) || "U"}</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <div className="font-semibold">{participant.name}</div>
                                            <div className="line-clamp-1 text-xs text-muted-foreground">
                                                {thread.lastMessage?.content || "No messages yet"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {thread.lastMessageAt && (
                                            <span className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(thread.lastMessageAt), {
                                                    addSuffix: true,
                                                })}
                                            </span>
                                        )}
                                        {thread.unreadCount ? (
                                            <Badge variant="default" className="h-5 w-5 rounded-full px-0 flex items-center justify-center">
                                                {thread.unreadCount}
                                            </Badge>
                                        ) : null}

                                    </div>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </ScrollArea>
        </div>
    )
}
