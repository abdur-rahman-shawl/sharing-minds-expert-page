'use client'

import React, { useState, useMemo, useCallback } from 'react'
import {
    useContent,
    useCreateCourse,
    useUploadFile,
    type MentorContent,
    type Course,
    type CourseModule as CourseModuleType,
    type CourseSection,
    type ContentItem,
} from '@/hooks/queries/use-content-queries'
import { safeJsonParse } from '@/lib/utils/safe-json'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import {
    ArrowLeft,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    BookOpen,
    Layers,
    FileText,
    Video,
    Link2,
    Type,
    Upload,
    GripVertical,
    ChevronDown,
    Eye,
    Clock,
    DollarSign,
    Tag,
    Target,
    GraduationCap,
    X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

// ── Sub-dialog: CreateCourseDialog ──

function CreateCourseDialog({
    open,
    onOpenChange,
    contentId,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    contentId: string
}) {
    const createCourse = useCreateCourse()
    const [difficulty, setDifficulty] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER')
    const [category, setCategory] = useState('')
    const [duration, setDuration] = useState('')
    const [price, setPrice] = useState('')
    const [outcomesText, setOutcomesText] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const learningOutcomes = outcomesText
                .split('\n')
                .map((l) => l.trim())
                .filter(Boolean)

            await createCourse.mutateAsync({
                contentId,
                difficulty,
                category: category.trim() || undefined,
                duration: duration ? parseInt(duration) : undefined,
                price: price || undefined,
                learningOutcomes: learningOutcomes.length > 0 ? learningOutcomes : undefined,
            })
            toast.success('Course details saved')
            onOpenChange(false)
        } catch {
            toast.error('Failed to create course')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Setup Course Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label>Difficulty *</Label>
                        <Select value={difficulty} onValueChange={(v) => setDifficulty(v as typeof difficulty)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BEGINNER">Beginner</SelectItem>
                                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                <SelectItem value="ADVANCED">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cat">Category</Label>
                        <Input id="cat" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Web Development" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="dur">Duration (minutes)</Label>
                            <Input id="dur" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="prc">Price (USD)</Label>
                            <Input id="prc" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="outcomes">Learning Outcomes</Label>
                        <Textarea
                            id="outcomes"
                            value={outcomesText}
                            onChange={(e) => setOutcomesText(e.target.value)}
                            placeholder="One per line"
                            rows={3}
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                            Save Course Details
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ── Sub-dialog: CreateModuleDialog ──

function CreateModuleDialog({
    open,
    onOpenChange,
    contentId,
    nextIndex,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    contentId: string
    nextIndex: number
}) {
    const queryClient = useQueryClient()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!title.trim()) return
        setIsSubmitting(true)
        try {
            await fetch(`/api/mentors/content/${contentId}/course/modules`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title.trim(), description: description.trim() || undefined, orderIndex: nextIndex }),
            })
            queryClient.invalidateQueries({ queryKey: ['mentor-content', contentId] })
            toast.success('Module added')
            setTitle('')
            setDescription('')
            onOpenChange(false)
        } catch {
            toast.error('Failed to add module')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Add Module</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="mod-title">Title *</Label>
                        <Input id="mod-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Module title" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mod-desc">Description</Label>
                        <Textarea id="mod-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSubmit} disabled={isSubmitting || !title.trim()}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                            Add Module
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ── Sub-dialog: CreateSectionDialog ──

function CreateSectionDialog({
    open,
    onOpenChange,
    moduleId,
    contentId,
    nextIndex,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    moduleId: string
    contentId: string
    nextIndex: number
}) {
    const queryClient = useQueryClient()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!title.trim()) return
        setIsSubmitting(true)
        try {
            await fetch(`/api/mentors/content/modules/${moduleId}/sections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title.trim(), description: description.trim() || undefined, orderIndex: nextIndex }),
            })
            queryClient.invalidateQueries({ queryKey: ['mentor-content', contentId] })
            toast.success('Section added')
            setTitle('')
            setDescription('')
            onOpenChange(false)
        } catch {
            toast.error('Failed to add section')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle>Add Section</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label htmlFor="sec-title">Title *</Label>
                        <Input id="sec-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Section title" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sec-desc">Description</Label>
                        <Textarea id="sec-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSubmit} disabled={isSubmitting || !title.trim()}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                            Add Section
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ── Sub-dialog: CreateContentItemDialog ──

const itemTypeIcons: Record<string, React.ReactNode> = {
    VIDEO: <Video className="h-4 w-4" />,
    PDF: <FileText className="h-4 w-4" />,
    DOCUMENT: <FileText className="h-4 w-4" />,
    URL: <Link2 className="h-4 w-4" />,
    TEXT: <Type className="h-4 w-4" />,
}

function CreateContentItemDialog({
    open,
    onOpenChange,
    sectionId,
    contentId,
    nextIndex,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    sectionId: string
    contentId: string
    nextIndex: number
}) {
    const queryClient = useQueryClient()
    const uploadFile = useUploadFile()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState<'VIDEO' | 'PDF' | 'DOCUMENT' | 'URL' | 'TEXT'>('TEXT')
    const [textContent, setTextContent] = useState('')
    const [urlContent, setUrlContent] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isPreview, setIsPreview] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async () => {
        if (!title.trim()) return
        setIsSubmitting(true)
        try {
            let fileUrl: string | undefined
            let fileName: string | undefined
            let fileSize: number | undefined
            let mimeType: string | undefined

            if ((type === 'VIDEO' || type === 'PDF' || type === 'DOCUMENT') && selectedFile) {
                const result = await uploadFile.mutateAsync({ file: selectedFile, type: 'content' })
                fileUrl = result.fileUrl
                fileName = result.fileName
                fileSize = result.fileSize
                mimeType = result.mimeType
            }

            await fetch(`/api/mentors/content/sections/${sectionId}/content-items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim() || undefined,
                    type,
                    orderIndex: nextIndex,
                    content: type === 'TEXT' ? textContent : type === 'URL' ? urlContent : undefined,
                    fileUrl,
                    fileName,
                    fileSize,
                    mimeType,
                    isPreview,
                }),
            })
            queryClient.invalidateQueries({ queryKey: ['mentor-content', contentId] })
            toast.success('Content item added')
            setTitle('')
            setDescription('')
            setTextContent('')
            setUrlContent('')
            setSelectedFile(null)
            setIsPreview(false)
            onOpenChange(false)
        } catch {
            toast.error('Failed to add content item')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>Add Content Item</DialogTitle></DialogHeader>
                <div className="space-y-4 mt-2">
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {['VIDEO', 'PDF', 'DOCUMENT', 'URL', 'TEXT'].map((t) => (
                                    <SelectItem key={t} value={t}>
                                        <div className="flex items-center gap-2">{itemTypeIcons[t]} {t}</div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="item-title">Title *</Label>
                        <Input id="item-title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="item-desc">Description</Label>
                        <Textarea id="item-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
                    </div>

                    {/* Type-specific fields */}
                    {(type === 'VIDEO' || type === 'PDF' || type === 'DOCUMENT') && (
                        <div className="space-y-2">
                            <Label>Upload File</Label>
                            <div
                                onClick={() => document.getElementById('item-file-input')?.click()}
                                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-indigo-400 transition-colors"
                            >
                                {selectedFile ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <FileText className="h-4 w-4 text-indigo-500" />
                                        <span className="text-sm truncate max-w-[200px]">{selectedFile.name}</span>
                                        <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={(e) => { e.stopPropagation(); setSelectedFile(null) }}>
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <><Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" /><p className="text-xs text-muted-foreground">Click to upload</p></>
                                )}
                                <input id="item-file-input" type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setSelectedFile(f) }} />
                            </div>
                        </div>
                    )}
                    {type === 'TEXT' && (
                        <div className="space-y-2">
                            <Label htmlFor="item-text">Content</Label>
                            <Textarea id="item-text" value={textContent} onChange={(e) => setTextContent(e.target.value)} rows={5} placeholder="Write your text content..." />
                        </div>
                    )}
                    {type === 'URL' && (
                        <div className="space-y-2">
                            <Label htmlFor="item-url">URL</Label>
                            <Input id="item-url" type="url" value={urlContent} onChange={(e) => setUrlContent(e.target.value)} placeholder="https://..." />
                        </div>
                    )}

                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" checked={isPreview} onChange={(e) => setIsPreview(e.target.checked)} className="rounded" />
                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                        Allow preview (visible before enrollment)
                    </label>

                    <div className="flex justify-end">
                        <Button onClick={handleSubmit} disabled={isSubmitting || !title.trim()}>
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                            Add Item
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ── CourseBuilder (main component) ──

interface CourseBuilderProps {
    content: MentorContent
    onBack: () => void
}

export function CourseBuilder({ content, onBack }: CourseBuilderProps) {
    const { data: fullContent, isLoading } = useContent(content.id)
    const queryClient = useQueryClient()

    const [createCourseOpen, setCreateCourseOpen] = useState(false)
    const [addModuleOpen, setAddModuleOpen] = useState(false)
    const [addSectionTarget, setAddSectionTarget] = useState<{ moduleId: string; nextIndex: number } | null>(null)
    const [addItemTarget, setAddItemTarget] = useState<{ sectionId: string; nextIndex: number } | null>(null)

    const course = fullContent?.course
    const modules = course?.modules || []

    const handleDelete = async (
        type: 'module' | 'section' | 'contentItem',
        data: { id: string; moduleId?: string; sectionId?: string }
    ) => {
        if (!confirm(`Delete this ${type}? This cannot be undone.`)) return
        try {
            let endpoint = ''
            if (type === 'module') endpoint = `/api/mentors/content/${content.id}/course/modules/${data.id}`
            if (type === 'section') endpoint = `/api/mentors/content/modules/${data.moduleId}/sections/${data.id}`
            if (type === 'contentItem') endpoint = `/api/mentors/content/sections/${data.sectionId}/content-items/${data.id}`

            await fetch(endpoint, { method: 'DELETE' })
            queryClient.invalidateQueries({ queryKey: ['mentor-content', content.id] })
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`)
        } catch {
            toast.error(`Failed to delete ${type}`)
        }
    }

    const handleReorderModules = async (reordered: CourseModuleType[]) => {
        try {
            await Promise.all(
                reordered.map((mod, idx) =>
                    fetch(`/api/mentors/content/${content.id}/course/modules/${mod.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ orderIndex: idx }),
                    })
                )
            )
            queryClient.invalidateQueries({ queryKey: ['mentor-content', content.id] })
        } catch {
            toast.error('Failed to reorder modules')
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{content.title}</h1>
                    <p className="text-sm text-muted-foreground">Course Builder</p>
                </div>
            </div>

            <Tabs defaultValue="structure">
                <TabsList>
                    <TabsTrigger value="structure" className="gap-1.5">
                        <Layers className="h-3.5 w-3.5" /> Course Structure
                    </TabsTrigger>
                    <TabsTrigger value="details" className="gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" /> Course Details
                    </TabsTrigger>
                </TabsList>

                {/* ── Tab 1: Course Structure ── */}
                <TabsContent value="structure" className="mt-4 space-y-4">
                    {!course ? (
                        <Card className="border-dashed">
                            <CardContent className="py-8 text-center">
                                <GraduationCap className="h-10 w-10 text-indigo-400 mx-auto mb-3" />
                                <h3 className="font-semibold mb-1">No course details yet</h3>
                                <p className="text-sm text-muted-foreground mb-4">Set up difficulty, category, and learning outcomes to get started</p>
                                <Button onClick={() => setCreateCourseOpen(true)}>Setup Course Details</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">{modules.length} module{modules.length !== 1 ? 's' : ''}</p>
                                <Button size="sm" onClick={() => setAddModuleOpen(true)} className="gap-1">
                                    <Plus className="h-3.5 w-3.5" /> Add Module
                                </Button>
                            </div>

                            {modules.length === 0 ? (
                                <div className="border-2 border-dashed rounded-xl p-8 text-center">
                                    <Layers className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">No modules yet. Add your first module to start building the course.</p>
                                </div>
                            ) : (
                                <Accordion type="multiple" className="space-y-2">
                                    {modules.map((mod) => (
                                        <AccordionItem key={mod.id} value={mod.id} className="border rounded-xl overflow-hidden">
                                            <AccordionTrigger className="px-4 py-3 hover:no-underline">
                                                <div className="flex items-center gap-2 text-left">
                                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm font-semibold">{mod.title}</p>
                                                        {mod.description && (
                                                            <p className="text-xs text-muted-foreground mt-0.5">{mod.description}</p>
                                                        )}
                                                    </div>
                                                    <Badge variant="secondary" className="text-[10px] ml-auto mr-2">
                                                        {(mod.sections || []).length} section{(mod.sections || []).length !== 1 ? 's' : ''}
                                                    </Badge>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4">
                                                <div className="flex items-center gap-1.5 mb-3">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 text-xs gap-1"
                                                        onClick={() => setAddSectionTarget({ moduleId: mod.id, nextIndex: (mod.sections || []).length })}
                                                    >
                                                        <Plus className="h-3 w-3" /> Add Section
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 text-xs text-red-500 hover:text-red-600 gap-1"
                                                        onClick={() => handleDelete('module', { id: mod.id })}
                                                    >
                                                        <Trash2 className="h-3 w-3" /> Delete Module
                                                    </Button>
                                                </div>

                                                {(mod.sections || []).length === 0 ? (
                                                    <p className="text-xs text-muted-foreground py-3 text-center">No sections. Add one to organize content.</p>
                                                ) : (
                                                    <div className="space-y-2 ml-3">
                                                        {(mod.sections || []).map((sec) => (
                                                            <div key={sec.id} className="border rounded-lg p-3 bg-gray-50/50 dark:bg-slate-800/30">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <p className="text-sm font-medium">{sec.title}</p>
                                                                        {sec.description && (
                                                                            <p className="text-xs text-muted-foreground">{sec.description}</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-6 w-6 p-0"
                                                                            onClick={() =>
                                                                                setAddItemTarget({ sectionId: sec.id, nextIndex: (sec.contentItems || []).length })
                                                                            }
                                                                        >
                                                                            <Plus className="h-3.5 w-3.5" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            className="h-6 w-6 p-0 text-red-500"
                                                                            onClick={() => handleDelete('section', { id: sec.id, moduleId: mod.id })}
                                                                        >
                                                                            <Trash2 className="h-3 w-3" />
                                                                        </Button>
                                                                    </div>
                                                                </div>

                                                                {/* Content items */}
                                                                {(sec.contentItems || []).length > 0 && (
                                                                    <div className="mt-2 space-y-1 ml-2">
                                                                        {(sec.contentItems || []).map((item) => (
                                                                            <div
                                                                                key={item.id}
                                                                                className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-white dark:hover:bg-slate-800 text-xs"
                                                                            >
                                                                                <div className="flex items-center gap-2 min-w-0">
                                                                                    {itemTypeIcons[item.type]}
                                                                                    <span className="truncate">{item.title}</span>
                                                                                    {item.isPreview && (
                                                                                        <Badge variant="outline" className="text-[9px] px-1 py-0">
                                                                                            <Eye className="h-2.5 w-2.5 mr-0.5" /> Preview
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                                <Button
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    className="h-5 w-5 p-0 text-red-500 opacity-0 group-hover:opacity-100"
                                                                                    onClick={() =>
                                                                                        handleDelete('contentItem', { id: item.id, sectionId: sec.id })
                                                                                    }
                                                                                >
                                                                                    <Trash2 className="h-3 w-3" />
                                                                                </Button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            )}
                        </>
                    )}
                </TabsContent>

                {/* ── Tab 2: Course Details ── */}
                <TabsContent value="details" className="mt-4">
                    {course ? (
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Target className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Difficulty:</span>
                                        <Badge variant="secondary">{course.difficulty}</Badge>
                                    </div>
                                    {course.category && (
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Category:</span>
                                            <span>{course.category}</span>
                                        </div>
                                    )}
                                    {course.duration && (
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Duration:</span>
                                            <span>{course.duration} min</span>
                                        </div>
                                    )}
                                    {course.price && (
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Price:</span>
                                            <span>${course.price} {course.currency}</span>
                                        </div>
                                    )}
                                </div>

                                {course.learningOutcomes && (
                                    <>
                                        <Separator />
                                        <div>
                                            <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                                                <GraduationCap className="h-4 w-4 text-indigo-500" /> Learning Outcomes
                                            </p>
                                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                                {safeJsonParse<string[]>(course.learningOutcomes, []).map((o, i) => (
                                                    <li key={i}>{o}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </>
                                )}

                                <div className="pt-2">
                                    <Button variant="outline" size="sm" onClick={() => setCreateCourseOpen(true)}>
                                        <Pencil className="h-3.5 w-3.5 mr-1" /> Edit Course Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-dashed">
                            <CardContent className="py-8 text-center">
                                <p className="text-sm text-muted-foreground">Setup course details first from the Course Structure tab</p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <CreateCourseDialog open={createCourseOpen} onOpenChange={setCreateCourseOpen} contentId={content.id} />
            <CreateModuleDialog open={addModuleOpen} onOpenChange={setAddModuleOpen} contentId={content.id} nextIndex={modules.length} />
            {addSectionTarget && (
                <CreateSectionDialog
                    open={!!addSectionTarget}
                    onOpenChange={(o) => { if (!o) setAddSectionTarget(null) }}
                    moduleId={addSectionTarget.moduleId}
                    contentId={content.id}
                    nextIndex={addSectionTarget.nextIndex}
                />
            )}
            {addItemTarget && (
                <CreateContentItemDialog
                    open={!!addItemTarget}
                    onOpenChange={(o) => { if (!o) setAddItemTarget(null) }}
                    sectionId={addItemTarget.sectionId}
                    contentId={content.id}
                    nextIndex={addItemTarget.nextIndex}
                />
            )}
        </div>
    )
}
