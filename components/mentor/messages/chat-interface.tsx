
"use client"

import { format } from "date-fns"
import { Send } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Message, Thread, useMessagesQuery, useSendMessageMutation } from "@/hooks/queries/use-messaging-queries"
import { useSessionWithRolesQuery } from "@/hooks/queries/use-session-query"
import { cn } from "@/lib/utils"

interface ChatInterfaceProps {
    threadId: string | null
    thread: Thread | undefined
}

export function ChatInterface({ threadId, thread }: ChatInterfaceProps) {
    const { data: sessionData } = useSessionWithRolesQuery()
    const userId = (sessionData?.session as any)?.user?.id

    const { data: messages, isLoading } = useMessagesQuery(threadId || "", userId)
    const { mutate: sendMessage, isPending: isSending } = useSendMessageMutation()

    const [newMessage, setNewMessage] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!permissionToChat) return
        if (!newMessage.trim() || !threadId) return

        sendMessage(
            { threadId, content: newMessage },
            {
                onSuccess: () => {
                    setNewMessage("")
                },
            }
        )
    }

    if (!threadId || !thread) {
        return (
            <div className="flex flex-1 items-center justify-center p-4 text-center text-muted-foreground">
                Select a conversation to start messaging
            </div>
        )
    }

    const otherParticipant = thread.participants?.[0]

    // Basic permission check (can be enhanced)
    const permissionToChat = true;

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 border-b p-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={otherParticipant?.image || ""} alt={otherParticipant?.name || ""} />
                    <AvatarFallback>{otherParticipant?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-semibold">{otherParticipant?.name}</div>
                    <div className="text-xs text-muted-foreground">{otherParticipant?.email}</div>
                </div>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col gap-4">
                    {isLoading && (
                        <div className="flex items-center justify-center py-4">
                            <span className="text-sm text-muted-foreground">Loading messages...</span>
                        </div>
                    )}
                    {messages?.map((message) => {
                        const isMe = message.senderId === userId
                        return (
                            <div
                                key={message.id}
                                className={cn(
                                    "flex max-w-[80%] flex-col gap-1 rounded-lg p-3 text-sm",
                                    isMe
                                        ? "ml-auto bg-primary text-primary-foreground"
                                        : "bg-muted"
                                )}
                            >
                                <div>{message.content}</div>
                                <div
                                    className={cn(
                                        "text-[10px]",
                                        isMe ? "text-primary-foreground/70" : "text-muted-foreground"
                                    )}
                                >
                                    {format(new Date(message.createdAt), "h:mm a")}
                                </div>
                            </div>
                        )
                    })}
                    <div ref={scrollRef} />
                </div>
            </ScrollArea>

            <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={!permissionToChat || isSending}
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!permissionToChat || isSending || !newMessage.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}
