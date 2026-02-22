'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Globe,
    Clock,
    CalendarRange,
    Zap,
    ShieldCheck,
    Timer,
    Info,
} from 'lucide-react'
import type { AvailabilitySchedule } from './mentor-availability-manager'

// ── Timezone list ──

const TIMEZONES = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
]

const SESSION_DURATIONS = [
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '1 hour' },
    { value: '90', label: '1.5 hours' },
    { value: '120', label: '2 hours' },
    { value: '180', label: '3 hours' },
    { value: '240', label: '4 hours' },
]

const BUFFER_TIMES = [
    { value: '0', label: 'No buffer' },
    { value: '5', label: '5 minutes' },
    { value: '10', label: '10 minutes' },
    { value: '15', label: '15 minutes' },
    { value: '30', label: '30 minutes' },
    { value: '45', label: '45 minutes' },
    { value: '60', label: '60 minutes' },
]

// ── Props ──

interface AvailabilitySettingsProps {
    schedule: AvailabilitySchedule
    onUpdate: (updates: Partial<AvailabilitySchedule>) => void
}

// ── Component ──

export function AvailabilitySettings({ schedule, onUpdate }: AvailabilitySettingsProps) {
    return (
        <div className="space-y-6">
            {/* Timezone */}
            <Card className="bg-white dark:bg-slate-900/60 border-gray-200 dark:border-slate-800">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-indigo-500" />
                        <CardTitle className="text-base text-gray-900 dark:text-white">Time Zone</CardTitle>
                    </div>
                    <CardDescription className="text-gray-500 dark:text-slate-400">
                        All times in your schedule will be displayed in this timezone
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Select
                        value={schedule.timezone}
                        onValueChange={(value) => onUpdate({ timezone: value })}
                    >
                        <SelectTrigger className="w-full max-w-md bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white">
                            <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                            {TIMEZONES.map((tz) => (
                                <SelectItem key={tz.value} value={tz.value} className="text-gray-900 dark:text-white">
                                    {tz.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>

            {/* Session Configuration */}
            <Card className="bg-white dark:bg-slate-900/60 border-gray-200 dark:border-slate-800">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-emerald-500" />
                        <CardTitle className="text-base text-gray-900 dark:text-white">Session Configuration</CardTitle>
                    </div>
                    <CardDescription className="text-gray-500 dark:text-slate-400">
                        Configure session length and buffer time between sessions
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-sm text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                                <Timer className="h-3.5 w-3.5" />
                                Session Duration
                            </Label>
                            <Select
                                value={schedule.defaultSessionDuration.toString()}
                                onValueChange={(value) =>
                                    onUpdate({ defaultSessionDuration: parseInt(value, 10) })
                                }
                            >
                                <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                                    {SESSION_DURATIONS.map((d) => (
                                        <SelectItem key={d.value} value={d.value} className="text-gray-900 dark:text-white">
                                            {d.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                Buffer Between Sessions
                            </Label>
                            <Select
                                value={schedule.bufferTimeBetweenSessions.toString()}
                                onValueChange={(value) =>
                                    onUpdate({ bufferTimeBetweenSessions: parseInt(value, 10) })
                                }
                            >
                                <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                                    {BUFFER_TIMES.map((b) => (
                                        <SelectItem key={b.value} value={b.value} className="text-gray-900 dark:text-white">
                                            {b.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Booking Window */}
            <Card className="bg-white dark:bg-slate-900/60 border-gray-200 dark:border-slate-800">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <CalendarRange className="h-5 w-5 text-purple-500" />
                        <CardTitle className="text-base text-gray-900 dark:text-white">Booking Window</CardTitle>
                    </div>
                    <CardDescription className="text-gray-500 dark:text-slate-400">
                        Control how far in advance mentees can book sessions
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-sm text-gray-700 dark:text-slate-300">
                                Minimum advance notice (hours)
                            </Label>
                            <Input
                                type="number"
                                min={0}
                                max={168}
                                value={schedule.minAdvanceBookingHours}
                                onChange={(e) =>
                                    onUpdate({ minAdvanceBookingHours: parseInt(e.target.value, 10) || 0 })
                                }
                                className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                            />
                            <p className="text-xs text-gray-400 dark:text-slate-500">
                                0 = no minimum, 168 = 1 week ahead
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm text-gray-700 dark:text-slate-300">
                                Maximum advance booking (days)
                            </Label>
                            <Input
                                type="number"
                                min={1}
                                max={365}
                                value={schedule.maxAdvanceBookingDays}
                                onChange={(e) =>
                                    onUpdate({ maxAdvanceBookingDays: parseInt(e.target.value, 10) || 1 })
                                }
                                className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                            />
                            <p className="text-xs text-gray-400 dark:text-slate-500">
                                1 = tomorrow only, 365 = up to 1 year
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Booking Preferences */}
            <Card className="bg-white dark:bg-slate-900/60 border-gray-200 dark:border-slate-800">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-500" />
                        <CardTitle className="text-base text-gray-900 dark:text-white">Booking Preferences</CardTitle>
                    </div>
                    <CardDescription className="text-gray-500 dark:text-slate-400">
                        Control how mentees can book sessions with you
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                                <Zap className="h-3.5 w-3.5 text-amber-500" />
                                Allow Instant Booking
                            </Label>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                                Mentees can book without waiting for your approval
                            </p>
                        </div>
                        <Switch
                            checked={schedule.allowInstantBooking}
                            onCheckedChange={(checked) => onUpdate({ allowInstantBooking: checked })}
                        />
                    </div>

                    <Separator className="bg-gray-200 dark:bg-slate-700" />

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5">
                                <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                                Require Confirmation
                            </Label>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                                You must manually approve each booking request
                            </p>
                        </div>
                        <Switch
                            checked={schedule.requireConfirmation}
                            onCheckedChange={(checked) => onUpdate({ requireConfirmation: checked })}
                        />
                    </div>

                    {schedule.requireConfirmation && (
                        <Alert className="bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30">
                            <Info className="h-4 w-4 text-blue-500" />
                            <AlertDescription className="text-blue-700 dark:text-blue-300 text-xs">
                                When confirmation is required, mentees will see their booking as &quot;Pending&quot; until you approve it. You&apos;ll receive a notification for each request.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Default Business Hours */}
            <Card className="bg-white dark:bg-slate-900/60 border-gray-200 dark:border-slate-800">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-cyan-500" />
                        <CardTitle className="text-base text-gray-900 dark:text-white">Default Business Hours</CardTitle>
                    </div>
                    <CardDescription className="text-gray-500 dark:text-slate-400">
                        Default start and end times used when resetting your schedule
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label className="text-sm text-gray-700 dark:text-slate-300">Default Start Time</Label>
                            <Input
                                type="time"
                                value={schedule.defaultStartTime?.slice(0, 5) || '09:00'}
                                onChange={(e) => onUpdate({ defaultStartTime: e.target.value + ':00' })}
                                className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm text-gray-700 dark:text-slate-300">Default End Time</Label>
                            <Input
                                type="time"
                                value={schedule.defaultEndTime?.slice(0, 5) || '17:00'}
                                onChange={(e) => onUpdate({ defaultEndTime: e.target.value + ':00' })}
                                className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
