
"use client"

import { useState } from "react"
import { ThreadList } from "./thread-list"
import { ChatInterface } from "./chat-interface"
import { useThreadsQuery } from "@/hooks/queries/use-messaging-queries"
import { useSessionWithRolesQuery } from "@/hooks/queries/use-session-query"

export function MessagesView() {
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
    const { data: sessionData } = useSessionWithRolesQuery()
    const userId = (sessionData?.session as any)?.user?.id // Simplified access

    const { data: threads } = useThreadsQuery(userId)

    const selectedThread = threads?.find((t) => t.id === selectedThreadId)

    return (
        <div className="flex flex-col h-full rounded-lg border bg-background shadow-sm md:flex-row overflow-hidden" style={{ height: "calc(100vh - 12rem)" }}>
            {/* Sidebar List */}
            <div className={`w-full md:w-80 flex-shrink-0 bg-muted/10 ${selectedThreadId ? 'hidden md:flex' : 'flex'}`}>
                <ThreadList
                    selectedThreadId={selectedThreadId}
                    onSelectThread={setSelectedThreadId}
                />
            </div>

            {/* Main Chat Area */}
            <div className={`flex-1 flex flex-col ${!selectedThreadId ? 'hidden md:flex' : 'flex'}`}>
                {/* Mobile Back Button (Could be added here if needed, but for now simple toggle) */}
                {selectedThreadId && (
                    <div className="md:hidden border-b p-2">
                        <button onClick={() => setSelectedThreadId(null)} className="text-sm text-primary hover:underline">
                            &larr; Back to messages
                        </button>
                    </div>
                )}
                <ChatInterface threadId={selectedThreadId} thread={selectedThread} />
            </div>
        </div>
    )
}
