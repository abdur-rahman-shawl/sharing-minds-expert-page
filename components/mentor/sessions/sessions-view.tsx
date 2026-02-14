
"use client"

import { useState } from "react"
import { Calendar, Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useMentorSessionsQuery } from "@/hooks/queries/use-mentor-sessions-query"
import { SessionCard } from "./session-card"
import { Skeleton } from "@/components/ui/skeleton"

export function SessionsView() {
    const [activeTab, setActiveTab] = useState("upcoming")
    const [searchQuery, setSearchQuery] = useState("")

    // In a real app, pass status based on activeTab
    // For 'upcoming', we might filter by date in the backend or frontend
    const { data: sessions, isLoading } = useMentorSessionsQuery()

    const filteredSessions = sessions?.filter((session) => {
        // Basic search
        const matchesSearch =
            session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.mentee?.name?.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filtering logic
        if (activeTab === "all") return matchesSearch;

        if (activeTab === "upcoming") {
            return matchesSearch && session.status === 'scheduled' && new Date(session.scheduledAt) > new Date();
        }
        if (activeTab === "past") {
            return matchesSearch && (session.status === 'completed' || (new Date(session.scheduledAt) < new Date() && session.status !== 'cancelled'));
        }
        if (activeTab === "cancelled") {
            return matchesSearch && session.status === 'cancelled';
        }

        return matchesSearch;
    })

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Sessions</h2>
                    <p className="text-muted-foreground">
                        Manage your scheduled meetings and history.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button>
                        Sync Calendar (Coming Soon)
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                    <TabsList>
                        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                        <TabsTrigger value="past">Past</TabsTrigger>
                        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                        <TabsTrigger value="all">All Sessions</TabsTrigger>
                    </TabsList>
                </Tabs>

                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search sessions..."
                            className="w-full pl-8 md:w-[200px] lg:w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col space-y-3">
                            <Skeleton className="h-[125px] w-full rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredSessions?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-lg bg-muted/20">
                    <Calendar className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No sessions found</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-2">
                        {activeTab === "upcoming"
                            ? "You don't have any upcoming sessions scheduled."
                            : "No sessions match your current filters."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredSessions?.map((session) => (
                        <SessionCard key={session.id} session={session} />
                    ))}
                </div>
            )}
        </div>
    )
}
