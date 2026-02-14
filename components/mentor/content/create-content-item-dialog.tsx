"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Video, FileText, Type, Link as LinkIcon, Upload, Clock, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUploadFile } from '@/hooks/queries/use-content-queries';

const contentItemSchema = z.object({
    type: z.enum(['VIDEO', 'DOCUMENT', 'TEXT', 'URL']),
    title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
    description: z.string().max(500, 'Description too long').optional(),
    orderIndex: z.number().min(0).default(0),
    estimatedDuration: z.number().min(0, 'Duration must be positive').optional(),
    isRequired: z.boolean().default(true),
    allowDownload: z.boolean().default(false),
    // For file uploads (VIDEO, DOCUMENT)
    file: z.any().optional(),
    fileUrl: z.string().optional(),
    // For TEXT specific
    textContent: z.string().optional(),
    // For URL specific
    externalUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
}).refine((data) => {
    if (data.type === 'VIDEO' && !data.fileUrl && !data.file) return false;
    if (data.type === 'DOCUMENT' && !data.fileUrl && !data.file) return false;
    if (data.type === 'TEXT' && !data.textContent) return false;
    if (data.type === 'URL' && !data.externalUrl) return false;
    return true;
}, {
    message: "Required content is missing",
    path: ["file"] // This will attach error to file field, but it's a general validation
});

type ContentItemForm = z.infer<typeof contentItemSchema>;

interface CreateContentItemDialogProps {
    sectionId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateContentItemDialog({ sectionId, open, onOpenChange }: CreateContentItemDialogProps) {
    const [activeTab, setActiveTab] = useState('type');
    const [uploadProgress, setUploadProgress] = useState(0);
    const queryClient = useQueryClient();
    const uploadFile = useUploadFile();

    const form = useForm<ContentItemForm>({
        resolver: zodResolver(contentItemSchema),
        defaultValues: {
            type: 'VIDEO',
            orderIndex: 0,
            isRequired: true,
            allowDownload: false,
        },
    });

    const createContentItemMutation = useMutation({
        mutationFn: async (data: ContentItemForm) => {
            // Prepare payload based on type
            const payload: any = {
                type: data.type,
                title: data.title,
                description: data.description,
                orderIndex: data.orderIndex,
                estimatedDuration: data.estimatedDuration,
                isRequired: data.isRequired,
                allowDownload: data.allowDownload,
            };

            if (data.type === 'VIDEO' || data.type === 'DOCUMENT') {
                payload.fileUrl = data.fileUrl; // This should be set after upload
            } else if (data.type === 'TEXT') {
                payload.content = data.textContent;
            } else if (data.type === 'URL') {
                payload.content = data.externalUrl;
            }

            const response = await fetch(`/api/mentors/content/sections/${sectionId}/content-items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create content item');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mentor-content'] });
            toast.success('Content item created successfully!');
            onOpenChange(false);
            form.reset();
            setActiveTab('type');
            setUploadProgress(0);
        },
        onError: (error: Error) => {
            toast.error(error.message);
        },
    });

    const onSubmit = async (data: ContentItemForm) => {
        try {
            // Handle file upload if present
            if ((data.type === 'VIDEO' || data.type === 'DOCUMENT') && data.file) {
                // In a real app, we would upload to S3/Cloudinary here
                // simulating upload for now or using the useUploadFile hook if implemented

                /* 
                // Real implementation would be something like:
                const fileUrl = await uploadFile.mutateAsync({ 
                  file: data.file,
                  onProgress: (progress) => setUploadProgress(progress) 
                });
                data.fileUrl = fileUrl;
                */

                // Verify mock upload
                setUploadProgress(10);
                await new Promise(resolve => setTimeout(resolve, 500));
                setUploadProgress(50);
                await new Promise(resolve => setTimeout(resolve, 500));
                setUploadProgress(100);

                // Mock URL for now if upload hook not fully ready
                data.fileUrl = URL.createObjectURL(data.file);
            }

            createContentItemMutation.mutate(data);
        } catch (error) {
            toast.error('Failed to upload file');
            setUploadProgress(0);
        }
    };

    const contentType = form.watch('type');
    const isLoading = createContentItemMutation.isPending || uploadFile.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">Add Content Item</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="type">Content Type</TabsTrigger>
                                <TabsTrigger value="details">Details & Content</TabsTrigger>
                                <TabsTrigger value="settings">Settings</TabsTrigger>
                            </TabsList>

                            <TabsContent value="type" className="space-y-6 pt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { id: 'VIDEO', label: 'Video', icon: Video, description: 'Upload a video file' },
                                        { id: 'DOCUMENT', label: 'Document', icon: FileText, description: 'PDF, Slides, or Worksheets' },
                                        { id: 'TEXT', label: 'Text / Article', icon: Type, description: 'Written content within the platform' },
                                        { id: 'URL', label: 'External Link', icon: LinkIcon, description: 'Link to external resources' },
                                    ].map((type) => {
                                        const Icon = type.icon;
                                        return (
                                            <div
                                                key={type.id}
                                                className={`cursor-pointer border-2 rounded-lg p-4 hover:border-blue-500 transition-all ${contentType === type.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                                    }`}
                                                onClick={() => {
                                                    form.setValue('type', type.id as any);
                                                    setActiveTab('details');
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-full ${contentType === type.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        <Icon className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{type.label}</h3>
                                                        <p className="text-sm text-gray-500">{type.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </TabsContent>

                            <TabsContent value="details" className="space-y-6 pt-4">
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Introduction Video" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Brief description of this content" rows={3} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {contentType === 'VIDEO' && (
                                        <FormField
                                            name="file"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Video File *</FormLabel>
                                                    <FormControl>
                                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                                                            <input
                                                                type="file"
                                                                accept="video/*"
                                                                className="hidden"
                                                                id="video-upload"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) field.onChange(file);
                                                                }}
                                                            />
                                                            <label htmlFor="video-upload" className="cursor-pointer block">
                                                                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    {field.value ? field.value.name : 'Click to upload video'}
                                                                </span>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    MP4, WebM up to 500MB
                                                                </p>
                                                            </label>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                    {uploadProgress > 0 && uploadProgress < 100 && (
                                                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                                            <div
                                                                className="bg-blue-600 h-2.5 rounded-full"
                                                                style={{ width: `${uploadProgress}%` }}
                                                            ></div>
                                                        </div>
                                                    )}
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {contentType === 'DOCUMENT' && (
                                        <FormField
                                            name="file"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Document File *</FormLabel>
                                                    <FormControl>
                                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                                                            <input
                                                                type="file"
                                                                accept=".pdf,.doc,.docx,.ppt,.pptx"
                                                                className="hidden"
                                                                id="doc-upload"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) field.onChange(file);
                                                                }}
                                                            />
                                                            <label htmlFor="doc-upload" className="cursor-pointer block">
                                                                <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                                                <span className="text-sm font-medium text-gray-700">
                                                                    {field.value ? field.value.name : 'Click to upload document'}
                                                                </span>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    PDF, Slides, Docs up to 50MB
                                                                </p>
                                                            </label>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {contentType === 'TEXT' && (
                                        <FormField
                                            control={form.control}
                                            name="textContent"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Content Text *</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Write your content here..."
                                                            rows={10}
                                                            className="font-mono text-sm"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {contentType === 'URL' && (
                                        <FormField
                                            control={form.control}
                                            name="externalUrl"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>External URL *</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                            <Input
                                                                placeholder="https://example.com/resource"
                                                                className="pl-10"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="settings" className="space-y-6 pt-4">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="orderIndex"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Order Index</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>Position in the section</FormDescription>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="estimatedDuration"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Duration (min)</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                className="pl-10"
                                                                {...field}
                                                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormDescription>Estimated time to complete</FormDescription>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-3 pt-4 border-t">
                                        <FormField
                                            control={form.control}
                                            name="isRequired"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>Required for completion</FormLabel>
                                                        <FormDescription>
                                                            Students must complete this item to progress
                                                        </FormDescription>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        {(contentType === 'VIDEO' || contentType === 'DOCUMENT') && (
                                            <FormField
                                                control={form.control}
                                                name="allowDownload"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                        <FormControl>
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>Allow Download</FormLabel>
                                                            <FormDescription>
                                                                Students can download this file
                                                            </FormDescription>
                                                        </div>
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="flex justify-between pt-6 border-t">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <div className="flex gap-2">
                                {activeTab !== 'type' && (
                                    <Button type="button" variant="outline" onClick={() => setActiveTab(prev => prev === 'settings' ? 'details' : 'type')}>
                                        Back
                                    </Button>
                                )}

                                {activeTab === 'settings' ? (
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Create Content
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Button type="button" onClick={() => setActiveTab(prev => prev === 'type' ? 'details' : 'settings')}>
                                        Next
                                    </Button>
                                )}
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
