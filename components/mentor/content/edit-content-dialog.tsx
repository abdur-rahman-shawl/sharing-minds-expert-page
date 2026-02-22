'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
    useUpdateContent,
    useUploadFile,
    type MentorContent,
} from '@/hooks/queries/use-content-queries'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    FileText,
    Link2,
    Upload,
    X,
    Save,
    Loader2,
    BarChart3,
    Info,
    RefreshCw,
} from 'lucide-react'
import { toast } from 'sonner'

interface EditContentDialogProps {
    content: MentorContent
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditContentDialog({ content, open, onOpenChange }: EditContentDialogProps) {
    const updateContentMutation = useUpdateContent()
    const uploadFileMutation = useUploadFile()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [title, setTitle] = useState(content.title)
    const [description, setDescription] = useState(content.description || '')
    const [status, setStatus] = useState(content.status)
    const [url, setUrl] = useState(content.url || '')
    const [urlTitle, setUrlTitle] = useState(content.urlTitle || '')
    const [urlDescription, setUrlDescription] = useState(content.urlDescription || '')
    const [replacementFile, setReplacementFile] = useState<File | null>(null)

    const [isAutoSaving, setIsAutoSaving] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

    // Reset form when content changes
    useEffect(() => {
        setTitle(content.title)
        setDescription(content.description || '')
        setStatus(content.status)
        setUrl(content.url || '')
        setUrlTitle(content.urlTitle || '')
        setUrlDescription(content.urlDescription || '')
        setReplacementFile(null)
    }, [content])

    // Auto-save (2-second debounce)
    const triggerAutoSave = useCallback(() => {
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
        autoSaveTimerRef.current = setTimeout(async () => {
            setIsAutoSaving(true)
            try {
                await updateContentMutation.mutateAsync({
                    id: content.id,
                    title: title.trim(),
                    description: description.trim() || undefined,
                    status,
                    url: content.type === 'URL' ? url : undefined,
                    urlTitle: content.type === 'URL' ? urlTitle : undefined,
                    urlDescription: content.type === 'URL' ? urlDescription : undefined,
                })
            } catch {
                // Silent fail for auto-save
            } finally {
                setIsAutoSaving(false)
            }
        }, 2000)
    }, [content.id, content.type, title, description, status, url, urlTitle, urlDescription, updateContentMutation])

    // Watch for field changes
    useEffect(() => {
        // Only trigger auto-save if values differ from original
        const hasChanged =
            title !== content.title ||
            description !== (content.description || '') ||
            status !== content.status ||
            url !== (content.url || '') ||
            urlTitle !== (content.urlTitle || '') ||
            urlDescription !== (content.urlDescription || '')

        if (hasChanged && !isSaving) {
            triggerAutoSave()
        }

        return () => {
            if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)
        }
    }, [title, description, status, url, urlTitle, urlDescription])

    const handleManualSave = async () => {
        setIsSaving(true)
        if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current)

        try {
            let fileUrl = content.fileUrl
            let fileName = content.fileName
            let fileSize = content.fileSize
            let mimeType = content.mimeType

            // Handle file replacement
            if (replacementFile) {
                const uploadResult = await uploadFileMutation.mutateAsync({
                    file: replacementFile,
                    type: 'content',
                })
                fileUrl = uploadResult.fileUrl
                fileName = uploadResult.fileName
                fileSize = uploadResult.fileSize
                mimeType = uploadResult.mimeType
            }

            await updateContentMutation.mutateAsync({
                id: content.id,
                title: title.trim(),
                description: description.trim() || undefined,
                status,
                fileUrl: fileUrl || undefined,
                fileName: fileName || undefined,
                fileSize: fileSize || undefined,
                mimeType: mimeType || undefined,
                url: content.type === 'URL' ? url : undefined,
                urlTitle: content.type === 'URL' ? urlTitle : undefined,
                urlDescription: content.type === 'URL' ? urlDescription : undefined,
            })

            setReplacementFile(null)
            toast.success('Content saved successfully')
        } catch {
            toast.error('Failed to save content')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) setReplacementFile(file)
    }, [])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle className="text-lg">Edit Content</DialogTitle>
                        {isAutoSaving && (
                            <div className="flex items-center gap-1.5 mt-1">
                                <RefreshCw className="h-3 w-3 animate-spin text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Auto-saving...</span>
                            </div>
                        )}
                    </div>
                </DialogHeader>

                <Tabs defaultValue="details" className="mt-2">
                    <TabsList className="w-full grid grid-cols-3">
                        <TabsTrigger value="details">Content Details</TabsTrigger>
                        <TabsTrigger value="file" disabled={content.type === 'COURSE'}>
                            {content.type === 'URL' ? 'URL Settings' : 'File Management'}
                        </TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    {/* Tab 1: Content Details */}
                    <TabsContent value="details" className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Title</Label>
                            <Input
                                id="edit-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-desc">Description</Label>
                            <Textarea
                                id="edit-desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={(v) => setStatus(v as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </TabsContent>

                    {/* Tab 2: File / URL management */}
                    <TabsContent value="file" className="space-y-4 mt-4">
                        {content.type === 'FILE' && (
                            <>
                                {/* Current file info */}
                                {content.fileName && (
                                    <div className="bg-gray-50 dark:bg-slate-800/50 rounded-lg p-3 flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-indigo-500 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">{content.fileName}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {content.mimeType}
                                                {content.fileSize ? ` · ${(content.fileSize / 1024 / 1024).toFixed(1)}MB` : ''}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Replace file */}
                                <div className="space-y-2">
                                    <Label>Replace File</Label>
                                    <div
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-5 text-center cursor-pointer hover:border-indigo-400 transition-colors"
                                    >
                                        {replacementFile ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <FileText className="h-5 w-5 text-indigo-500" />
                                                <span className="text-sm font-medium truncate max-w-[200px]">
                                                    {replacementFile.name}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setReplacementFile(null)
                                                    }}
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-7 w-7 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-muted-foreground">Drop a new file or click to browse</p>
                                            </>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0]
                                                if (f) setReplacementFile(f)
                                            }}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {content.type === 'URL' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-url">URL</Label>
                                    <Input
                                        id="edit-url"
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-url-title">Link Title</Label>
                                    <Input
                                        id="edit-url-title"
                                        value={urlTitle}
                                        onChange={(e) => setUrlTitle(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-url-desc">Link Description</Label>
                                    <Textarea
                                        id="edit-url-desc"
                                        value={urlDescription}
                                        onChange={(e) => setUrlDescription(e.target.value)}
                                        rows={3}
                                    />
                                </div>
                            </>
                        )}
                    </TabsContent>

                    {/* Tab 3: Analytics (placeholder) */}
                    <TabsContent value="analytics" className="mt-4">
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Views', value: '—' },
                                { label: 'Engagements', value: '—' },
                                { label: 'Performance', value: '—' },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 text-center">
                                    <p className="text-2xl font-bold text-muted-foreground">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3">
                            <Info className="h-4 w-4 text-amber-500 shrink-0" />
                            <span>Analytics coming soon — track how your mentees engage with your content</span>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Save button */}
                <div className="flex justify-end mt-4 pt-3 border-t">
                    <Button onClick={handleManualSave} disabled={isSaving} className="gap-2">
                        {isSaving ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            <><Save className="h-4 w-4" /> Save Changes</>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
