"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area
} from "recharts";
import { useMentorDashboardStats } from "@/hooks/use-mentor-dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Users, Clock, DollarSign, Star } from "lucide-react";

export function MentorAnalyticsSection() {
    const { stats, isLoading } = useMentorDashboardStats();

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-[300px] w-full" />
            </div>
        );
    }

    // Mock data for charts - in a real app this would come from an analytics API endpoint
    const earningsData = [
        { name: 'Jan', earnings: 1200 },
        { name: 'Feb', earnings: 1900 },
        { name: 'Mar', earnings: 1500 },
        { name: 'Apr', earnings: 2200 },
        { name: 'May', earnings: 2800 },
        { name: 'Jun', earnings: stats?.monthlyEarnings || 2400 },
    ];

    const sessionsData = [
        { name: 'Mon', sessions: 2 },
        { name: 'Tue', sessions: 4 },
        { name: 'Wed', sessions: 1 },
        { name: 'Thu', sessions: 3 },
        { name: 'Fri', sessions: 5 },
        { name: 'Sat', sessions: 2 },
        { name: 'Sun', sessions: 0 },
    ];

    const engagementData = [
        { name: 'Week 1', views: 45, clicks: 12 },
        { name: 'Week 2', views: 52, clicks: 15 },
        { name: 'Week 3', views: 48, clicks: 18 },
        { name: 'Week 4', views: 61, clicks: 24 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Analytics & Insights</h2>
                <p className="text-muted-foreground">Detailed overview of your mentoring performance</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="earnings">Earnings</TabsTrigger>
                    <TabsTrigger value="engagement">Engagement</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Total Sessions</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.completedSessions || 0}</div>
                                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Active Students</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.activeMentees || 0}</div>
                                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Profile Views</CardTitle>
                                <Info className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">1,234</div>
                                <p className="text-xs text-muted-foreground">+19% from last month</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-xs font-medium text-muted-foreground">Avg. Rating</CardTitle>
                                <Star className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats?.averageRating?.toFixed(1) || 'N/A'}</div>
                                <p className="text-xs text-muted-foreground">+2% from last month</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Earnings Overview</CardTitle>
                                <CardDescription>Monthly earnings over the last 6 months</CardDescription>
                            </CardHeader>
                            <CardContent className="pl-2">
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={earningsData}>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                            itemStyle={{ color: 'var(--foreground)' }}
                                            formatter={(value: number) => [`$${value}`, "Earnings"]}
                                        />
                                        <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Session Activity</CardTitle>
                                <CardDescription>Sessions conducted this week</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={350}>
                                    <LineChart data={sessionsData}>
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                            itemStyle={{ color: 'var(--foreground)' }}
                                        />
                                        <Line type="monotone" dataKey="sessions" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="earnings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue Analytics</CardTitle>
                            <CardDescription>Deep dive into your earnings sources</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px] w-full flex items-center justify-center text-muted-foreground">
                                Detailed earnings analytics coming soon...
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="engagement">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Engagement</CardTitle>
                            <CardDescription>Views and interactions with your profile</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={350}>
                                <AreaChart data={engagementData}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="views" stroke="#8884d8" fillOpacity={1} fill="url(#colorViews)" />
                                    <Area type="monotone" dataKey="clicks" stroke="#82ca9d" fillOpacity={1} fill="url(#colorClicks)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
