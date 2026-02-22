'use client'

import React, { useState, useCallback, useRef } from 'react'
import {
    useCreateContent,
    useUploadFile,
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
import { Progress } from '@/components/ui/progress'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    BookOpen,
    FileText,
    Link2,
    Upload,
    X,
    ArrowRight,
    ArrowLeft,
    Loader2,
    CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'

interface CreateContentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

type ContentType = 'COURSE' | 'FILE' | 'URL'

const typeOptions = [
    { value: 'COURSE' as const, icon: BookOpen, label: 'Course', desc: 'Build a structured learning experience with modules, sections, and content items' },
    { value: 'FILE' as const, icon: FileText, label: 'File', desc: 'Upload PDFs, videos, documents, or other files for your mentees' },
    { value: 'URL' as const, icon: Link2, label: 'URL', desc: 'Share an external link to articles, videos, or other web resources' },
]

export function CreateContentDialog({ open, onOpenChange }: CreateContentDialogProps) {
    const createContentMutation = useCreateContent()
    const uploadFileMutation = useUploadFile()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [step, setStep] = useState(1)
    const [progress, setProgress] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fields
    const [type, setType] = useState<ContentType | null>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [url, setUrl] = useState('')
    const [urlTitle, setUrlTitle] = useState('')
    const [urlDescription, setUrlDescription] = useState('')
    const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT')

    const reset = useCallback(() => {
        setStep(1)
        setProgress(0)
        setIsSubmitting(false)
        setType(null)
        setTitle('')
        setDescription('')
        setSelectedFile(null)
        setUrl('')
        setUrlTitle('')
        setUrlDescription('')
        setStatus('DRAFT')
    }, [])

    const handleClose = useCallback((open: boolean) => {
        if (!open) reset()
        onOpenChange(open)
    }, [onOpenChange, reset])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        const file = e.dataTransfer.files[0]
        if (file) setSelectedFile(file)
    }, [])

    const handleSubmit = async () => {
        if (!type || !title.trim()) return
        setIsSubmitting(true)
        setProgress(10)

        try {
            let fileUrl: string | undefined
            let fileName: string | undefined
            let fileSize: number | undefined
            let mimeType: string | undefined

            // Upload file if FILE type
            if (type === 'FILE' && selectedFile) {
                setProgress(30)
                const uploadResult = await uploadFileMutation.mutateAsync({
                    file: selectedFile,
                    type: 'content',
                })
                fileUrl = uploadResult.fileUrl
                fileName = uploadResult.fileName
                fileSize = uploadResult.fileSize
                mimeType = uploadResult.mimeType
                setProgress(70)
            } else {
                setProgress(50)
            }

            await createContentMutation.mutateAsync({
                title: title.trim(),
                description: description.trim() || undefined,
                type,
                status,
                fileUrl,
                fileName,
                fileSize,
                mimeType,
                url: type === 'URL' ? url : undefined,
                urlTitle: type === 'URL' ? urlTitle : undefined,
                urlDescription: type === 'URL' ? urlDescription : undefined,
            })

            setProgress(100)
            toast.success('Content created successfully!')

            setTimeout(() => {
                handleClose(false)
            }, 500)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to create content'
            toast.error(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const canGoNext = () => {
        if (step === 1) return !!type
        if (step === 2) {
            if (!title.trim()) return false
            if (type === 'FILE') return !!selectedFile
            if (type === 'URL') return !!url.trim()
            return true
        }
        return true
    }

    const totalSteps = type === 'COURSE' ? 2 : 3

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">
                        Create Content
                    </DialogTitle>
                    {/* Step indicator */}
                    <div className="flex items-center gap-2 mt-3">
                        {Array.from({ length: totalSteps }, (_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-colors ${i + 1 <= step
                                        ? 'bg-indigo-500'
                                        : 'bg-gray-200 dark:bg-slate-700'
                                    }`}
                            />
                        ))}
                    </div>
                </DialogHeader>

                <div className="space-y-5 mt-2">
                    {/* Step 1: Choose type */}
                    {step === 1 && (
                        <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                What type of content do you want to create?
                            </p>
                            <div className="space-y-2">
                                {typeOptions.map((opt) => {
                                    const Icon = opt.icon
                                    const selected = type === opt.value
                                    return (
                                        <button
                                            key={opt.value}
                                            onClick={() => setType(opt.value)}
                                            className={`w-full flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${selected
                                                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30'
                                                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                                }`}
                                        >
                                            <div className={`mt-0.5 w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${selected ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-gray-100 dark:bg-slate-800'
                                                }`}>
                                                <Icon className={`h-4.5 w-4.5 ${selected ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500'}`} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{opt.label}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                                            </div>
                                            {selected && (
                                                <CheckCircle2 className="h-5 w-5 text-indigo-500 ml-auto shrink-0 mt-1" />
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Give your content a title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe what this content is about..."
                                    rows={3}
                                />
                            </div>

                            {/* FILE: Upload area */}
                            {type === 'FILE' && (
                                <div className="space-y-2">
                                    <Label>Upload File *</Label>
                                    <div
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                                    >
                                        {selectedFile ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <FileText className="h-5 w-5 text-indigo-500" />
                                                <span className="text-sm font-medium truncate max-w-[200px]">
                                                    {selectedFile.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({(selectedFile.size / 1024 / 1024).toFixed(1)}MB)
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0 ml-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelectedFile(null)
                                                    }}
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-sm text-muted-foreground">
                                                    Drag & drop or click to upload
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    PDF, Video, Documents, Images — up to 100MB
                                                </p>
                                            </>
                                        )}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => {
                                                const f = e.target.files?.[0]
                                                if (f) setSelectedFile(f)
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* URL fields */}
                            {type === 'URL' && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="url">URL *</Label>
                                        <Input
                                            id="url"
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://example.com/resource"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="urlTitle">Link Title</Label>
                                        <Input
                                            id="urlTitle"
                                            value={urlTitle}
                                            onChange={(e) => setUrlTitle(e.target.value)}
                                            placeholder="Optional display title"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="urlDescription">Link Description</Label>
                                        <Textarea
                                            id="urlDescription"
                                            value={urlDescription}
                                            onChange={(e) => setUrlDescription(e.target.value)}
                                            placeholder="Brief description of the resource"
                                            rows={2}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 3: Review & Publish (FILE/URL only — COURSE skips to 2 steps) */}
                    {step === 3 && (
                        <div className="space-y-4">
                            <p className="text-sm font-medium">Review & Publish</p>
                            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Type</span>
                                    <span className="font-medium">{type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Title</span>
                                    <span className="font-medium truncate ml-4 max-w-[200px]">{title}</span>
                                </div>
                                {type === 'FILE' && selectedFile && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">File</span>
                                        <span className="font-medium truncate ml-4 max-w-[200px]">{selectedFile.name}</span>
                                    </div>
                                )}
                                {type === 'URL' && url && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">URL</span>
                                        <span className="font-medium truncate ml-4 max-w-[200px]">{url}</span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={status} onValueChange={(v) => setStatus(v as 'DRAFT' | 'PUBLISHED')}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                        <SelectItem value="PUBLISHED">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {isSubmitting && (
                                <Progress value={progress} className="w-full" />
                            )}
                        </div>
                    )}
                </div>

                {/* Footer buttons */}
                <div className="flex justify-between mt-4">
                    <Button
                        variant="outline"
                        onClick={() => {
                            if (step === 1) handleClose(false)
                            else setStep(step - 1)
                        }}
                        disabled={isSubmitting}
                    >
                        {step === 1 ? 'Cancel' : <><ArrowLeft className="h-4 w-4 mr-1" /> Back</>}
                    </Button>

                    {(step < totalSteps) ? (
                        <Button
                            onClick={() => setStep(step + 1)}
                            disabled={!canGoNext()}
                            className="gap-1"
                        >
                            Next <ArrowRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!canGoNext() || isSubmitting}
                            className="gap-1"
                        >
                            {isSubmitting ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
                            ) : (
                                'Create Content'
                            )}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
