'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Check,
    Coffee,
    Clock,
    AlertCircle,
    Plus,
    Trash2,
    Copy,
    RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'
import type { WeeklyPattern, TimeBlock } from './mentor-availability-manager'
import { validateTimeBlock, mergeAndSortTimeBlocks } from '@/lib/utils/availability-validation'

// ── Constants ──

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const BLOCK_TYPE_CONFIG = {
    AVAILABLE: {
        label: 'Available',
        icon: Check,
        bgColor: 'bg-green-50 dark:bg-green-500/10',
        borderColor: 'border-green-200 dark:border-green-500/30',
        textColor: 'text-green-700 dark:text-green-400',
        badgeColor: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
    },
    BREAK: {
        label: 'Break',
        icon: Coffee,
        bgColor: 'bg-amber-50 dark:bg-amber-500/10',
        borderColor: 'border-amber-200 dark:border-amber-500/30',
        textColor: 'text-amber-700 dark:text-amber-400',
        badgeColor: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
    },
    BUFFER: {
        label: 'Buffer',
        icon: Clock,
        bgColor: 'bg-blue-50 dark:bg-blue-500/10',
        borderColor: 'border-blue-200 dark:border-blue-500/30',
        textColor: 'text-blue-700 dark:text-blue-400',
        badgeColor: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
    },
    BLOCKED: {
        label: 'Blocked',
        icon: AlertCircle,
        bgColor: 'bg-red-50 dark:bg-red-500/10',
        borderColor: 'border-red-200 dark:border-red-500/30',
        textColor: 'text-red-700 dark:text-red-400',
        badgeColor: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
    },
}

// ── Props ──

interface WeeklyScheduleEditorProps {
    weeklyPatterns: WeeklyPattern[]
    onPatternChange: (dayOfWeek: number, pattern: Partial<WeeklyPattern>) => void
    timezone: string
}

// ── Component ──

export function WeeklyScheduleEditor({
    weeklyPatterns,
    onPatternChange,
    timezone,
}: WeeklyScheduleEditorProps) {
    const [editDialog, setEditDialog] = useState<{
        open: boolean
        dayOfWeek: number
        blockIndex: number | null // null = new block
        block: TimeBlock
    }>({
        open: false,
        dayOfWeek: 0,
        blockIndex: null,
        block: { startTime: '09:00', endTime: '10:00', type: 'AVAILABLE', maxBookings: 1 },
    })

    const [validationErrors, setValidationErrors] = useState<string[]>([])

    // ── Quick actions ──

    const resetWeekdays = () => {
        for (let day = 1; day <= 5; day++) {
            onPatternChange(day, {
                isEnabled: true,
                timeBlocks: [
                    { startTime: '09:00', endTime: '12:00', type: 'AVAILABLE', maxBookings: 1 },
                    { startTime: '12:00', endTime: '13:00', type: 'BREAK' },
                    { startTime: '13:00', endTime: '17:00', type: 'AVAILABLE', maxBookings: 1 },
                ],
            })
        }
        toast.success('Weekdays reset to 9 AM – 5 PM')
    }

    const resetWeekends = () => {
        onPatternChange(0, { isEnabled: false, timeBlocks: [] })
        onPatternChange(6, { isEnabled: false, timeBlocks: [] })
        toast.success('Weekends cleared')
    }

    const resetAll = () => {
        for (let day = 0; day <= 6; day++) {
            onPatternChange(day, {
                isEnabled: day >= 1 && day <= 5,
                timeBlocks:
                    day >= 1 && day <= 5
                        ? [
                            { startTime: '09:00', endTime: '12:00', type: 'AVAILABLE', maxBookings: 1 },
                            { startTime: '12:00', endTime: '13:00', type: 'BREAK' },
                            { startTime: '13:00', endTime: '17:00', type: 'AVAILABLE', maxBookings: 1 },
                        ]
                        : [],
            })
        }
        toast.success('All days reset to defaults')
    }

    const copyToAll = (sourceDayOfWeek: number) => {
        const source = weeklyPatterns.find((p) => p.dayOfWeek === sourceDayOfWeek)
        if (!source) return

        for (let day = 0; day <= 6; day++) {
            if (day !== sourceDayOfWeek) {
                onPatternChange(day, {
                    isEnabled: source.isEnabled,
                    timeBlocks: [...source.timeBlocks],
                })
            }
        }
        toast.success(`Copied ${DAY_NAMES[sourceDayOfWeek]}'s schedule to all days`)
    }

    // ── Block dialog ──

    const openAddBlock = (dayOfWeek: number) => {
        setValidationErrors([])
        setEditDialog({
            open: true,
            dayOfWeek,
            blockIndex: null,
            block: { startTime: '09:00', endTime: '10:00', type: 'AVAILABLE', maxBookings: 1 },
        })
    }

    const openEditBlock = (dayOfWeek: number, blockIndex: number, block: TimeBlock) => {
        setValidationErrors([])
        setEditDialog({
            open: true,
            dayOfWeek,
            blockIndex,
            block: { ...block },
        })
    }

    const saveBlock = () => {
        const pattern = weeklyPatterns.find((p) => p.dayOfWeek === editDialog.dayOfWeek)
        if (!pattern) return

        // Get existing blocks (excluding the one being edited)
        const existingBlocks =
            editDialog.blockIndex !== null
                ? pattern.timeBlocks.filter((_, i) => i !== editDialog.blockIndex)
                : pattern.timeBlocks

        // Validate
        const validation = validateTimeBlock(editDialog.block, existingBlocks)
        if (!validation.isValid) {
            setValidationErrors(validation.errors)
            return
        }

        // Update blocks
        let newBlocks: TimeBlock[]
        if (editDialog.blockIndex !== null) {
            newBlocks = [...pattern.timeBlocks]
            newBlocks[editDialog.blockIndex] = editDialog.block
        } else {
            newBlocks = [...pattern.timeBlocks, editDialog.block]
        }

        // Merge and sort
        const merged = mergeAndSortTimeBlocks(newBlocks)
        onPatternChange(editDialog.dayOfWeek, { timeBlocks: merged })
        setEditDialog((prev) => ({ ...prev, open: false }))
        setValidationErrors([])
    }

    const deleteBlock = (dayOfWeek: number, blockIndex: number) => {
        const pattern = weeklyPatterns.find((p) => p.dayOfWeek === dayOfWeek)
        if (!pattern) return

        const newBlocks = pattern.timeBlocks.filter((_, i) => i !== blockIndex)
        onPatternChange(dayOfWeek, { timeBlocks: newBlocks })
    }

    return (
        <div className="space-y-5">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={resetWeekdays}
                    className="border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs"
                >
                    <RotateCcw className="h-3 w-3 mr-1.5" />
                    Reset Weekdays (9–5)
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={resetWeekends}
                    className="border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs"
                >
                    <RotateCcw className="h-3 w-3 mr-1.5" />
                    Reset Weekends
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={resetAll}
                    className="border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs"
                >
                    <RotateCcw className="h-3 w-3 mr-1.5" />
                    Reset All Days
                </Button>
            </div>

            {/* Timezone info */}
            <p className="text-xs text-gray-400 dark:text-slate-500">
                All times are in <strong className="text-gray-600 dark:text-slate-300">{timezone}</strong>
            </p>

            {/* Day cards */}
            {weeklyPatterns
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                .map((pattern) => {
                    const isWeekend = pattern.dayOfWeek === 0 || pattern.dayOfWeek === 6

                    return (
                        <Card
                            key={pattern.dayOfWeek}
                            className={`bg-white dark:bg-slate-900/60 border-gray-200 dark:border-slate-800 ${!pattern.isEnabled ? 'opacity-60' : ''
                                }`}
                        >
                            <CardHeader className="py-3 px-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Switch
                                            checked={pattern.isEnabled}
                                            onCheckedChange={(checked) =>
                                                onPatternChange(pattern.dayOfWeek, { isEnabled: checked })
                                            }
                                        />
                                        <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                                            {DAY_NAMES[pattern.dayOfWeek]}
                                        </CardTitle>
                                        {isWeekend && (
                                            <Badge
                                                variant="outline"
                                                className="text-[10px] border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500"
                                            >
                                                Weekend
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {pattern.isEnabled && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => copyToAll(pattern.dayOfWeek)}
                                                    className="h-7 text-xs text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-300"
                                                >
                                                    <Copy className="h-3 w-3 mr-1" />
                                                    Copy to all
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openAddBlock(pattern.dayOfWeek)}
                                                    className="h-7 text-xs text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    <Plus className="h-3 w-3 mr-1" />
                                                    Add Block
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            {pattern.isEnabled && pattern.timeBlocks.length > 0 && (
                                <CardContent className="pt-0 pb-3 px-4">
                                    <div className="space-y-2">
                                        {pattern.timeBlocks.map((block, blockIndex) => {
                                            const config = BLOCK_TYPE_CONFIG[block.type]
                                            const Icon = config.icon

                                            return (
                                                <div
                                                    key={blockIndex}
                                                    className={`flex items-center justify-between px-3 py-2 rounded-lg border ${config.bgColor} ${config.borderColor} cursor-pointer hover:ring-1 hover:ring-indigo-300 dark:hover:ring-indigo-600 transition-all`}
                                                    onClick={() => openEditBlock(pattern.dayOfWeek, blockIndex, block)}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <Icon className={`h-3.5 w-3.5 ${config.textColor}`} />
                                                        <span className={`text-sm font-medium ${config.textColor}`}>
                                                            {block.startTime} – {block.endTime}
                                                        </span>
                                                        <Badge
                                                            variant="secondary"
                                                            className={`text-[10px] ${config.badgeColor} border-0`}
                                                        >
                                                            {config.label}
                                                        </Badge>
                                                        {block.maxBookings && block.type === 'AVAILABLE' && (
                                                            <span className="text-[10px] text-gray-400 dark:text-slate-500">
                                                                max {block.maxBookings}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-gray-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            deleteBlock(pattern.dayOfWeek, blockIndex)
                                                        }}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            )}

                            {pattern.isEnabled && pattern.timeBlocks.length === 0 && (
                                <CardContent className="pt-0 pb-3 px-4">
                                    <p className="text-xs text-gray-400 dark:text-slate-500 italic">
                                        No time blocks. Click &quot;Add Block&quot; to add availability.
                                    </p>
                                </CardContent>
                            )}
                        </Card>
                    )
                })}

            {/* Add/Edit Block Dialog */}
            <Dialog open={editDialog.open} onOpenChange={(open) => setEditDialog((prev) => ({ ...prev, open }))}>
                <DialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white">
                            {editDialog.blockIndex !== null ? 'Edit' : 'Add'} Time Block — {DAY_NAMES[editDialog.dayOfWeek]}
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-slate-400">
                            Define a time range and block type
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm text-gray-700 dark:text-slate-300">Start Time</Label>
                                <Input
                                    type="time"
                                    value={editDialog.block.startTime}
                                    onChange={(e) =>
                                        setEditDialog((prev) => ({
                                            ...prev,
                                            block: { ...prev.block, startTime: e.target.value },
                                        }))
                                    }
                                    className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm text-gray-700 dark:text-slate-300">End Time</Label>
                                <Input
                                    type="time"
                                    value={editDialog.block.endTime}
                                    onChange={(e) =>
                                        setEditDialog((prev) => ({
                                            ...prev,
                                            block: { ...prev.block, endTime: e.target.value },
                                        }))
                                    }
                                    className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm text-gray-700 dark:text-slate-300">Block Type</Label>
                            <Select
                                value={editDialog.block.type}
                                onValueChange={(value) =>
                                    setEditDialog((prev) => ({
                                        ...prev,
                                        block: { ...prev.block, type: value as TimeBlock['type'] },
                                    }))
                                }
                            >
                                <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                                    {Object.entries(BLOCK_TYPE_CONFIG).map(([type, config]) => (
                                        <SelectItem key={type} value={type} className="text-gray-900 dark:text-white">
                                            <span className="flex items-center gap-2">
                                                <config.icon className={`h-3.5 w-3.5 ${config.textColor}`} />
                                                {config.label}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {editDialog.block.type === 'AVAILABLE' && (
                            <div className="space-y-2">
                                <Label className="text-sm text-gray-700 dark:text-slate-300">Max Bookings per Slot</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={editDialog.block.maxBookings || 1}
                                    onChange={(e) =>
                                        setEditDialog((prev) => ({
                                            ...prev,
                                            block: { ...prev.block, maxBookings: parseInt(e.target.value, 10) || 1 },
                                        }))
                                    }
                                    className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white w-24"
                                />
                            </div>
                        )}

                        {/* Validation errors */}
                        {validationErrors.length > 0 && (
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-3 space-y-1">
                                {validationErrors.map((err, i) => (
                                    <p key={i} className="text-xs text-red-600 dark:text-red-400">
                                        {err}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setEditDialog((prev) => ({ ...prev, open: false }))}
                            className="border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={saveBlock}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {editDialog.blockIndex !== null ? 'Update' : 'Add'} Block
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
