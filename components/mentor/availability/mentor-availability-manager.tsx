"use client"

import { useState, useEffect } from 'react';
import { useSessionWithRolesQuery } from '@/hooks/queries/use-session-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeeklyScheduleEditor } from './weekly-schedule-editor';
import { AvailabilitySettings } from './availability-settings';
import { AvailabilityExceptions } from './availability-exceptions';
import { AvailabilityTemplates } from './availability-templates';
import { toast } from 'sonner';
import {
    Calendar,
    Settings,
    CalendarOff,
    LayoutTemplate,
    RotateCcw,
    Save
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// Types
interface TimeBlock {
    startTime: string;
    endTime: string;
    type: 'AVAILABLE' | 'BREAK' | 'BUFFER' | 'BLOCKED';
    maxBookings?: number;
}

interface WeeklyPattern {
    dayOfWeek: number;
    isEnabled: boolean;
    timeBlocks: TimeBlock[];
}

interface AvailabilitySchedule {
    timezone: string;
    defaultSessionDuration: number;
    bufferTimeBetweenSessions: number;
    minAdvanceBookingHours: number;
    maxAdvanceBookingDays: number;
    defaultStartTime?: string;
    defaultEndTime?: string;
    isActive: boolean;
    allowInstantBooking: boolean;
    requireConfirmation: boolean;
    weeklyPatterns: WeeklyPattern[];
}

const DEFAULT_SCHEDULE: AvailabilitySchedule = {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    defaultSessionDuration: 60,
    bufferTimeBetweenSessions: 15,
    minAdvanceBookingHours: 24,
    maxAdvanceBookingDays: 30,
    defaultStartTime: '09:00:00',
    defaultEndTime: '17:00:00',
    isActive: true,
    allowInstantBooking: true,
    requireConfirmation: false,
    weeklyPatterns: [
        { dayOfWeek: 0, isEnabled: false, timeBlocks: [] }, // Sunday
        {
            dayOfWeek: 1,
            isEnabled: true,
            timeBlocks: [
                { startTime: '09:00', endTime: '17:00', type: 'AVAILABLE', maxBookings: 1 }
            ]
        }, // Monday
        {
            dayOfWeek: 2,
            isEnabled: true,
            timeBlocks: [
                { startTime: '09:00', endTime: '17:00', type: 'AVAILABLE', maxBookings: 1 }
            ]
        }, // Tuesday
        {
            dayOfWeek: 3,
            isEnabled: true,
            timeBlocks: [
                { startTime: '09:00', endTime: '17:00', type: 'AVAILABLE', maxBookings: 1 }
            ]
        }, // Wednesday
        {
            dayOfWeek: 4,
            isEnabled: true,
            timeBlocks: [
                { startTime: '09:00', endTime: '17:00', type: 'AVAILABLE', maxBookings: 1 }
            ]
        }, // Thursday
        {
            dayOfWeek: 5,
            isEnabled: true,
            timeBlocks: [
                { startTime: '09:00', endTime: '17:00', type: 'AVAILABLE', maxBookings: 1 }
            ]
        }, // Friday
        { dayOfWeek: 6, isEnabled: false, timeBlocks: [] }, // Saturday
    ]
};

export function MentorAvailabilityManager() {
    const { data: sessionData } = useSessionWithRolesQuery();
    const session = sessionData?.session as any;
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [schedule, setSchedule] = useState<AvailabilitySchedule>(DEFAULT_SCHEDULE);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Fetch availability on mount
    useEffect(() => {
        const fetchAvailability = async () => {
            if (!session?.user?.id) return;

            try {
                const response = await fetch(`/api/mentors/${session.user.id}/availability`);
                if (response.ok) {
                    const data = await response.json();
                    if (data) {
                        // Ensure data structure matches our interface
                        setSchedule({
                            ...DEFAULT_SCHEDULE,
                            ...data,
                            weeklyPatterns: data.weeklyPatterns || DEFAULT_SCHEDULE.weeklyPatterns
                        });
                    }
                }
            } catch (error) {
                console.error('Failed to fetch availability:', error);
                toast.error('Failed to load availability settings');
            } finally {
                setLoading(false);
            }
        };

        fetchAvailability();
    }, [session?.user?.id]);

    // Handle pattern changes from WeeklyScheduleEditor
    const handlePatternChange = (dayOfWeek: number, patternUpdate: Partial<WeeklyPattern>) => {
        setSchedule(prev => {
            const newPatterns = prev.weeklyPatterns.map(p => {
                if (p.dayOfWeek === dayOfWeek) {
                    return { ...p, ...patternUpdate };
                }
                return p;
            });
            return { ...prev, weeklyPatterns: newPatterns };
        });
        setHasUnsavedChanges(true);
    };

    // Handle settings updates
    const handleSettingsUpdate = (updates: Partial<AvailabilitySchedule>) => {
        setSchedule(prev => ({ ...prev, ...updates }));
        setHasUnsavedChanges(true);
    };

    // Handle template application
    const handleApplyTemplate = (template: any) => {
        setSchedule(prev => ({
            ...prev,
            ...template.configuration,
            // Keep existing timezone if not specified in template
            timezone: template.configuration.timezone || prev.timezone
        }));
        setHasUnsavedChanges(true);
        toast.success(`Applied template: ${template.name}`);
    };

    // Trigger save via API
    const saveChanges = async () => {
        if (!session?.user?.id) return;

        setSaving(true);
        try {
            const response = await fetch(`/api/mentors/${session.user.id}/availability`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(schedule),
            });

            if (response.ok) {
                toast.success('Availability settings saved');
                setHasUnsavedChanges(false);
            } else {
                throw new Error('Failed to save settings');
            }
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save availability settings');
        } finally {
            setSaving(false);
        }
    };

    // Reset to original (re-fetch)
    const resetChanges = () => {
        // This could just re-trigger the fetch effect by incrementing a key or separate refetch function
        // For simplicity, we'll reload the page or we could extract fetch logic
        window.location.reload();
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-8 flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Availability Management</h2>
                    <p className="text-muted-foreground">
                        Configure when you're available for mentorship sessions
                    </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    {hasUnsavedChanges && (
                        <Button variant="ghost" onClick={resetChanges} disabled={saving}>
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Reset
                        </Button>
                    )}
                    <Button onClick={saveChanges} disabled={saving || !hasUnsavedChanges}>
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? 'Saving...' : hasUnsavedChanges ? 'Save Changes' : 'Saved'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="schedule" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
                    <TabsTrigger value="schedule" className="gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="hidden sm:inline">Weekly Schedule</span>
                        <span className="sm:hidden">Schedule</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="gap-2">
                        <Settings className="h-4 w-4" />
                        <span className="hidden sm:inline">Booking Settings</span>
                        <span className="sm:hidden">Settings</span>
                    </TabsTrigger>
                    <TabsTrigger value="exceptions" className="gap-2">
                        <CalendarOff className="h-4 w-4" />
                        <span className="hidden sm:inline">Date Exceptions</span>
                        <span className="sm:hidden">Exceptions</span>
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="gap-2">
                        <LayoutTemplate className="h-4 w-4" />
                        <span className="hidden sm:inline">Templates</span>
                        <span className="sm:hidden">Templates</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="schedule" className="space-y-4">
                    <WeeklyScheduleEditor
                        weeklyPatterns={schedule.weeklyPatterns}
                        onPatternChange={handlePatternChange}
                        timezone={schedule.timezone}
                    />
                </TabsContent>

                <TabsContent value="settings">
                    <AvailabilitySettings
                        schedule={schedule}
                        onUpdate={handleSettingsUpdate}
                    />
                </TabsContent>

                <TabsContent value="exceptions">
                    <AvailabilityExceptions mentorId={session?.user?.id} />
                </TabsContent>

                <TabsContent value="templates">
                    <AvailabilityTemplates
                        currentSchedule={schedule}
                        onApplyTemplate={handleApplyTemplate}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
