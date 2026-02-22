'use client'

import React, { useState, useMemo, memo } from 'react'
import {
    useContentList,
    useDeleteContent,
    type MentorContent as MentorContentType,
} from '@/hooks/queries/use-content-queries'
import { CreateContentDialog } from './create-content-dialog'
import { EditContentDialog } from './edit-content-dialog'
import { CourseBuilder } from './course-builder'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Plus,
    MoreVertical,
    BookOpen,
    FileText,
    Link2,
    Pencil,
    Trash2,
    Settings2,
    FolderOpen,
    Loader2,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { toast } from 'sonner'

const typeConfig = {
    COURSE: { icon: BookOpen, label: 'Course', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
    FILE: { icon: FileText, label: 'File', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    URL: { icon: Link2, label: 'URL', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
}

const statusConfig = {
    DRAFT: { label: 'Draft', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    PUBLISHED: { label: 'Published', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
    ARCHIVED: { label: 'Archived', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
}

// ── ContentCard ──

interface ContentCardProps {
    content: MentorContentType
    onEdit: (content: MentorContentType) => void
    onManageCourse: (content: MentorContentType) => void
    onDelete: (id: string) => void
}

const ContentCard = memo(function ContentCard({
    content,
    onEdit,
    onManageCourse,
    onDelete,
}: ContentCardProps) {
    const type = typeConfig[content.type]
    const status = statusConfig[content.status]
    const TypeIcon = type.icon

    return (
        <Card className="group relative overflow-hidden border border-gray-200 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5">
            {/* Gradient top bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="flex flex-row items-start justify-between gap-2 pb-3">
                <div className="flex items-center gap-2 min-w-0">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${type.color}`}>
                        <TypeIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <CardTitle className="text-sm font-semibold truncate">{content.title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDistanceToNow(new Date(content.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onEdit(content)}>
                            <Pencil className="h-3.5 w-3.5 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        {content.type === 'COURSE' && (
                            <DropdownMenuItem onClick={() => onManageCourse(content)}>
                                <Settings2 className="h-3.5 w-3.5 mr-2" />
                                Manage Course
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => onDelete(content.id)}
                        >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
                {content.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                        {content.description}
                    </p>
                )}

                <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="secondary" className={`text-[10px] px-1.5 py-0.5 ${type.color}`}>
                        {type.label}
                    </Badge>
                    <Badge variant="secondary" className={`text-[10px] px-1.5 py-0.5 ${status.color}`}>
                        {status.label}
                    </Badge>
                </div>

                {/* Type-specific info */}
                {content.type === 'FILE' && content.fileName && (
                    <p className="text-[11px] text-muted-foreground truncate" title={content.fileName}>
                        📎 {content.fileName}
                        {content.fileSize ? ` · ${(content.fileSize / 1024 / 1024).toFixed(1)}MB` : ''}
                    </p>
                )}
                {content.type === 'URL' && content.url && (
                    <p className="text-[11px] text-muted-foreground truncate" title={content.url}>
                        🔗 {content.urlTitle || content.url}
                    </p>
                )}
            </CardContent>
        </Card>
    )
})

// ── MentorContent (orchestrator) ──

export function MentorContent() {
    const { data: contentList = [], isLoading, error } = useContentList()
    const deleteContentMutation = useDeleteContent()
    const [activeTab, setActiveTab] = useState('all')
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [editingContent, setEditingContent] = useState<MentorContentType | null>(null)
    const [courseBuilderContent, setCourseBuilderContent] = useState<MentorContentType | null>(null)

    const tabCounts = useMemo(() => ({
        all: contentList.length,
        COURSE: contentList.filter((c) => c.type === 'COURSE').length,
        FILE: contentList.filter((c) => c.type === 'FILE').length,
        URL: contentList.filter((c) => c.type === 'URL').length,
    }), [contentList])

    const filteredContent = useMemo(() => {
        if (activeTab === 'all') return contentList
        return contentList.filter((c) => c.type === activeTab)
    }, [contentList, activeTab])

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) return
        try {
            await deleteContentMutation.mutateAsync(id)
            toast.success('Content deleted successfully')
        } catch {
            toast.error('Failed to delete content')
        }
    }

    // If CourseBuilder is active, show it full-page
    if (courseBuilderContent) {
        return (
            <CourseBuilder
                content={courseBuilderContent}
                onBack={() => setCourseBuilderContent(null)}
            />
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm text-red-500 mb-2">Failed to load content</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Content</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Create and manage your learning resources
                    </p>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Content
                </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="all" className="gap-1.5">
                        All <span className="text-xs opacity-60">({tabCounts.all})</span>
                    </TabsTrigger>
                    <TabsTrigger value="COURSE" className="gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />
                        Courses <span className="text-xs opacity-60">({tabCounts.COURSE})</span>
                    </TabsTrigger>
                    <TabsTrigger value="FILE" className="gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        Files <span className="text-xs opacity-60">({tabCounts.FILE})</span>
                    </TabsTrigger>
                    <TabsTrigger value="URL" className="gap-1.5">
                        <Link2 className="h-3.5 w-3.5" />
                        URLs <span className="text-xs opacity-60">({tabCounts.URL})</span>
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {/* Content grid */}
            {filteredContent.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl">
                    <div className="w-14 h-14 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4">
                        <FolderOpen className="h-7 w-7 text-indigo-500" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        No content yet
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                        Start by creating a course, uploading a file, or adding a URL resource
                    </p>
                    <Button onClick={() => setCreateDialogOpen(true)} variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create your first content
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredContent.map((item) => (
                        <ContentCard
                            key={item.id}
                            content={item}
                            onEdit={setEditingContent}
                            onManageCourse={setCourseBuilderContent}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Dialogs */}
            <CreateContentDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
            {editingContent && (
                <EditContentDialog
                    content={editingContent}
                    open={!!editingContent}
                    onOpenChange={(open) => {
                        if (!open) setEditingContent(null)
                    }}
                />
            )}
        </div>
    )
}
