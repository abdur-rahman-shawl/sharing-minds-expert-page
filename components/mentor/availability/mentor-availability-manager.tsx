'use client'

import { useState, useEffect, useCallback } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Loader2,
    Save,
    RotateCcw,
    CalendarClock,
    Settings,
    CalendarOff,
    LayoutTemplate,
    AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { WeeklyScheduleEditor } from './weekly-schedule-editor'
import { AvailabilitySettings } from './availability-settings'
import { AvailabilityExceptions } from './availability-exceptions'
import { AvailabilityTemplates } from './availability-templates'

// ── Types ──

export interface TimeBlock {
    startTime: string
    endTime: string
    type: 'AVAILABLE' | 'BREAK' | 'BUFFER' | 'BLOCKED'
    maxBookings?: number
}

export interface WeeklyPattern {
    dayOfWeek: number
    isEnabled: boolean
    timeBlocks: TimeBlock[]
}

export interface AvailabilitySchedule {
    timezone: string
    defaultSessionDuration: number
    bufferTimeBetweenSessions: number
    minAdvanceBookingHours: number
    maxAdvanceBookingDays: number
    defaultStartTime?: string
    defaultEndTime?: string
    isActive: boolean
    allowInstantBooking: boolean
    requireConfirmation: boolean
    weeklyPatterns: WeeklyPattern[]
}

const DEFAULT_SCHEDULE: AvailabilitySchedule = {
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    defaultSessionDuration: 60,
    bufferTimeBetweenSessions: 15,
    minAdvanceBookingHours: 24,
    maxAdvanceBookingDays: 90,
    defaultStartTime: '09:00:00',
    defaultEndTime: '17:00:00',
    isActive: true,
    allowInstantBooking: true,
    requireConfirmation: false,
    weeklyPatterns: [0, 1, 2, 3, 4, 5, 6].map((day) => ({
        dayOfWeek: day,
        isEnabled: day >= 1 && day <= 5,
        timeBlocks:
            day >= 1 && day <= 5
                ? [
                    { startTime: '09:00', endTime: '12:00', type: 'AVAILABLE' as const, maxBookings: 1 },
                    { startTime: '12:00', endTime: '13:00', type: 'BREAK' as const },
                    { startTime: '13:00', endTime: '17:00', type: 'AVAILABLE' as const, maxBookings: 1 },
                ]
                : [],
    })),
}

// ── Props ──

interface MentorAvailabilityManagerProps {
    mentorId: string
}

// ── Component ──

export function MentorAvailabilityManager({ mentorId }: MentorAvailabilityManagerProps) {
    const [schedule, setSchedule] = useState<AvailabilitySchedule>(DEFAULT_SCHEDULE)
    const [originalSchedule, setOriginalSchedule] = useState<AvailabilitySchedule>(DEFAULT_SCHEDULE)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isNewSchedule, setIsNewSchedule] = useState(true)
    const [activeTab, setActiveTab] = useState('schedule')

    // Deep compare for change detection
    const hasChanges = JSON.stringify(schedule) !== JSON.stringify(originalSchedule)

    // ── Fetch ──

    const fetchSchedule = useCallback(async () => {
        try {
            setIsLoading(true)
            const res = await fetch(`/api/mentors/${mentorId}/availability`)
            const data = await res.json()

            if (data.success && data.schedule) {
                // Merge weekly patterns into schedule state
                const mergedSchedule: AvailabilitySchedule = {
                    timezone: data.schedule.timezone,
                    defaultSessionDuration: data.schedule.defaultSessionDuration,
                    bufferTimeBetweenSessions: data.schedule.bufferTimeBetweenSessions,
                    minAdvanceBookingHours: data.schedule.minAdvanceBookingHours,
                    maxAdvanceBookingDays: data.schedule.maxAdvanceBookingDays,
                    defaultStartTime: data.schedule.defaultStartTime,
                    defaultEndTime: data.schedule.defaultEndTime,
                    isActive: data.schedule.isActive,
                    allowInstantBooking: data.schedule.allowInstantBooking,
                    requireConfirmation: data.schedule.requireConfirmation,
                    weeklyPatterns: [0, 1, 2, 3, 4, 5, 6].map((day) => {
                        const pattern = data.weeklyPatterns.find(
                            (p: { dayOfWeek: number }) => p.dayOfWeek === day
                        )
                        if (pattern) {
                            const timeBlocks =
                                typeof pattern.timeBlocks === 'string'
                                    ? JSON.parse(pattern.timeBlocks)
                                    : pattern.timeBlocks
                            return {
                                dayOfWeek: day,
                                isEnabled: pattern.isEnabled,
                                timeBlocks: timeBlocks || [],
                            }
                        }
                        return { dayOfWeek: day, isEnabled: false, timeBlocks: [] }
                    }),
                }

                setSchedule(mergedSchedule)
                setOriginalSchedule(mergedSchedule)
                setIsNewSchedule(false)
            } else {
                // No schedule yet — use defaults
                setSchedule(DEFAULT_SCHEDULE)
                setOriginalSchedule(DEFAULT_SCHEDULE)
                setIsNewSchedule(true)
            }
        } catch (error) {
            console.error('Failed to fetch availability:', error)
            toast.error('Failed to load availability settings')
        } finally {
            setIsLoading(false)
        }
    }, [mentorId])

    useEffect(() => {
        fetchSchedule()
    }, [fetchSchedule])

    // ── Save ──

    const handleSave = async () => {
        try {
            setIsSaving(true)
            const method = isNewSchedule ? 'POST' : 'PUT'
            const res = await fetch(`/api/mentors/${mentorId}/availability`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(schedule),
            })

            const data = await res.json()

            if (data.success) {
                toast.success(
                    isNewSchedule
                        ? 'Availability schedule created successfully!'
                        : 'Availability updated successfully!'
                )
                setOriginalSchedule(schedule)
                setIsNewSchedule(false)
            } else {
                toast.error(data.error || 'Failed to save availability')
            }
        } catch (error) {
            console.error('Failed to save availability:', error)
            toast.error('Failed to save availability')
        } finally {
            setIsSaving(false)
        }
    }

    // ── Reset ──

    const handleReset = () => {
        setSchedule(originalSchedule)
        toast.info('Changes reverted')
    }

    // ── Update callbacks ──

    const updateSchedule = (updates: Partial<AvailabilitySchedule>) => {
        setSchedule((prev) => ({ ...prev, ...updates }))
    }

    const updateWeeklyPattern = (dayOfWeek: number, patternUpdate: Partial<WeeklyPattern>) => {
        setSchedule((prev) => ({
            ...prev,
            weeklyPatterns: prev.weeklyPatterns.map((p) =>
                p.dayOfWeek === dayOfWeek ? { ...p, ...patternUpdate } : p
            ),
        }))
    }

    const handleApplyTemplate = (templateConfig: AvailabilitySchedule) => {
        setSchedule(templateConfig)
        toast.success('Template applied! Click "Save Changes" to persist.')
    }

    // ── Loading state ──

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto" />
                    <p className="text-sm text-gray-500 dark:text-slate-400">Loading availability...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-100 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700/50 p-1 rounded-xl">
                    <TabsTrigger
                        value="schedule"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-sm"
                    >
                        <CalendarClock className="h-4 w-4 mr-2" />
                        Schedule
                    </TabsTrigger>
                    <TabsTrigger
                        value="settings"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-sm"
                    >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                    </TabsTrigger>
                    <TabsTrigger
                        value="exceptions"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-sm"
                    >
                        <CalendarOff className="h-4 w-4 mr-2" />
                        Exceptions
                    </TabsTrigger>
                    <TabsTrigger
                        value="templates"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-sm rounded-lg px-4 py-2 text-sm"
                    >
                        <LayoutTemplate className="h-4 w-4 mr-2" />
                        Templates
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="schedule" className="mt-6">
                    <WeeklyScheduleEditor
                        weeklyPatterns={schedule.weeklyPatterns}
                        onPatternChange={updateWeeklyPattern}
                        timezone={schedule.timezone}
                    />
                </TabsContent>

                <TabsContent value="settings" className="mt-6">
                    <AvailabilitySettings schedule={schedule} onUpdate={updateSchedule} />
                </TabsContent>

                <TabsContent value="exceptions" className="mt-6">
                    <AvailabilityExceptions mentorId={mentorId} />
                </TabsContent>

                <TabsContent value="templates" className="mt-6">
                    <AvailabilityTemplates
                        currentSchedule={schedule}
                        onApplyTemplate={handleApplyTemplate}
                    />
                </TabsContent>
            </Tabs>

            {/* Sticky save / reset footer */}
            {hasChanges && (
                <div className="sticky bottom-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-gray-200 dark:border-slate-700 -mx-6 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-4 w-4" />
                        <span>You have unsaved changes</span>
                        {isNewSchedule && (
                            <Badge variant="outline" className="text-xs border-indigo-300 dark:border-indigo-600 text-indigo-600 dark:text-indigo-400">
                                New Schedule
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleReset}
                            disabled={isSaving}
                            className="border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
