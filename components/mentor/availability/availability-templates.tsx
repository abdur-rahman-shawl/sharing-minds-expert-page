'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LayoutTemplate, Clock, Download, Trash2, Save, Briefcase, Moon, Sun } from 'lucide-react'
import { toast } from 'sonner'
import type { AvailabilitySchedule, TimeBlock } from './mentor-availability-manager'

const STORAGE_KEY = 'sm_availability_templates'

interface SavedTemplate {
    id: string; name: string; createdAt: string; configuration: AvailabilitySchedule
}

// Premade templates
const PREMADE_TEMPLATES: { name: string; description: string; icon: typeof Clock; config: Partial<AvailabilitySchedule> & { weeklyPatterns: AvailabilitySchedule['weeklyPatterns'] } }[] = [
    {
        name: 'Standard Business Hours', description: 'Mon–Fri, 9 AM – 5 PM with lunch break', icon: Briefcase,
        config: {
            timezone: 'UTC', defaultSessionDuration: 60, bufferTimeBetweenSessions: 15,
            minAdvanceBookingHours: 24, maxAdvanceBookingDays: 90, isActive: true, allowInstantBooking: true, requireConfirmation: false,
            weeklyPatterns: [0, 1, 2, 3, 4, 5, 6].map(d => ({
                dayOfWeek: d, isEnabled: d >= 1 && d <= 5,
                timeBlocks: d >= 1 && d <= 5
                    ? [{ startTime: '09:00', endTime: '12:00', type: 'AVAILABLE' as const, maxBookings: 1 }, { startTime: '12:00', endTime: '13:00', type: 'BREAK' as const }, { startTime: '13:00', endTime: '17:00', type: 'AVAILABLE' as const, maxBookings: 1 }]
                    : [],
            })),
        },
    },
    {
        name: 'Morning Only', description: 'Mon–Fri, 8 AM – 12 PM', icon: Sun,
        config: {
            timezone: 'UTC', defaultSessionDuration: 60, bufferTimeBetweenSessions: 15,
            minAdvanceBookingHours: 24, maxAdvanceBookingDays: 90, isActive: true, allowInstantBooking: true, requireConfirmation: false,
            weeklyPatterns: [0, 1, 2, 3, 4, 5, 6].map(d => ({
                dayOfWeek: d, isEnabled: d >= 1 && d <= 5,
                timeBlocks: d >= 1 && d <= 5 ? [{ startTime: '08:00', endTime: '12:00', type: 'AVAILABLE' as const, maxBookings: 1 }] : [],
            })),
        },
    },
    {
        name: 'Evening Sessions', description: 'Mon–Thu, 6 PM – 9 PM', icon: Moon,
        config: {
            timezone: 'UTC', defaultSessionDuration: 60, bufferTimeBetweenSessions: 15,
            minAdvanceBookingHours: 24, maxAdvanceBookingDays: 90, isActive: true, allowInstantBooking: true, requireConfirmation: false,
            weeklyPatterns: [0, 1, 2, 3, 4, 5, 6].map(d => ({
                dayOfWeek: d, isEnabled: d >= 1 && d <= 4,
                timeBlocks: d >= 1 && d <= 4 ? [{ startTime: '18:00', endTime: '21:00', type: 'AVAILABLE' as const, maxBookings: 1 }] : [],
            })),
        },
    },
]

interface AvailabilityTemplatesProps {
    currentSchedule: AvailabilitySchedule
    onApplyTemplate: (template: AvailabilitySchedule) => void
}

export function AvailabilityTemplates({ currentSchedule, onApplyTemplate }: AvailabilityTemplatesProps) {
    const [customTemplates, setCustomTemplates] = useState<SavedTemplate[]>([])
    const [saveDialogOpen, setSaveDialogOpen] = useState(false)
    const [templateName, setTemplateName] = useState('')

    // Load from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) setCustomTemplates(JSON.parse(stored))
        } catch { /* empty */ }
    }, [])

    const saveToStorage = (templates: SavedTemplate[]) => {
        setCustomTemplates(templates)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
    }

    const handleSaveTemplate = () => {
        if (!templateName.trim()) { toast.error('Enter a template name'); return }
        const newTemplate: SavedTemplate = {
            id: crypto.randomUUID(), name: templateName.trim(), createdAt: new Date().toISOString(), configuration: currentSchedule,
        }
        saveToStorage([...customTemplates, newTemplate])
        setSaveDialogOpen(false)
        setTemplateName('')
        toast.success(`Template "${newTemplate.name}" saved`)
    }

    const handleDeleteTemplate = (id: string) => {
        saveToStorage(customTemplates.filter(t => t.id !== id))
        toast.success('Template deleted')
    }

    const handleApplyPremade = (config: typeof PREMADE_TEMPLATES[0]['config']) => {
        onApplyTemplate({
            ...currentSchedule,
            ...config,
            weeklyPatterns: config.weeklyPatterns,
        } as AvailabilitySchedule)
    }

    return (
        <div className="space-y-6">
            {/* Save current */}
            <Card className="bg-white dark:bg-slate-900/60 border-gray-200 dark:border-slate-800">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Save className="h-5 w-5 text-indigo-500" />
                            <CardTitle className="text-base text-gray-900 dark:text-white">Save Current Schedule</CardTitle>
                        </div>
                        <Button size="sm" onClick={() => { setTemplateName(''); setSaveDialogOpen(true) }} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                            <Save className="h-3.5 w-3.5 mr-1.5" />Save as Template
                        </Button>
                    </div>
                    <CardDescription className="text-gray-500 dark:text-slate-400 text-xs">
                        Save your current availability configuration as a reusable template
                    </CardDescription>
                </CardHeader>
            </Card>

            {/* Premade templates */}
            <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Premade Templates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PREMADE_TEMPLATES.map((tmpl) => (
                        <Card key={tmpl.name} className="bg-white dark:bg-slate-900/60 border-gray-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors cursor-pointer group" onClick={() => handleApplyPremade(tmpl.config)}>
                            <CardContent className="py-4 px-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    <tmpl.icon className="h-4 w-4 text-indigo-500" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{tmpl.name}</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-slate-400">{tmpl.description}</p>
                                <Button size="sm" variant="outline" className="w-full mt-2 text-xs border-gray-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Download className="h-3 w-3 mr-1.5" />Apply
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Custom templates */}
            <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Your Templates</h3>
                {customTemplates.length === 0 ? (
                    <Card className="bg-white dark:bg-slate-900/60 border-gray-200 dark:border-slate-800">
                        <CardContent className="flex flex-col items-center py-8 text-center space-y-2">
                            <LayoutTemplate className="h-8 w-8 text-gray-300 dark:text-slate-600" />
                            <p className="text-sm text-gray-500 dark:text-slate-400">No saved templates</p>
                            <p className="text-xs text-gray-400 dark:text-slate-500">Save your current schedule configuration as a template</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {customTemplates.map(tmpl => (
                            <Card key={tmpl.id} className="bg-white dark:bg-slate-900/60 border-gray-200 dark:border-slate-800 group">
                                <CardContent className="flex items-center justify-between py-3 px-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <LayoutTemplate className="h-4 w-4 text-indigo-400 shrink-0" />
                                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{tmpl.name}</span>
                                            <Badge variant="outline" className="text-[10px] border-gray-300 dark:border-slate-600 text-gray-400 dark:text-slate-500">{tmpl.configuration.defaultSessionDuration}min</Badge>
                                        </div>
                                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 ml-6">Saved {new Date(tmpl.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button size="sm" variant="outline" onClick={() => onApplyTemplate(tmpl.configuration)} className="text-xs border-gray-300 dark:border-slate-600 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Download className="h-3 w-3 mr-1" />Apply
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => handleDeleteTemplate(tmpl.id)} className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Save Dialog */}
            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                <DialogContent className="bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 sm:max-w-sm">
                    <DialogHeader><DialogTitle className="text-gray-900 dark:text-white">Save Template</DialogTitle></DialogHeader>
                    <div className="py-2 space-y-2">
                        <Label className="text-sm text-gray-700 dark:text-slate-300">Template Name</Label>
                        <Input value={templateName} onChange={e => setTemplateName(e.target.value)} placeholder="e.g., My Standard Schedule" className="bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white" onKeyDown={e => e.key === 'Enter' && handleSaveTemplate()} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSaveDialogOpen(false)} className="border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-300">Cancel</Button>
                        <Button onClick={handleSaveTemplate} disabled={!templateName.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
