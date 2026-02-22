'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Loader2, Plus, Trash2, CalendarOff, Palmtree, PartyPopper, Presentation, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Exception {
    id: string; startDate: string; endDate: string
    type: 'AVAILABLE' | 'BREAK' | 'BUFFER' | 'BLOCKED'
    reason: string | null; isFullDay: boolean; timeBlocks: unknown
}

const TYPE_BADGE: Record<string, string> = {
    BLOCKED: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
    BREAK: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
    AVAILABLE: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
    BUFFER: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
}

interface AvailabilityExceptionsProps { mentorId?: string }

export function AvailabilityExceptions({ mentorId }: AvailabilityExceptionsProps) {
    const [exceptions, setExceptions] = useState<Exception[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedDates, setSelectedDates] = useState<Date[]>([])
    const [form, setForm] = useState({ type: 'BLOCKED' as Exception['type'], reason: '', isFullDay: true, startTime: '09:00', endTime: '17:00' })
    const [isCreating, setIsCreating] = useState(false)

    const fetchExceptions = useCallback(async () => {
        if (!mentorId) return
        try {
            setIsLoading(true)
            const res = await fetch(`/api/mentors/${mentorId}/availability/exceptions`)
            const data = await res.json()
            if (data.success) setExceptions(data.exceptions || [])
        } catch { /* empty */ } finally { setIsLoading(false) }
    }, [mentorId])

    useEffect(() => { fetchExceptions() }, [fetchExceptions])

    const handleCreate = async () => {
        if (selectedDates.length === 0) { toast.error('Select at least one date'); return }
        const sorted = [...selectedDates].sort((a, b) => a.getTime() - b.getTime())
        const startDate = sorted[0]
        const endDate = new Date(sorted[sorted.length - 1])
        endDate.setHours(23, 59, 59, 999)
        try {
            setIsCreating(true)
            const body: Record<string, unknown> = {
                startDate: startDate.toISOString(), endDate: endDate.toISOString(),
                type: form.type, reason: form.reason || undefined, isFullDay: form.isFullDay,
            }
            if (!form.isFullDay) body.timeBlocks = [{ startTime: form.startTime, endTime: form.endTime, type: form.type }]
            const res = await fetch(`/api/mentors/${mentorId}/availability/exceptions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
            const data = await res.json()
            if (data.success) { toast.success('Exception added'); setDialogOpen(false); setSelectedDates([]); fetchExceptions() }
            else toast.error(data.error || 'Failed to create exception')
        } catch { toast.error('Failed to create exception') } finally { setIsCreating(false) }
    }

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/mentors/${mentorId}/availability/exceptions`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ exceptionIds: [id] }) })
            const data = await res.json()
            if (data.success) { toast.success('Exception removed'); setExceptions(prev => prev.filter(e => e.id !== id)) }
            else toast.error(data.error || 'Failed to delete')
        } catch { toast.error('Failed to delete exception') }
    }

    const quickAdd = (days: number, reason: string) => {
        const start = new Date(); start.setDate(start.getDate() + 1)
        const dates: Date[] = []
        for (let i = 0; i < days; i++) { const d = new Date(start); d.setDate(start.getDate() + i); dates.push(d) }
        setSelectedDates(dates)
        setForm({ type: 'BLOCKED', reason, isFullDay: true, startTime: '09:00', endTime: '17:00' })
        setDialogOpen(true)
    }

    if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => quickAdd(7, 'Vacation')} className="border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs">
                    <Palmtree className="h-3.5 w-3.5 mr-1.5 text-green-500" />Vacation (7 days)
                </Button>
                <Button variant="outline" size="sm" onClick={() => quickAdd(1, 'Public Holiday')} className="border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs">
                    <PartyPopper className="h-3.5 w-3.5 mr-1.5 text-amber-500" />Holiday (1 day)
                </Button>
                <Button variant="outline" size="sm" onClick={() => quickAdd(3, 'Conference')} className="border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 text-xs">
                    <Presentation className="h-3.5 w-3.5 mr-1.5 text-purple-500" />Conference (3 days)
                </Button>
                <Button size="sm" onClick={() => { setSelectedDates([]); setForm({ type: 'BLOCKED', reason: '', isFullDay: true, startTime: '09:00', endTime: '17:00' }); setDialogOpen(true) }} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                    <Plus className="h-3.5 w-3.5 mr-1.5" />Add Exception
                </Button>
            </div>

            {exceptions.length === 0 ? (
                <Card className="bg-white dark:bg-slate-900/60 border-gray-200 dark:border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                        <CalendarOff className="h-10 w-10 text-gray-300 dark:text-slate-600" />
                        <p className="text-sm text-gray-500 dark:text-slate-400">No exceptions yet</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500">Add vacations, holidays, or blocked dates</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {exceptions.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).map(exc => {
                        const start = new Date(exc.startDate); const end = new Date(exc.endDate)
                        const sameDay = format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')
                        return (
                            <Card key={exc.id} className="bg-white dark:bg-slate-900/60 border-gray-200 dark:border-slate-800 group">
                                <CardContent className="flex items-center justify-between py-3 px-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <AlertCircle className="h-4 w-4 text-gray-400 dark:text-slate-500 shrink-0" />
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{exc.reason || exc.type}</span>
                                                <Badge variant="secondary" className={`text-[10px] border-0 ${TYPE_BADGE[exc.type]}`}>{exc.type}</Badge>
                                                {!exc.isFullDay && <Badge variant="outline" className="text-[10px] border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500">Partial</Badge>}
                                            </div>
                                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{sameDay ? format(start, 'MMM d, yyyy') : `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`}</p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity" onClick={() => handleDelete(exc.id)}>
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-white">Add Exception</DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-slate-400">Select dates and set exception details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="flex justify-center">
                            <Calendar mode="multiple" selected={selectedDates} onSelect={(dates) => setSelectedDates(dates || [])} disabled={(date) => date < new Date()} className="rounded-lg border border-gray-200 dark:border-slate-700" />
                        </div>
                        {selectedDates.length > 0 && <p className="text-xs text-center text-gray-500 dark:text-slate-400">{selectedDates.length} day{selectedDates.length > 1 ? 's' : ''} selected</p>}
                        <div className="space-y-2">
                            <Label className="text-sm text-gray-700 dark:text-slate-300">Type</Label>
                            <Select value={form.type} onValueChange={(v) => setForm(p => ({ ...p, type: v as Exception['type'] }))}>
                                <SelectTrigger className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
                                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                                    <SelectItem value="BREAK">Break</SelectItem>
                                    <SelectItem value="AVAILABLE">Available (override)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center justify-between">
                            <Label className="text-sm text-gray-700 dark:text-slate-300">Full Day</Label>
                            <Switch checked={form.isFullDay} onCheckedChange={(c) => setForm(p => ({ ...p, isFullDay: c }))} />
                        </div>
                        {!form.isFullDay && (
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1"><Label className="text-xs text-gray-700 dark:text-slate-300">Start</Label><Input type="time" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))} className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white" /></div>
                                <div className="space-y-1"><Label className="text-xs text-gray-700 dark:text-slate-300">End</Label><Input type="time" value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))} className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white" /></div>
                            </div>
                        )}
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-700 dark:text-slate-300">Reason (optional)</Label>
                            <Textarea value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} placeholder="e.g., Annual vacation..." rows={2} className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white resize-none" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300">Cancel</Button>
                        <Button onClick={handleCreate} disabled={isCreating || selectedDates.length === 0} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            {isCreating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}Add
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
