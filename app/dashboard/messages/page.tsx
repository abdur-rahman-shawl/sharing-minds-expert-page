'use client'

import { MessageSquare, Search, Plus, Rocket, Sparkles } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const PLACEHOLDER_CONVERSATIONS = [
    { name: 'Platform Support', initials: 'SM', lastMsg: 'Welcome to SharingMinds! Your mentor account is set up.', time: 'Just now', unread: true, role: 'admin' },
    { name: 'Mentee Name', initials: '??', lastMsg: 'Hey! I would love to book a session with you...', time: '—', unread: false, role: 'mentee' },
    { name: 'Mentee Name', initials: '??', lastMsg: 'Thanks for the great session yesterday!', time: '—', unread: false, role: 'mentee' },
    { name: 'Mentee Name', initials: '??', lastMsg: 'Could you share some resources on...', time: '—', unread: false, role: 'mentee' },
]

export default function MessagesPage() {
    return (
        <div className="p-6 space-y-4">
            {/* Coming soon banner */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-xl border border-amber-500/20 p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10">
                    <Rocket className="h-4 w-4 text-amber-400" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium text-amber-600 dark:text-amber-300">Messaging is coming soon</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">This is a preview of your messaging interface. Real-time chat will be available at launch.</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-500 dark:text-amber-400">
                    <Sparkles className="h-3 w-3" />
                    <span>Preview</span>
                </div>
            </div>

            {/* Chat preview */}
            <div className="bg-gray-50 dark:bg-slate-900/60 rounded-xl border border-gray-200 dark:border-slate-800 overflow-hidden" style={{ height: 'calc(100vh - 14rem)' }}>
                <div className="grid grid-cols-[280px_1fr] h-full">
                    {/* Conversation list */}
                    <div className="border-r border-gray-200 dark:border-slate-800 flex flex-col">
                        {/* Search */}
                        <div className="p-3 border-b border-gray-200 dark:border-slate-800">
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800/60 rounded-lg px-3 py-2">
                                <Search className="h-3.5 w-3.5 text-gray-400 dark:text-slate-600" />
                                <span className="text-xs text-gray-400 dark:text-slate-600">Search messages...</span>
                            </div>
                        </div>

                        {/* Conversations */}
                        <div className="flex-1 overflow-y-auto">
                            {PLACEHOLDER_CONVERSATIONS.map((conv, i) => (
                                <div
                                    key={i}
                                    className={`flex items-start gap-3 p-3 border-b border-gray-100 dark:border-slate-800/40 transition-colors ${i === 0 ? 'bg-gray-100 dark:bg-slate-800/30' : 'opacity-40'
                                        }`}
                                >
                                    <Avatar className="h-9 w-9 shrink-0">
                                        <AvatarFallback className={`text-xs font-medium ${conv.role === 'admin'
                                            ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300'
                                            : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500'
                                            }`}>
                                            {conv.initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm font-medium truncate ${conv.role === 'admin' ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-500 dark:text-slate-400'}`}>
                                                {conv.name}
                                            </p>
                                            <span className="text-[10px] text-gray-400 dark:text-slate-600 shrink-0">{conv.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 dark:text-slate-600 truncate mt-0.5">{conv.lastMsg}</p>
                                    </div>
                                    {conv.unread && (
                                        <div className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-2" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat area */}
                    <div className="flex flex-col">
                        {/* Chat header */}
                        <div className="p-3 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-xs">SM</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-slate-300">Platform Support</p>
                                    <p className="text-[10px] text-emerald-500">● Online</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-4 flex flex-col justify-end">
                            <div className="space-y-3">
                                {/* System message */}
                                <div className="flex justify-start">
                                    <div className="max-w-[70%] bg-gray-100 dark:bg-slate-800/60 rounded-xl rounded-bl-sm px-4 py-2.5 border border-gray-200 dark:border-slate-700/30">
                                        <p className="text-sm text-gray-700 dark:text-slate-300">Welcome to SharingMinds! 🎉</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Your mentor account has been verified. You&apos;re now part of our founding mentor network.</p>
                                        <p className="text-[10px] text-gray-400 dark:text-slate-600 mt-1.5">Just now</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-gray-200 dark:border-slate-800">
                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800/40 rounded-xl px-4 py-2.5 border border-gray-200 dark:border-slate-700/30">
                                <Plus className="h-4 w-4 text-gray-400 dark:text-slate-600" />
                                <span className="text-sm text-gray-400 dark:text-slate-600 flex-1">Type a message...</span>
                                <MessageSquare className="h-4 w-4 text-gray-400 dark:text-slate-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
