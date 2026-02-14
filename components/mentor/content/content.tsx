"use client";

import { useState, useMemo, useCallback, memo } from 'react';
import { Plus, Book, FileText, Link, MoreVertical, Eye, Edit, Trash2, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useContentList, useDeleteContent, MentorContent as ContentType } from '@/hooks/queries/use-content-queries';
import { CreateContentDialog } from './create-content-dialog';
import { EditContentDialog } from './edit-content-dialog';
import { CourseBuilder } from './course-builder';

import { MentorContentErrorBoundary, useMentorContentErrorHandler } from './mentor-content-error-boundary';

interface ContentCardProps {
    content: ContentType;
    onEdit: (content: ContentType) => void;
    onDelete: (id: string) => void;
    onOpenCourse: (content: ContentType) => void;
}

const ContentCard = ({ content, onEdit, onDelete, onOpenCourse }: ContentCardProps) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                    {content.type === 'COURSE' && <Book className="h-4 w-4 text-blue-500" />}
                    {content.type === 'FILE' && <FileText className="h-4 w-4 text-orange-500" />}
                    {content.type === 'URL' && <Link className="h-4 w-4 text-green-500" />}
                    <Badge variant="outline">{content.type}</Badge>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {content.type === 'COURSE' && (
                            <DropdownMenuItem onClick={() => onOpenCourse(content)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Open Builder
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onEdit(content)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(content.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent>
                <CardTitle className="text-base font-semibold truncate">{content.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1 min-h-[40px]">
                    {content.description || "No description provided."}
                </CardDescription>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(content.updatedAt).toLocaleDateString()}</span>
                </div>
            </CardContent>
        </Card>
    );
};

export const MentorContent = memo(() => {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editingContent, setEditingContent] = useState<ContentType | null>(null);
    const [courseBuilderContent, setCourseBuilderContent] = useState<ContentType | null>(null);
    const [activeTab, setActiveTab] = useState('all');

    const { data: content = [], isLoading } = useContentList();
    const deleteContentMutation = useDeleteContent();
    const { handleError } = useMentorContentErrorHandler();

    // Memoize event handlers to prevent unnecessary re-renders of child components
    const handleEdit = useCallback((content: ContentType) => {
        try {
            setEditingContent(content);
        } catch (error) {
            handleError(error as Error, 'content-edit');
        }
    }, [handleError]);

    const handleDelete = useCallback(async (id: string) => {
        try {
            if (confirm('Are you sure you want to delete this content?')) {
                deleteContentMutation.mutate(id);
            }
        } catch (error) {
            handleError(error as Error, 'content-delete');
        }
    }, [deleteContentMutation, handleError]);

    const handleOpenCourse = useCallback((content: ContentType) => {
        try {
            setCourseBuilderContent(content);
        } catch (error) {
            handleError(error as Error, 'course-builder-open');
        }
    }, [handleError]);

    const handleCreateDialogOpen = useCallback(() => {
        setCreateDialogOpen(true);
    }, []);

    const handleCreateDialogClose = useCallback(() => {
        setCreateDialogOpen(false);
    }, []);

    const handleEditDialogClose = useCallback(() => {
        setEditingContent(null);
    }, []);

    const handleCourseBuilderBack = useCallback(() => {
        setCourseBuilderContent(null);
    }, []);

    // Memoize filtered content to prevent unnecessary re-computation
    const filteredContent = useMemo(() => {
        return content.filter(item => {
            if (activeTab === 'all') return true;
            return item.type === activeTab.toUpperCase();
        });
    }, [content, activeTab]);

    // Memoize tab counts for performance
    const tabCounts = useMemo(() => {
        return {
            all: content.length,
            course: content.filter(item => item.type === 'COURSE').length,
            file: content.filter(item => item.type === 'FILE').length,
            url: content.filter(item => item.type === 'URL').length,
        };
    }, [content]);

    if (courseBuilderContent) {
        return (
            <MentorContentErrorBoundary context="course-builder">
                <CourseBuilder
                    content={courseBuilderContent}
                    onBack={handleCourseBuilderBack}
                />
            </MentorContentErrorBoundary>
        );
    }

    return (
        <MentorContentErrorBoundary context="content-list">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Content</h1>
                        <p className="text-muted-foreground mt-2">
                            Create and manage learning materials for your mentees
                        </p>
                    </div>
                    <Button onClick={handleCreateDialogOpen}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Content
                    </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="all">All Content</TabsTrigger>
                        <TabsTrigger value="course">Courses</TabsTrigger>
                        <TabsTrigger value="file">Files</TabsTrigger>
                        <TabsTrigger value="url">URLs</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="mt-6">
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <Card key={i} className="animate-pulse">
                                        <CardHeader>
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : filteredContent.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        {activeTab === 'all' ? 'No content yet' : `No ${activeTab.toLowerCase()} content yet`}
                                    </h3>
                                    <p className="text-muted-foreground text-center mb-4">
                                        Start creating content to share with your mentees
                                    </p>
                                    <Button onClick={() => setCreateDialogOpen(true)}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Your First Content
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredContent.map((item) => (
                                    <ContentCard
                                        key={item.id}
                                        content={item}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onOpenCourse={handleOpenCourse}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {editingContent && (
                    <EditContentDialog
                        content={editingContent}
                        open={!!editingContent}
                        onOpenChange={handleEditDialogClose}
                    />
                )}
                <CreateContentDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                    onSuccess={handleCreateDialogClose}
                />
            </div>
        </MentorContentErrorBoundary>
    );
});
